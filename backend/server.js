require('dotenv').config();
// --- Núcleo / terceros ---
const express = require('express');
const mysql2 = require('mysql2');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// AWS S3
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand, // <-- Faltaba en tu código original
} = require('@aws-sdk/client-s3');

// Google OAuth
const { OAuth2Client } = require('google-auth-library');

// (Opcional) Bcrypt para migrar contraseñas
const bcrypt = require('bcrypt');

// Util propio (respetado para compatibilidad)
const { decryptData, encryptData } = require('./cryptoutils');

// --- Config básica ---
const app = express();
const server = http.createServer(app);

// CORS: permite front específico (o “*” en dev)
const CORS_ORIGIN = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: false,
  })
);

// Seguridad y logs
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('combined'));

// Body parsers con límites
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limit básico para evitar abuso de endpoints sensibles
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120, // 120 req/min por IP
});
app.use(apiLimiter);

// Socket.IO (Render soporta websockets)
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: false
  },
  transports: ['websocket','polling'],
});

// Confianza de proxy (Render usa proxy)
app.set('trust proxy', 1);

// --- Variables de entorno críticas ---
const {
  PORT = 3000,
  NODE_ENV = 'production',

  // DB
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  DB_SSL = 'false', // "true" para Planetscale/Railway SSL

  // Google OAuth
  GOOGLE_CLIENT_ID,

  // SMTP
  SMTP_SERVICE, // e.g. "gmail"
  SMTP_USER,
  SMTP_PASS,

  // S3
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET,

  // App
  PUBLIC_BUCKET_BASE // p.ej. https://novamarket-img.s3.amazonaws.com
} = process.env;

// --- Validaciones mínimas (log de advertencia, no crashea) ---
function warnIfEmpty(name, value) {
  if (!value) console.warn(`[WARN] Falta variable de entorno ${name}.`);
}
['DB_HOST','DB_USER','DB_PASSWORD','DB_NAME','GOOGLE_CLIENT_ID','SMTP_USER','SMTP_PASS','AWS_REGION','AWS_ACCESS_KEY_ID','AWS_SECRET_ACCESS_KEY','S3_BUCKET'].forEach(n => warnIfEmpty(n, process.env[n]));

// --- DB (Pool) ---
const pool = mysql2.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT ? Number(DB_PORT) : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
});

// Probar conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al obtener conexión de la base de datos:', err);
  } else {
    if (connection) connection.release();
    console.log('Conectado al pool de la base de datos');
  }
});

// --- Socket.IO ---
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('send_message', (data) => {
    const { sender_id, receiver_id, content } = data;
    pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [sender_id, receiver_id, content],
      (err, results) => {
        if (err) {
          console.error('Error al enviar el mensaje:', err);
          return;
        }
        io.emit('receive_message', {
          id: results.insertId,
          sender_id,
          receiver_id,
          content,
          timestamp: new Date(),
        });
      }
    );
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// --- S3 client ---
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// --- Multer (memoria) ---
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// --- Nodemailer ---
const transporter = nodemailer.createTransport({
  service: SMTP_SERVICE || 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// --- Google OAuth ---
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// --- Utils ---
const ADMIN_ID = 1;

// path robusto para Invoice.html (debe estar empaquetado en el repo)
const INVOICE_TEMPLATE_PATH = path.resolve(__dirname, 'Invoice.html');

// --- Health y root ---
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.get('/', (_req, res) => res.send('NovaMarket API (Render)'));

// ===================== RUTAS =====================

// Lista de usuarios que han chateado con admin
app.get('/chats/users', (req, res) => {
  const query = `
    SELECT DISTINCT u.id, u.name
    FROM users u
    JOIN messages m
      ON (u.id = m.sender_id AND m.receiver_id = ?)
      OR (u.id = m.receiver_id AND m.sender_id = ?)
  `;
  pool.query(query, [ADMIN_ID, ADMIN_ID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la consulta SQL' });
    res.json(results);
  });
});

// Mensajes de un usuario específico
app.get('/chats/:userId', (req, res) => {
  const userId = req.params.userId;
  pool.query(
    'SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ?',
    [userId, userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Email verificación
const sendVerificationEmail = (email, verificationCode) => {
  const mailOptions = {
    from: SMTP_USER,
    to: email,
    subject: 'Código de Verificación de NovaMarket',
    html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p><p>Por favor, ingresa este código en la aplicación para verificar tu correo electrónico.</p>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error('Error al enviar correo de verificación:', error);
    else console.log('Correo de verificación enviado:', info.response);
  });
};

// Verificar código
app.post('/verify-code', (req, res) => {
  const { userId, verificationCode } = req.body;
  pool.query(
    'SELECT * FROM users WHERE id = ? AND verification_token = ?',
    [userId, verificationCode],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al verificar el código' });

      if (results.length > 0) {
        pool.query(
          'UPDATE users SET verified = 1, verification_token = "" WHERE id = ?',
          [userId],
          (err2) => {
            if (err2) return res.status(500).json({ error: 'Error al actualizar la verificación del usuario' });
            return res.status(200).json({ verified: true, message: 'Correo verificado exitosamente' });
          }
        );
      } else {
        return res.status(400).json({ error: 'Código de verificación incorrecto' });
      }
    }
  );
});

// Estado de verificación
app.get('/check-verification-status', (req, res) => {
  const { userId } = req.query;
  pool.query('SELECT verified FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al verificar el estado del usuario' });
    if (results.length > 0) return res.status(200).json({ verified: results[0].verified });
    return res.status(400).json({ error: 'Usuario no encontrado' });
  });
});

// Google login
app.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload['email'];

    pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
      if (error) return res.status(500).json({ error: 'Error al buscar usuario' });

      if (results.length === 0) {
        const newUser = {
          name: payload['name'],
          email: payload['email'],
          password: '', // social
          verificationToken: '',
          role: 'user',
          verified: 1,
          banned: 0,
        };
        pool.query(
          'INSERT INTO users (name, email, password, verification_token, role, verified, banned) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [newUser.name, newUser.email, newUser.password, newUser.verificationToken, newUser.role, newUser.verified, newUser.banned],
          (error2) => {
            if (error2) return res.status(500).json({ error: 'Error al guardar el usuario' });
            res.json({ user: newUser });
          }
        );
      } else {
        res.json({ user: results[0] });
      }
    });
  } catch (error) {
    console.error('Error al autenticar con Google:', error);
    res.status(500).json({ error: 'Error al autenticar con Google' });
  }
});

// Registro (NOTA: mantengo tu esquema con encryptData; ideal migrar a bcrypt)
app.post('/registro', (req, res) => {
  const { name, email, password } = req.body;
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const role = 'user';

  pool.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al verificar el correo electrónico' });
    if (results.length > 0) return res.status(400).json({ error: 'El correo electrónico ya está registrado' });

    // Mantengo encryptData para compatibilidad; alternativa recomendada: const hashed = await bcrypt.hash(password, 10)
    const encryptedPassword = encryptData(password);
    pool.query(
      'INSERT INTO users (name, email, password, verification_token, role, verified, banned) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, encryptedPassword, verificationCode, role, 0, 0],
      (err2, result) => {
        if (err2) return res.status(500).json({ error: 'Error al registrar usuario' });

        sendVerificationEmail(email, verificationCode);
        pool.query('SELECT * FROM users WHERE id = ?', [result.insertId], (err3, rows) => {
          if (err3) return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
          return res.status(200).json({
            message: 'Usuario registrado. Verifica tu correo electrónico',
            user: rows[0],
          });
        });
      }
    );
  });
});

// Login (compat: intenta decryptData y como fallback intenta bcrypt)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  pool.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al iniciar sesión' });
    if (results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = results[0];
    if (user.verified === 0) {
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      pool.query('UPDATE users SET verification_token = ? WHERE email = ?', [newCode, email], (err2) => {
        if (err2) return res.status(500).json({ error: 'Error al generar nuevo código de verificación' });
        sendVerificationEmail(email, newCode);
        return res.status(200).json({
          message: 'Correo no verificado. Nuevo código enviado.',
          redirect: '/verification',
          user,
        });
      });
      return;
    }

    try {
      // 1) Intentar tu esquema reversible
      let decrypted = '';
      try {
        decrypted = decryptData(user.password);
      } catch (_) { /* no-op */ }

      if (decrypted && password === decrypted) {
        return res.status(200).json({ message: 'Inicio de sesión exitoso', user });
      }

      // 2) Fallback bcrypt (por si migras cuentas nuevas a bcrypt)
      if (user.password && user.password.startsWith('$2')) {
        const ok = await bcrypt.compare(password, user.password);
        if (ok) return res.status(200).json({ message: 'Inicio de sesión exitoso', user });
      }

      return res.status(401).json({ error: 'Credenciales inválidas' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error de autenticación' });
    }
  });
});

// Obtener usuario
app.get('/data/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    return res.status(200).json({ message: 'Usuario obtenido exitosamente', user: results[0] });
  });
});

// Producto por QR
app.get('/product', (req, res) => {
  const qrCode = req.query.code;
  pool.query('SELECT * FROM products WHERE barcode = ?', [qrCode], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar la base de datos' });
    if (results.length > 0) return res.json(results[0]);
    res.status(404).json({ error: 'Producto no encontrado' });
  });
});

// Productos por categoría
app.get('/productsByCategory', (req, res) => {
  const category = req.query.category;
  pool.query('SELECT * FROM products WHERE category = ?', [category], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar la base de datos' });
    if (results.length > 0) return res.json(results);
    res.status(404).json({ error: 'No se encontraron productos en esta categoría' });
  });
});

// Actualizar usuario (compat encrypt + opcional bcrypt)
app.put('/data/:id', async (req, res) => {
  const id = req.params.id;
  const { name, email, oldPassword, newPassword } = req.body;

  if (oldPassword && newPassword) {
    pool.query('SELECT password FROM users WHERE id = ?', [id], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al verificar la contraseña antigua' });

      const current = results[0]?.password || '';

      // Validar oldPassword con ambos esquemas
      let validOld = false;
      try {
        const dec = decryptData(current);
        if (dec && dec === oldPassword) validOld = true;
      } catch (_) { /* no-op */ }

      if (!validOld && current.startsWith('$2')) {
        validOld = await bcrypt.compare(oldPassword, current);
      }

      if (!validOld) return res.status(401).json({ error: 'Contraseña antigua incorrecta' });
      if (oldPassword === newPassword) return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la antigua.' });

      // Mantén encryptData por compatibilidad. (Sugerido: bcrypt.hash(newPassword,10))
      const encryptedNewPassword = encryptData(newPassword);

      pool.query(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, encryptedNewPassword, id],
        (err2) => {
          if (err2) return res.status(500).json({ error: 'Error al actualizar datos del usuario' });
          return res.status(200).json({ message: 'Datos del usuario actualizados exitosamente' });
        }
      );
    });
  } else {
    pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar datos del usuario' });
      return res.status(200).json({ message: 'Datos del usuario actualizados exitosamente' });
    });
  }
});

// Tarjetas
app.post('/cards', (req, res) => {
  const { id_user, number, holder, date, cvv } = req.body;
  pool.query(
    'INSERT INTO cards (id_user, number, holder, date, cvv) VALUES (?, ?, ?, ?, ?)',
    [id_user, number, holder, date, cvv],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al registrar la tarjeta' });
      return res.status(200).json({ message: 'Tarjeta registrada exitosamente' });
    }
  );
});

app.get('/getCards/:userId', (req, res) => {
  const userId = req.params.userId;
  pool.query('SELECT * FROM cards WHERE id_user = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los datos de las tarjetas' });
    return res.status(200).json({ message: 'Tarjetas de crédito obtenidas exitosamente', cards: results });
  });
});

// Carritos
app.get('/getCarts/:userId', (req, res) => {
  const userId = req.params.userId;
  pool.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los carritos' });
    return res.status(200).json({ message: 'Carritos obtenidos', carts: results });
  });
});

app.post('/addCart', (req, res) => {
  const { user_id, name, date, card_id, total, type, address_id, status } = req.body;
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  pool.query(
    'INSERT INTO cart (user_id, name, date, card_id, total, type, address_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [user_id, name, formattedDate, card_id, total, type, address_id, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al registrar el carrito' });
      return res.status(200).json({ cart_id: result.insertId });
    }
  );
});

app.post('/addCartItem', (req, res) => {
  const { cart_id, product_id, quantity } = req.body;
  pool.query(
    'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
    [cart_id, product_id, quantity],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al registrar el elemento del carrito' });
      return res.status(200).json({ message: 'Elemento del carrito registrado exitosamente' });
    }
  );
});

// Completar compra + enviar factura
app.post('/completePurchase', (req, res) => {
  const { cart_id, user_id } = req.body;

  pool.query('SELECT * FROM cart WHERE id = ?', [cart_id], (err, cartResults) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los detalles del carrito' });
    const cart = cartResults[0];

    pool.query(
      'SELECT ci.quantity, p.name, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?',
      [cart_id],
      (err2, cartItemsResults) => {
        if (err2) return res.status(500).json({ error: 'Error al obtener los artículos del carrito' });
        const cartItems = cartItemsResults;

        pool.query('SELECT * FROM users WHERE id = ?', [user_id], (err3, userResults) => {
          if (err3) return res.status(500).json({ error: 'Error al obtener los detalles del usuario' });
          const user = userResults[0];

          pool.query('SELECT * FROM cards WHERE id_user = ?', [user.id], (err4, cardResults) => {
            if (err4) return res.status(500).json({ error: 'Error al obtener la dirección de facturación' });
            const card = cardResults[0];

            const itemsHtml = cartItems
              .map(
                (item) => `
              <tr class="item">
                <td class="desc">${item.name}</td>
                <td class="qty">${item.quantity}</td>
                <td class="amt">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>`
              )
              .join('');

            const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
            const deliveryFee = 0.0;
            const total = (parseFloat(subtotal) + deliveryFee).toFixed(2);

            let invoiceHtml = fs.readFileSync(INVOICE_TEMPLATE_PATH, 'utf-8');
            invoiceHtml = invoiceHtml
              .replace('{{userName}}', user.name)
              .replace('{{orderNumber}}', cart_id)
              .replace('{{orderDate}}', new Date(cart.date).toLocaleDateString())
              .replace('{{items}}', itemsHtml)
              .replace('{{subtotal}}', subtotal)
              .replace('{{deliveryFee}}', deliveryFee.toFixed(2))
              .replace('{{total}}', total)
              .replace('{{billingAddress}}', `Calle Padre Salazar Simpson, Soyapango, 1019`)
              .replace('{{cardType}}', 'Visa')
              .replace('{{last4Digits}}', String(card.number || '').slice(-4));

            const mailOptions = {
              from: SMTP_USER,
              to: user.email,
              subject: `Factura de compra #${cart_id}`,
              html: invoiceHtml,
            };

            transporter.sendMail(mailOptions, (err5) => {
              if (err5) return res.status(500).json({ error: 'Error al enviar el correo' });
              res.status(200).json({ message: 'Factura enviada correctamente' });
            });
          });
        });
      }
    );
  });
});

// Producto por nombre
app.get('/productByName', (req, res) => {
  const productName = req.query.name;
  pool.query('SELECT * FROM products WHERE name = ?', [productName], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar la base de datos' });
    if (results.length > 0) return res.json(results[0]);
    res.status(404).json({ error: 'Producto no encontrado' });
  });
});

// Detalle de carrito
app.get('/getCartDetails/:cartId', (req, res) => {
  const cartId = req.params.cartId;
  pool.query(
    `
    SELECT ci.*, p.name, p.img, p.weight, p.price, c.status
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    JOIN cart c ON ci.cart_id = c.id
    WHERE ci.cart_id = ?`,
    [cartId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener los detalles del carrito' });
      return res.status(200).json({
        message: 'Detalles del carrito obtenidos exitosamente',
        products: results,
        status: results.length > 0 ? results[0].status : null,
      });
    }
  );
});

// Direcciones
app.post('/guardar-direccion', (req, res) => {
  const { userId, addressName, lat, lng } = req.body;
  pool.query(
    'INSERT INTO address (id_user, name, latitude, longitude) VALUES (?, ?, ?, ?)',
    [userId, addressName, lat, lng],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al guardar la dirección' });
      return res.status(200).json({ message: 'Dirección guardada exitosamente', address: result });
    }
  );
});

app.get('/getAddresses/:userId', (req, res) => {
  const userId = req.params.userId;
  pool.query('SELECT * FROM address WHERE id_user = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los datos de las direcciones' });
    return res.status(200).json({ message: 'Direcciones obtenidas exitosamente', addresses: results });
  });
});

app.get('/getAddress/:addressId', (req, res) => {
  const addressId = req.params.addressId;
  pool.query('SELECT * FROM address WHERE id = ?', [addressId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los datos de la dirección' });
    return res.status(200).json({ message: 'Dirección obtenida exitosamente', address: results[0] });
  });
});

app.delete('/deleteAddress/:id', (req, res) => {
  const addressId = req.params.id;
  pool.query('DELETE FROM address WHERE id = ?', [addressId], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar la dirección' });
    return res.status(200).json({ message: 'Dirección eliminada exitosamente' });
  });
});

// Comentarios
app.post('/comments', (req, res) => {
  const { userId, comment } = req.body;
  if (!comment) return res.status(400).json({ error: 'El comentario es requerido' });

  pool.query('INSERT INTO comments (id_user, comment) VALUES (?, ?)', [userId, comment], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al guardar el comentario' });
    return res.status(201).json({ message: 'Comentario guardado con éxito', commentId: result.insertId });
  });
});

// Productos (admin)
app.get('/products', (req, res) => {
  pool.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos' });
    res.json(results);
  });
});

app.post('/products', upload.single('file'), async (req, res) => {
  const { category, name, price, weight, code, brand, calories, type, barcode } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Falta archivo de imagen' });

  const uploadParams = {
    Bucket: S3_BUCKET,
    Key: `${code}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    const publicBase = PUBLIC_BUCKET_BASE || `https://${S3_BUCKET}.s3.amazonaws.com`;
    const imgUrl = `${publicBase}/${code}`;

    const query =
      'INSERT INTO products (category, name, price, weight, img, code, brand, calories, type, barcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    pool.query(
      query,
      [category, name, price, weight, imgUrl, code, brand, calories, type, barcode],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al añadir producto' });
        res.status(201).json({ id: result.insertId });
      }
    );
  } catch (err) {
    console.error('Error uploading image to S3:', err);
    res.status(500).json({ error: 'Error uploading image to S3' });
  }
});

app.delete('/products/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar producto' });
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  });
});

app.put('/products/:id', upload.single('file'), async (req, res) => {
  const productId = req.params.id;
  const { name, code, brand, calories, price, weight, category, type, barcode } = req.body;
  const file = req.file;

  try {
    if (file) {
      const oldProductQuery = 'SELECT img FROM products WHERE id = ?';
      pool.query(oldProductQuery, [productId], async (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al obtener imagen previa' });

        const oldImgKey = (result[0]?.img || '').split('/').pop();
        if (oldImgKey) {
          try {
            await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: oldImgKey }));
          } catch (deleteErr) {
            console.error('Error deleting old image from S3:', deleteErr);
          }
        }

        const uploadParams = {
          Bucket: S3_BUCKET,
          Key: `${code}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        try {
          await s3.send(new PutObjectCommand(uploadParams));
          const publicBase = PUBLIC_BUCKET_BASE || `https://${S3_BUCKET}.s3.amazonaws.com`;
          const imgUrl = `${publicBase}/${code}`;

          const query = `UPDATE products SET name = ?, code = ?, brand = ?, calories = ?, price = ?, img = ?, weight = ?, category = ?, type = ?, barcode = ? WHERE id = ?`;
          pool.query(
            query,
            [name, code, brand, calories, price, imgUrl, weight, category, type, barcode, productId],
            (updateErr, results2) => {
              if (updateErr) return res.status(500).json({ error: 'Error al actualizar producto' });
              if (results2.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
              res.status(200).json({ message: 'Product updated successfully' });
            }
          );
        } catch (uploadErr) {
          console.error('Error uploading new image to S3:', uploadErr);
          res.status(500).json({ error: 'Error uploading new image to S3' });
        }
      });
    } else {
      const query = `UPDATE products SET name = ?, code = ?, brand = ?, calories = ?, price = ?, weight = ?, category = ?, type = ?, barcode = ? WHERE id = ?`;
      pool.query(
        query,
        [name, code, brand, calories, price, weight, category, type, barcode, productId],
        (updateErr, results2) => {
          if (updateErr) return res.status(500).json({ error: 'Error al actualizar producto' });
          if (results2.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
          res.status(200).json({ message: 'Product updated successfully' });
        }
      );
    }
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ error: 'Error processing request' });
  }
});

// Ventas
app.get('/sales', (req, res) => {
  pool.query(
    `
    SELECT c.id AS cartId, c.name AS cartName, c.user_id AS userId, u.name AS userName, c.total AS cartTotal, c.type AS cartType, c.status AS status, c.date AS date, c.address_id AS addressId
    FROM cart c
    JOIN users u ON c.user_id = u.id
  `,
    (err, carts) => {
      if (err) return res.status(500).json({ error: 'Error al obtener las ventas' });

      const cartIds = carts.map((cart) => cart.cartId);
      if (cartIds.length === 0) return res.json(carts);

      pool.query(
        `
        SELECT ci.cart_id AS cartId, p.name AS productName, ci.quantity, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id IN (?)
      `,
        [cartIds],
        (err2, items) => {
          if (err2) return res.status(500).json({ error: 'Error al obtener los detalles de los carritos' });

          pool.query(
            `
            SELECT cc.id AS cartId, a.id AS addressId, a.name AS addressName, a.latitude, a.longitude
            FROM cart cc
            JOIN address a ON cc.address_id = a.id
            WHERE cc.id IN (?)
          `,
            [cartIds],
            (err3, addresses) => {
              if (err3) return res.status(500).json({ error: 'Error al obtener las direcciones' });

              const sales = carts.map((cart) => ({
                ...cart,
                items: items.filter((it) => it.cartId === cart.cartId),
                address: addresses.find((ad) => ad.cartId === cart.cartId),
              }));

              return res.status(200).json(sales);
            }
          );
        }
      );
    }
  );
});

// Notificación de estado
const sendStatusUpdateEmail = (email, userName, orderStatus, cartName) => {
  const mailOptions = {
    from: SMTP_USER,
    to: email,
    subject: 'Actualización de Estado de tu Pedido',
    html: `<p>Hola ${userName},</p>
           <p>El estado de tu pedido (${cartName}) ha sido actualizado a: <strong>${orderStatus}</strong>.</p>
           <p>Gracias por comprar en NovaMarket.</p>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error('Error al enviar el correo de actualización de estado:', error);
    else console.log('Correo de actualización de estado enviado:', info.response);
  });
};

app.put('/status/:id', (req, res) => {
  const saleId = req.params.id;
  const status = req.body.status;

  const query = 'UPDATE cart SET status = ? WHERE id = ?';
  pool.query(query, [status, saleId], (err) => {
    if (err) return res.status(500).send('Error updating sale status');

    pool.query(
      'SELECT u.email, u.name AS userName, c.name AS cartName FROM users u JOIN cart c ON u.id = c.user_id WHERE c.id = ?',
      [saleId],
      (err2, result) => {
        if (err2) return res.status(500).send('Error al obtener el usuario y nombre del carrito');
        const user = result[0];
        sendStatusUpdateEmail(user.email, user.userName, status, user.cartName);
        res.send('Sale status updated and email sent successfully');
      }
    );
  });
});

// Notificaciones admin
app.post('/publish-notification', (req, res) => {
  const { title, message, icon } = req.body;
  pool.query(
    'INSERT INTO notifications (title, message, icon) VALUES (?, ?, ?)',
    [title, message, icon],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar la notificación' });
      return res.status(201).json({ message: 'Notificación guardada con éxito' });
    }
  );
});

app.get('/published-notifications', (req, res) => {
  pool.query('SELECT * FROM notifications', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener notificaciones publicadas' });
    res.status(200).json({ notifications: results });
  });
});

app.delete('/delete-notification/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM notifications WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar la notificación' });
    res.status(200).json({ message: 'Notificación eliminada con éxito' });
  });
});

// Usuarios admin
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users WHERE banned = 0', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    res.json(results);
  });
});

app.get('/banned-users', (req, res) => {
  pool.query('SELECT * FROM users WHERE banned = 1', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios baneados' });
    res.json(results);
  });
});

app.post('/ban-user', (req, res) => {
  const { userId } = req.body;
  pool.query('UPDATE users SET banned = 1 WHERE id = ?', [userId], (err) => {
    if (err) return res.status(500).json({ error: 'Error al banear usuario' });
    return res.status(200).json({ message: 'Usuario baneado exitosamente' });
  });
});

app.post('/unban-user', (req, res) => {
  const { userId } = req.body;
  pool.query('UPDATE users SET banned = 0 WHERE id = ?', [userId], (err) => {
    if (err) return res.status(500).json({ error: 'Error al desbanear usuario' });
    return res.status(200).json({ message: 'Usuario desbaneado exitosamente' });
  });
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  });
});

// --- Arranque + apagado elegante ---
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT} (env: ${NODE_ENV})`);
});

function shutdown() {
  console.log('Cerrando servidor...');
  server.close(() => {
    pool.end?.(() => process.exit(0));
  });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
