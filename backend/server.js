const express = require('express');
const mysql2 = require('mysql2');
const http = require('http'); // Necesario para Socket.IO
const { Server } = require('socket.io');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const app = express();
const server = http.createServer(app); // Crear servidor HTTP
const io = new Server(server, {
    cors: {
        origin: '*', // Asegúrate de que tu front-end pueda conectarse
        methods: ['GET', 'POST'],
    },
});

app.use(cors())
app.use(express.json());

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '230090427927-qu0pihm7sc8p7pphkuk7tqogffm23icu.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const { decryptData, encryptData } = require('./cryptoutils');

// Configuración de base de datos usando createPool
const pool = mysql2.createPool({
    host: 'us-cluster-east-01.k8s.cleardb.net',
    user: 'b86bc3853542cf',
    password: '69f12cce',
    database: 'heroku_73c14a8f4a3cf5f',
    waitForConnections: true,
    connectionLimit: 10, // Ajusta el límite de conexiones según tus necesidades
    queueLimit: 0
});

// Para manejar errores de conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al obtener conexión de la base de datos:', err);
        return;
    }
    if (connection) connection.release();
    console.log('Conectado al pool de la base de datos');
});



// Ruta para obtener la lista de usuarios que han chateado con el administrador
app.get('/chats/users', (req, res) => {
    const adminId = 1; // Asume que el admin tiene un ID de 1

    const query = `
        SELECT DISTINCT 
            users.id, users.name
        FROM 
            users
        JOIN 
            messages 
        ON 
            (users.id = messages.sender_id AND messages.receiver_id = ?) 
        OR 
            (users.id = messages.receiver_id AND messages.sender_id = ?)
    `;

    pool.query(query, [adminId, adminId], (err, results) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ error: 'Error en la consulta SQL' });
        }

        console.log('Resultados de la consulta:', results); // Para depuración
        res.json(results);
    });
});




// Ruta para obtener mensajes de un usuario específico
app.get('/chats/:userId', (req, res) => {
    const userId = req.params.userId;
    pool.query('SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ?', [userId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});



// Configurar Socket.io para mensajes en tiempo real
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('send_message', (data) => {
        const { sender_id, receiver_id, content } = data;
        pool.query('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)', [sender_id, receiver_id, content], (err, results) => {
            if (err) {
                console.error('Error al enviar el mensaje:', err);
                return;
            }
            io.emit('receive_message', { id: results.insertId, sender_id, receiver_id, content, timestamp: new Date() });
        });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});



// Configurar el cliente S3
const s3 = new S3Client({
    region: 'us-east-2', // Por ejemplo, 'us-east-1'
    credentials: {
        accessKeyId: 'AKIAQFC27LIRTDCT3Q7Z',
        secretAccessKey: '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'
    }
});

// Configurar multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB tamaño máximo
});

//Email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'novamarket.sv@gmail.com',
        pass: 'zbyu jixi sdnk plid'
    }
});

const sendVerificationEmail = (email, verificationCode) => {
    const mailOptions = {
        from: 'novamarket.sv@gmail.com',
        to: email,
        subject: 'Código de Verificación de NovaMarket',
        html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p><p>Por favor, ingresa este código en la aplicación para verificar tu correo electrónico.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar correo de verificación:", error);
        } else {
            console.log('Correo de verificación enviado:', info.response);
        }
    });
};




// Ruta para verificar el código de verificación
app.post('/verify-code', (req, res) => {
    const { userId, verificationCode } = req.body;

    pool.query('SELECT * FROM users WHERE id = ? AND verification_token = ?', [userId, verificationCode], (err, results) => {
        if (err) {
            console.error("Error al verificar el código:", err);
            return res.status(500).json({ error: 'Error al verificar el código' });
        }

        if (results.length > 0) {
            pool.query('UPDATE users SET verified = 1, verification_token = "" WHERE id = ?', [userId], (err, result) => {
                if (err) {
                    console.error("Error al actualizar la verificación del usuario:", err);
                    return res.status(500).json({ error: 'Error al actualizar la verificación del usuario' });
                }

                return res.status(200).json({ verified: true, message: 'Correo electrónico verificado exitosamente' });
            });
        } else {
            return res.status(400).json({ error: 'Código de verificación incorrecto' });
        }
    });
});



//Ruta para saber si el usuario ya verificó su correo
app.get('/check-verification-status', (req, res) => {
    const { userId } = req.query;

    pool.query('SELECT verified FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error("Error al verificar el estado del usuario:", err);
            return res.status(500).json({ error: 'Error al verificar el estado del usuario' });
        }

        if (results.length > 0) {
            const verified = results[0].verified;
            return res.status(200).json({ verified });
        } else {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }
    });
});



//Ruta para Google Login
app.post('/google-login', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload['email'];

        // Buscar usuario en la base de datos
        pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
            if (error) {
                console.error('Error al buscar usuario:', error);
                return res.status(500).json({ error: 'Error al buscar usuario' });
            }

            if (results.length === 0) {
                // Si el usuario no existe, crear uno nuevo
                const newUser = {
                    name: payload['name'],
                    email: payload['email'],
                    password: '',
                    verificationToken: '',
                    role: 'user',
                    verified: 1,
                    banned: 0
                };

                pool.query('INSERT INTO users (name, email, password, verification_token, role, verified, banned) VALUES (?, ?, ?, ?, ?, ?, ?)', [newUser.name, newUser.email, newUser.password, newUser.verificationToken, newUser.role, newUser.verified, newUser.banned], (error, results) => {
                    if (error) {
                        console.error('Error al guardar el usuario:', error);
                        return res.status(500).json({ error: 'Error al guardar el usuario' });
                    }

                    // Retornar el usuario autenticado
                    res.json({ user: newUser });
                });
            } else {
                // Retornar el usuario existente
                res.json({ user: results[0] });
            }
        });

    } catch (error) {
        console.error('Error al autenticar con Google:', error);
        res.status(500).json({ error: 'Error al autenticar con Google' });
    }
});



// Ruta para el registro de usuarios.
app.post('/registro', (req, res) => {
    const { name, email, password } = req.body;
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // Genera un código de 4 dígitos
    const role = 'user';

    // Verificar si el correo electrónico ya está registrado
    pool.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error("Error al verificar el correo electrónico:", err);
            return res.status(500).json({ error: 'Error al verificar el correo electrónico' });
        }

        if (results.length > 0) {
            // El correo electrónico ya está registrado
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Insertar el nuevo usuario en la base de datos
        pool.query('INSERT INTO users (name, email, password, verification_token, role, verified, banned) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, email, password, verificationCode, role, 0, 0], (err, result) => {
            if (err) {
                console.error("Error al registrar usuario:", err);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }

            if (result.affectedRows > 0) {
                sendVerificationEmail(email, verificationCode);

                pool.query('SELECT * FROM users WHERE id = ?', [result.insertId], (err, results) => {
                    if (err) {
                        console.error("Error al obtener los datos del usuario:", err);
                        return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
                    }

                    const user = results[0];
                    return res.status(200).json({
                        message: 'Usuario registrado exitosamente, por favor verifica tu correo electrónico',
                        user: user
                    });
                });
            } else {
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
        });
    });
});



// Ruta para el inicio de sesión.
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    pool.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }

        if (results.length > 0) {
            const user = results[0];

            if (user.verified === 0) {
                // El usuario no ha verificado su correo, generar nuevo código
                const newVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();

                // Actualizar el código de verificación en la base de datos
                pool.query('UPDATE users SET verification_token = ? WHERE email = ?', [newVerificationCode, email], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error al generar nuevo código de verificación' });
                    }

                    // Enviar el nuevo correo de verificación
                    sendVerificationEmail(email, newVerificationCode);

                    return res.status(200).json({
                        message: 'Correo no verificado. Nuevo código enviado, por favor verifica tu correo.',
                        redirect: '/verification',
                        user: user
                    });
                });
            } else {
                // Verificar la contraseña si el correo ya está verificado
                const encryptedPasswordFromDB = user.password;
                const decryptedPasswordFromDB = decryptData(encryptedPasswordFromDB);

                if (password === decryptedPasswordFromDB) {
                    return res.status(200).json({
                        message: 'Inicio de sesión exitoso',
                        user: user
                    });
                } else {
                    return res.status(401).json({ error: 'Credenciales inválidas' });
                }
            }
        } else {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
    });
});



//Ruta para obtener los datos del usuario
app.get('/data/:id', (req, res) => {
    const id = req.params.id;

    pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error("Error al obtener los datos del usuario:", err);
            return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
        }

        const user = results[0];

        return res.status(200).json({
            message: 'Usuario obtenido exitosamente',
            user: user
        });
    });
});



//Ruta para encontrar el producto por QR
app.get('/product', (req, res) => {
    const qrCode = req.query.code;
    pool.query('SELECT * FROM products WHERE code = ?', [qrCode], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    });
});



//Ruta para seleccionar productos de la misma categoría
app.get('/productsByCategory', (req, res) => {
    const category = req.query.category;
    pool.query('SELECT * FROM products WHERE category = ?', [category], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: 'No se encontraron productos en esta categoría' });
        }
    });
});



// Ruta para actualizar los datos del usuario
app.put('/data/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, oldPassword, newPassword } = req.body;

    if (oldPassword && newPassword) {
        pool.query('SELECT password FROM users WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error("Error al verificar la contraseña antigua:", err);
                return res.status(500).json({ error: 'Error al verificar la contraseña antigua' });
            }

            const encryptedPassword = results[0]?.password;
            const decryptedPassword = decryptData(encryptedPassword);

            if (decryptedPassword === oldPassword) {
                if (oldPassword === newPassword) {
                    return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la antigua.' });
                }

                const encryptedNewPassword = encryptData(newPassword);
                pool.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, encryptedNewPassword, id], (err, result) => {
                    if (err) {
                        console.error("Error al actualizar datos del usuario:", err);
                        return res.status(500).json({ error: 'Error al actualizar datos del usuario' });
                    }

                    return res.status(200).json({ message: 'Datos del usuario actualizados exitosamente' });
                });
            } else {
                return res.status(401).json({ error: 'Contraseña antigua incorrecta' });
            }
        });
    } else {
        pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, result) => {
            if (err) {
                console.error("Error al actualizar datos del usuario:", err);
                return res.status(500).json({ error: 'Error al actualizar datos del usuario' });
            }

            return res.status(200).json({ message: 'Datos del usuario actualizados exitosamente' });
        });
    }
});




//Ruta para agregar tarjetas de crédito
app.post('/cards', (req, res) => {
    const { id_user, number, holder, date, cvv } = req.body;

    pool.query('INSERT INTO cards (id_user, number, holder, date, cvv) VALUES (?, ?, ?, ?, ?)', [id_user, number, holder, date, cvv], (err, result) => {
        if (err) {
            // Maneja el error de la base de datos
            console.error("Error al registrar la tarjeta:", err);
            return res.status(500).json({ error: 'Error al registrar la tarjeta' });
        }

        // Verifica si se insertó correctamente
        if (result.affectedRows > 0) {
            // Devolver un mensaje de éxito
             return res.status(200).json({message: 'Tarjeta registrada exitosamente',});
        } else {
            return res.status(500).json({ error: 'Error al registrar usuario' });
        }
    });

});



// Ruta para obtener los datos de las tarjetas de crédito de un usuario específico
app.get('/getCards/:userId', (req, res) => {
    const userId = req.params.userId;

    // Consulta a la base de datos para obtener las tarjetas de crédito asociadas al ID de usuario
    pool.query('SELECT * FROM cards WHERE id_user = ?', [userId], (err, results) => {
        if (err) {
            console.error("Error al obtener los datos de las tarjetas de crédito:", err);
            return res.status(500).json({ error: 'Error al obtener los datos de las tarjetas de crédito' });
        }

        // Agregar un console.log para verificar los resultados obtenidos
        console.log('Tarjetas obtenidas:', results);

        // Si la consulta fue exitosa, devuelve los resultados
        return res.status(200).json({
            message: 'Tarjetas de crédito obtenidas exitosamente',
            cards: results
        });
    });
});



// Ruta para obtener los datos de los carritos de un usuario específico
app.get('/getCarts/:userId', (req, res) => {
    const userId = req.params.userId;

    pool.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error("Error al obtener los carritos:", err);
            return res.status(500).json({ error: 'Error al obtener los carritos' });
        }

        // Agregar un console.log para verificar los resultados obtenidos
        console.log('Carritos obtenidos:', results);

        // Si la consulta fue exitosa, devuelve los resultados
        return res.status(200).json({
            message: 'Carritos obtenidos',
            carts: results
        });
    });
});



//Ruta para crear un carrito
app.post('/addCart', (req, res) => {
    const { user_id, name, date, card_id, total, type, address_id, status } = req.body;

    // Convertir la fecha a formato MySQL (YYYY-MM-DD HH:MM:SS)
    const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

    // Consulta SQL para insertar datos en la tabla `cart`
    pool.query('INSERT INTO cart (user_id, name, date, card_id, total, type, address_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [user_id, name, formattedDate, card_id, total, type, address_id, status], (err, result) => {
        if (err) {
            console.error("Error al registrar el carrito:", err);
            return res.status(500).json({ error: 'Error al registrar el carrito' });
        }

        // Verifica si la inserción fue exitosa
        if (result.affectedRows > 0) {
            // Devolver el ID del carrito recién creado
            const cartId = result.insertId;
            return res.status(200).json({ cart_id: cartId });
        } else {
            return res.status(500).json({ error: 'Error al registrar el carrito' });
        }
    });
});



//Ruta para añadir productos al carrito
app.post('/addCartItem', (req, res) => {
    const { cart_id, product_id, quantity } = req.body;

    // Consulta SQL para insertar datos en la tabla `cart_items`
    pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cart_id, product_id, quantity], (err, result) => {
        if (err) {
            console.error("Error al registrar el elemento del carrito:", err);
            return res.status(500).json({ error: 'Error al registrar el elemento del carrito' });
        }

        // Verifica si la inserción fue exitosa
        if (result.affectedRows > 0) {
            // Devolver un mensaje de éxito
            return res.status(200).json({ message: 'Elemento del carrito registrado exitosamente' });
        } else {
            return res.status(500).json({ error: 'Error al registrar el elemento del carrito' });
        }
    });
});



// Ruta para completar la compra y enviar la factura por correo
app.post('/completePurchase', (req, res) => {
    const { cart_id, user_id } = req.body;

    // Obtener los detalles del carrito
    pool.query('SELECT * FROM cart WHERE id = ?', [cart_id], (err, cartResults) => {
        if (err) {
            console.error("Error al obtener los detalles del carrito", err);
            return res.status(500).json({ error: 'Error al obtener los detalles del carrito' });
        }

        const cart = cartResults[0];

        pool.query('SELECT ci.quantity, p.name, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?', [cart_id], (err, cartItemsResults) => {
            if (err) {
                console.error("Error al obtener los detalles del carritoo", err);
                return res.status(500).json({ error: 'Error al obtener los artículos del carrito' });
            }

            const cartItems = cartItemsResults;

            // Obtener los detalles del usuario y la dirección de facturación
            pool.query('SELECT * FROM users WHERE id = ?', [user_id], (err, userResults) => {
                if (err) {
                    console.error("Error al obtener los detalles del carritooo", err);
                    return res.status(500).json({ error: 'Error al obtener los detalles del usuario' });
                }

                const user = userResults[0];

                pool.query('SELECT * FROM cards WHERE id_user = ?', [user.id], (err, cardResults) => {
                    if (err) {
                        console.error("Error al obtener los detalles del carritoooo", err);
                        return res.status(500).json({ error: 'Error al obtener la dirección de facturación' });
                    }

                    const card = cardResults[0];

                    // Preparar los detalles de la factura
                    const itemsHtml = cartItems.map(item => `
                        <tr class="item">
                            <td class="desc">${item.name}</td>
                            <td class="qty">${item.quantity}</td>
                            <td class="amt">$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('');

                    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
                    const deliveryFee = 0.00; // Puedes calcular esto si aplica
                    const total = (parseFloat(subtotal) + deliveryFee).toFixed(2);

                    // Reemplazar placeholders en la plantilla HTML
                    let invoiceHtml = fs.readFileSync('Invoice.html', 'utf-8');
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
                        .replace('{{last4Digits}}', card.number.slice(12, 16));

                    // Enviar el correo con la factura adjunta
                    const mailOptions = {
                        from: 'novamarket.sv@gmail.com',
                        to: user.email,
                        subject: `Factura de compra #${cart_id}`,
                        html: invoiceHtml
                    };

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.error("Error al obtener los detalles del carritooooo", err);
                            return res.status(500).json({ error: 'Error al enviar el correo' });
                        }

                        res.status(200).json({ message: 'Factura enviada correctamente' });
                    });
                });
            });
        });
    });
});



//Añadir al carrito desde la shop
app.get('/productByName', (req, res) => {
    const productName = req.query.name;
    pool.query('SELECT * FROM products WHERE name = ?', [productName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    });
});



// Ruta para obtener el historial de compras de un usuario específico
app.get('/getCartDetails/:cartId', (req, res) => {
    const cartId = req.params.cartId;

    // Consulta para obtener los detalles del carrito y el estado
    pool.query(`
        SELECT ci.*, p.name, p.img, p.weight, p.price, c.status 
        FROM cart_items ci 
        JOIN products p ON ci.product_id = p.id 
        JOIN cart c ON ci.cart_id = c.id 
        WHERE ci.cart_id = ?`, [cartId], 
        (err, results) => {
            if (err) {
                console.error("Error al obtener los detalles del carrito:", err);
                return res.status(500).json({ error: 'Error al obtener los detalles del carrito' });
            }
            
            // Devuelve los resultados incluyendo el estado del pedido
            return res.status(200).json({
                message: 'Detalles del carrito obtenidos exitosamente',
                products: results,
                status: results.length > 0 ? results[0].status : null
            });
    });
});




// Ruta para guardar la dirección
app.post('/guardar-direccion', (req, res) => {
    const { userId, addressName, lat, lng } = req.body;

    // Inserta la nueva dirección en la base de datos
    pool.query('INSERT INTO address (id_user, name, latitude, longitude) VALUES (?, ?, ?, ?)', [userId, addressName, lat, lng], (err, result) => {
        if (err) {
            console.error("Error al guardar la dirección:", err);
            return res.status(500).json({ error: 'Error al guardar la dirección' });
        }

        return res.status(200).json({
            message: 'Dirección guardada exitosamente',
            address: result
        });
    });
});



// Ruta para obtener los datos de las direcciones de un usuario específico
app.get('/getAddresses/:userId', (req, res) => {
    const userId = req.params.userId;

    // Consulta a la base de datos para obtener las direcciones asociadas al ID de usuario
    pool.query('SELECT * FROM address WHERE id_user = ?', [userId], (err, results) => {
        if (err) {
            console.error("Error al obtener los datos de las direcciones:", err);
            return res.status(500).json({ error: 'Error al obtener los datos de las direcciones' });
        }

        // Agregar un console.log para verificar los resultados obtenidos
        console.log('Direcciones obtenidas:', results);

        // Si la consulta fue exitosa, devuelve los resultados
        return res.status(200).json({
            message: 'Direcciones obtenidas exitosamente',
            addresses: results
        });
    });
});



// Ruta para obtener una dirección específica de un usuario
app.get('/getAddress/:addressId', (req, res) => {
    const addressId = req.params.addressId;

    // Consulta a la base de datos para obtener la dirección específica por ID
    pool.query('SELECT * FROM address WHERE id = ?', [addressId], (err, results) => {
        if (err) {
            console.error("Error al obtener los datos de la dirección:", err);
            return res.status(500).json({ error: 'Error al obtener los datos de la dirección' });
        }

        // Si la consulta fue exitosa, devuelve los resultados
        return res.status(200).json({
            message: 'Dirección obtenida exitosamente',
            address: results[0] // Asumimos que el ID es único y solo devuelve un resultado
        });
    });
});



// Ruta para eliminar una dirección
app.delete('/deleteAddress/:id', (req, res) => {
    const addressId = req.params.id;

    // Eliminar la dirección de la base de datos
    pool.query('DELETE FROM address WHERE id = ?', [addressId], (err, result) => {
        if (err) {
            console.error("Error al eliminar la dirección:", err);
            return res.status(500).json({ error: 'Error al eliminar la dirección' });
        }

        return res.status(200).json({ message: 'Dirección eliminada exitosamente' });
    });
});



app.post('/comments', (req, res) => {
    const { userId, comment } = req.body;

    if (!comment) {
        return res.status(400).json({ error: 'El comentario es requerido' });
    }

    pool.query('INSERT INTO comments (id_user, comment) VALUES (?, ?)', [userId, comment], (err, result) => {
        if (err) {
            console.error('Error al guardar el comentario:', err);
            return res.status(500).json({ error: 'Error al guardar el comentario' });
        }

        return res.status(201).json({ message: 'Comentario guardado con éxito', commentId: result.insertId });
    });
});



app.get('/api/products/:type', (req, res) => {
    const { type } = req.params;
    const query = 'SELECT * FROM products WHERE type = ?';
    
    pool.query(query, [type], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        res.json(results);
    });
});



// Ruta para obtener notificaciones
app.get('/notifications', (req, res) => {
    pool.query('SELECT * FROM notifications ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Error al obtener notificaciones:', err);
            return res.status(500).json({ error: 'Error al obtener notificaciones' });
        }
        res.status(200).json({ notifications: results });
    });
});






































//ADMIN USERS
// Ruta para obtener todos los usuarios
app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users WHERE banned = 0', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
        res.json(results);
    });
});

// Ruta para obtener todos los usuarios baneados
app.get('/banned-users', (req, res) => {
    pool.query('SELECT * FROM users WHERE banned = 1', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener usuarios baneados' });
        res.json(results);
    });
});

// Ruta para banear un usuario
app.post('/ban-user', (req, res) => {
    const { userId } = req.body;
    pool.query('UPDATE users SET banned = 1 WHERE id = ?', [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al banear usuario' });
        }
        return res.status(200).json({ message: 'Usuario baneado exitosamente' });
    });
});

// Ruta para desbanear un usuario
app.post('/unban-user', (req, res) => {
    const { userId } = req.body;
    pool.query('UPDATE users SET banned = 0 WHERE id = ?', [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al desbanear usuario' });
        }
        return res.status(200).json({ message: 'Usuario desbaneado exitosamente' });
    });
});

// Ruta para eliminar un usuario
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    });
});




//ADMIN PRODUCTS
// Ruta para obtener todos los productos
app.get('/products', (req, res) => {
    pool.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener productos' });
        res.json(results);
    });
});

// Ruta para añadir un nuevo producto con imagen subida a S3
app.post('/products', upload.single('file'), async (req, res) => {
    const { category, name, price, weight, code, brand, calories, type } = req.body;
    const file = req.file;

    // Configurar los parámetros para S3
    const uploadParams = {
        Bucket: 'novamarket-img',
        Key: `${code}`, // Nombre del archivo en S3
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        // Subir la imagen a S3
        const data = await s3.send(new PutObjectCommand(uploadParams));

        // Guardar la información del producto en la base de datos
        const query = 'INSERT INTO products (category, name, price, weight, img, code, brand, calories, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        pool.query(query, [category, name, price, weight, `https://novamarket-img.s3.amazonaws.com/${code}`, code, brand, calories, type], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al añadir producto' });
            }
            res.status(201).json({ id: result.insertId });
        });
    } catch (err) {
        console.error('Error uploading image to S3:', err);
        res.status(500).json({ error: 'Error uploading image to S3' });
    }
});

// Ruta para eliminar un producto
app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar producto' });
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    });
});

// Endpoint para actualizar un producto
app.put('/products/:id', upload.single('file'), async (req, res) => {
    const productId = req.params.id;
    const { name, code, brand, calories, price, weight, category, type } = req.body;
    const file = req.file;

    try {
        if (file) {
            // Obtener la URL de la imagen anterior del producto
            const oldProductQuery = 'SELECT img FROM products WHERE id = ?';
            pool.query(oldProductQuery, [productId], async (err, result) => {
                if (err) {
                    console.error('Error fetching old product image URL:', err);
                    return res.status(500).json({ error: 'Error fetching old product image URL' });
                }

                // Eliminar la imagen antigua de S3 si existe
                const oldImgKey = result[0].img.split('/').pop(); // Obtener solo el nombre del archivo
                try {
                    await s3.send(new DeleteObjectCommand({ Bucket: 'novamarket-img', Key: oldImgKey }));
                } catch (deleteErr) {
                    console.error('Error deleting old image from S3:', deleteErr);
                }

                // Subir la nueva imagen a S3
                const uploadParams = {
                    Bucket: 'novamarket-img',
                    Key: `${code}`, // Nombre del archivo en S3
                    Body: file.buffer,
                    ContentType: file.mimetype
                };

                try {
                    await s3.send(new PutObjectCommand(uploadParams));

                    // Actualizar el producto en la base de datos
                    const query = `UPDATE products SET name = ?, code = ?, brand = ?, calories = ?, price = ?, img = ?, weight = ?, category = ?, type = ? WHERE id = ?`;
                    pool.query(query, [name, code, brand, calories, price, `https://novamarket-img.s3.amazonaws.com/${code}`, weight, category, type, productId], (updateErr, results) => {
                        if (updateErr) {
                            console.error('Error updating product:', updateErr);
                            return res.status(500).json({ error: 'Error updating product' });
                        }

                        if (results.affectedRows === 0) {
                            return res.status(404).json({ error: 'Product not found' });
                        }

                        res.status(200).json({ message: 'Product updated successfully' });
                    });
                } catch (uploadErr) {
                    console.error('Error uploading new image to S3:', uploadErr);
                    res.status(500).json({ error: 'Error uploading new image to S3' });
                }
            });
        } else {
            // Si no hay archivo, simplemente actualiza el producto sin cambiar la imagen
            const query = `UPDATE products SET name = ?, code = ?, brand = ?, calories = ?, price = ?, weight = ?, category = ?, type = ? WHERE id = ?`;
            pool.query(query, [name, code, brand, calories, price, weight, category, type, productId], (updateErr, results) => {
                if (updateErr) {
                    console.error('Error updating product:', updateErr);
                    return res.status(500).json({ error: 'Error updating product' });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Product not found' });
                }

                res.status(200).json({ message: 'Product updated successfully' });
            });
        }
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).json({ error: 'Error processing request' });
    }
});





//ADMIN SALES
// Ruta para obtener todas las ventas
app.get('/sales', (req, res) => {
    pool.query(`
        SELECT c.id AS cartId, c.name AS cartName, c.user_id AS userId, u.name AS userName, c.total AS cartTotal, c.type AS cartType, c.status AS status, c.date AS date, c.address_id AS addressId
        FROM cart c
        JOIN users u ON c.user_id = u.id
    `, (err, carts) => {
        if (err) {
            console.error("Error al obtener las ventas:", err);
            return res.status(500).json({ error: 'Error al obtener las ventas' });
        }

        const cartIds = carts.map(cart => cart.cartId);

        if (cartIds.length === 0) {
            return res.json(carts);
        }

        pool.query(`
            SELECT ci.cart_id AS cartId, p.name AS productName, ci.quantity, p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id IN (?)
        `, [cartIds], (err, items) => {
            if (err) {
                console.error("Error al obtener los detalles de los carritos:", err);
                return res.status(500).json({ error: 'Error al obtener los detalles de los carritos' });
            }

            pool.query(`
                SELECT cc.id AS cartId, a.id AS addressId, a.name AS addressName, a.latitude, a.longitude
                FROM cart cc
                JOIN address a ON cc.address_id = a.id
                WHERE cc.id IN (?)
            `, [cartIds], (err, addresses) => {
                if (err) {
                    console.error("Error al obtener las direcciones:", err);
                    return res.status(500).json({ error: 'Error al obtener las direcciones' });
                }

                const sales = carts.map(cart => {
                    return {
                        ...cart,
                        items: items.filter(item => item.cartId === cart.cartId),
                        address: addresses.find(address => address.cartId === cart.cartId)
                    };
                });

                return res.status(200).json(sales);
            });
        });
    });
});


// Función para enviar un correo de notificación de estado
const sendStatusUpdateEmail = (email, userName, orderStatus, cartName) => {
    const mailOptions = {
        from: 'novamarket.sv@gmail.com',
        to: email,
        subject: 'Actualización de Estado de tu Pedido',
        html: `<p>Hola ${userName},</p>
               <p>El estado de tu pedido (${cartName}) ha sido actualizado a: <strong>${orderStatus}</strong>.</p>
               <p>Gracias por comprar en NovaMarket.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar el correo de actualización de estado:", error);
        } else {
            console.log('Correo de actualización de estado enviado:', info.response);
        }
    });
};

// Ruta para actualizar el estado de las compras
app.put('/status/:id', (req, res) => {
    const saleId = req.params.id;
    const status = req.body.status;

    const query = 'UPDATE cart SET status = ? WHERE id = ?';

    pool.query(query, [status, saleId], (err, result) => {
        if (err) {
            console.error('Error updating sale status:', err);
            return res.status(500).send('Error updating sale status');
        }

        // Obtener el correo electrónico, nombre de usuario y nombre del carrito para enviar la notificación
        pool.query('SELECT u.email, u.name AS userName, c.name AS cartName FROM users u JOIN cart c ON u.id = c.user_id WHERE c.id = ?', [saleId], (err, result) => {
            if (err) {
                console.error("Error al obtener el usuario y nombre del carrito:", err);
                return res.status(500).send('Error al obtener el usuario y nombre del carrito');
            }

            const user = result[0];
            sendStatusUpdateEmail(user.email, user.userName, status, user.cartName);

            res.send('Sale status updated and email sent successfully');
        });
    });
});



//ADMIN NOTIFICATIONS
// Ruta para guardar notificaciones publicadas en la base de datos
app.post('/publish-notification', (req, res) => {
    const { title, message, icon } = req.body;

    pool.query('INSERT INTO notifications (title, message, icon) VALUES (?, ?, ?)', [title, message, icon], (err, result) => {
        if (err) {
            console.error('Error al guardar la notificación:', err);
            return res.status(500).json({ error: 'Error al guardar la notificación' });
        }
        return res.status(201).json({ message: 'Notificación guardada con éxito' });
    });
});

// Ruta para obtener notificaciones publicadas
app.get('/published-notifications', (req, res) => {
    pool.query('SELECT * FROM notifications', (err, results) => {
        if (err) {
            console.error('Error al obtener notificaciones publicadas:', err);
            return res.status(500).json({ error: 'Error al obtener notificaciones publicadas' });
        }
        res.status(200).json({ notifications: results });
    });
});


// Ruta para eliminar una notificación
app.delete('/delete-notification/:id', (req, res) => {
    const { id } = req.params;

    pool.query('DELETE FROM notifications WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la notificación:', err);
            return res.status(500).json({ error: 'Error al eliminar la notificación' });
        }
        res.status(200).json({ message: 'Notificación eliminada con éxito' });
    });
});



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});