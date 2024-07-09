const express = require('express')
const mysql2 = require('mysql2')
const cors = require('cors')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express()

const { decryptData } = require('./cryptoutils');

app.use(cors())

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'novamarket'
})

app.get('/', (req, res) => {
    return res.json("From backend side")
})

// Importa el módulo 'body-parser' para procesar los datos enviados en el cuerpo de las solicitudes POST.
const bodyParser = require('body-parser');

// Configura body-parser para que pueda manejar solicitudes JSON.
app.use(bodyParser.json());



//Email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'novamarket.sv@gmail.com',
        pass: 'zbyu jixi sdnk plid'
    }
});

const sendVerificationEmail = (email, verificationLink) => {
    const mailOptions = {
        from: 'novamarket.sv@gmail.com',
        to: email,
        subject: 'Verificación de Correo Electrónico',
        html: `<p>Por favor verifica tu correo electrónico haciendo click en el siguiente enlace: <a href="${verificationLink}">Verificar Correo</a></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar correo de verificación:", error);
        } else {
            console.log('Correo de verificación enviado:', info.response);
        }
    });
};



//Ruta para verificar el correo
app.get('/verify-email', (req, res) => {
    const { token } = req.query;

    db.query('SELECT * FROM users WHERE verification_token = ?', [token], (err, results) => {
        if (err) {
            console.error("Error al verificar el token:", err);
            return res.status(500).json({ error: 'Error al verificar el token' });
        }

        if (results.length > 0) {
            const user = results[0];

            db.query('UPDATE users SET verified = 1, verification_token = NULL WHERE id = ?', [user.id], (err, result) => {
                if (err) {
                    console.error("Error al actualizar la verificación del usuario:", err);
                    return res.status(500).json({ error: 'Error al actualizar la verificación del usuario' });
                }

                return res.status(200).json({ message: 'Correo electrónico verificado exitosamente' });
            });
        } else {
            return res.status(400).json({ error: 'Token de verificación inválido' });
        }
    });
});



//Ruta para saber si el usuario ya verificó su correo
app.get('/check-verification-status', (req, res) => {
    const { userId } = req.query;

    db.query('SELECT verified FROM users WHERE id = ?', [userId], (err, results) => {
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



// Ruta para el registro de usuarios.
app.post('/registro', (req, res) => {
    const { name, email, password } = req.body;
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Verificar si el correo electrónico ya está registrado
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error("Error al verificar el correo electrónico:", err);
            return res.status(500).json({ error: 'Error al verificar el correo electrónico' });
        }

        if (results.length > 0) {
            // El correo electrónico ya está registrado
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Insertar el nuevo usuario en la base de datos
        db.query('INSERT INTO users (name, email, password, verification_token) VALUES (?, ?, ?, ?)', [name, email, password, verificationToken], (err, result) => {
            if (err) {
                console.error("Error al registrar usuario:", err);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }

            if (result.affectedRows > 0) {
                const userId = result.insertId;
                const verificationLink = `http://localhost:1001/verify-email?token=${verificationToken}`;
                sendVerificationEmail(email, verificationLink);

                db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
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

    // Aquí agregamos la lógica para verificar las credenciales del usuario.
    // En primer lugar, recuperamos el usuario con el correo electrónico proporcionado.
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }

        // Verificamos si se encontró un usuario con el correo electrónico proporcionado
        if (results.length > 0) {
            const user = results[0];
            const encryptedPasswordFromDB = user.password;

            // Desciframos la contraseña almacenada en la base de datos
            const decryptedPasswordFromDB = decryptData(encryptedPasswordFromDB);

            // Verificamos si la contraseña proporcionada coincide con la contraseña almacenada descifrada
            if (password === decryptedPasswordFromDB) {
                // Si las contraseñas coinciden, se inicia sesión correctamente
                return res.status(200).json({
                    message: 'Inicio de sesión exitoso',
                    user: user
                });
            } else {
                // Si las contraseñas no coinciden, devolvemos un error de credenciales inválidas
                return res.status(401).json({ error: 'Credenciales inválidas la contra' });
            }
        } else {
            // Si no se encuentra un usuario con el correo electrónico proporcionado, devolvemos un error
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
    });
});



//Ruta para obtener los datos del usuario
app.get('/data/:id', (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
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
    db.query('SELECT * FROM products WHERE code = ?', [qrCode], (err, results) => {
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



// Ruta para actualizar los datos del usuario
app.put('/data/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, oldPassword, newPassword } = req.body;

    // Consulta para verificar la contraseña antigua si se está intentando cambiar la contraseña
    if (oldPassword && newPassword) {
        // Verifica si la contraseña antigua coincide
        db.query('SELECT password FROM users WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error("Error al verificar la contraseña antigua:", err);
                return res.status(500).json({ error: 'Error al verificar la contraseña antigua' });
            }

            const currentPassword = results[0]?.password;

            // Verifica si la contraseña antigua es correcta
            if (currentPassword === oldPassword) {
                // Si la contraseña antigua es correcta, actualiza la contraseña a la nueva
                db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, newPassword, id], (err, result) => {
                    if (err) {
                        console.error("Error al actualizar datos del usuario:", err);
                        return res.status(500).json({ error: 'Error al actualizar datos del usuario' });
                    }

                    return res.status(200).json({ message: 'Datos del usuario actualizados exitosamente' });
                });
            } else {
                // Si la contraseña antigua es incorrecta, devuelve un error
                return res.status(401).json({ error: 'Contraseña antigua incorrecta' });
            }
        });
    } else {
        // Si no se intenta cambiar la contraseña, actualiza solo el nombre y el email
        db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, result) => {
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

    db.query('INSERT INTO cards (id_user, number, holder, date, cvv) VALUES (?, ?, ?, ?, ?)', [id_user, number, holder, date, cvv], (err, result) => {
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
    db.query('SELECT * FROM cards WHERE id_user = ?', [userId], (err, results) => {
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

    db.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, results) => {
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
    const { user_id, name, date, card_id, total } = req.body;

    // Consulta SQL para insertar datos en la tabla `cart`
    db.query('INSERT INTO cart (user_id, name, date, card_id, total) VALUES (?, ?, ?, ?, ?)', [user_id, name, date, card_id, total], (err, result) => {
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
    db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cart_id, product_id, quantity], (err, result) => {
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



//Añadir al carrito desde la shop
app.get('/productByName', (req, res) => {
    const productName = req.query.name;
    db.query('SELECT * FROM products WHERE name = ?', [productName], (err, results) => {
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

    // Consulta a la base de datos para obtener los detalles del carrito con el cartId
    db.query('SELECT * FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?', [cartId], (err, results) => {
        if (err) {
            console.error("Error al obtener los detalles del carrito:", err);
            return res.status(500).json({ error: 'Error al obtener los detalles del carrito' });
        }
        
        // Si la consulta fue exitosa, devuelve los resultados
        return res.status(200).json({
            message: 'Detalles del carrito obtenidos exitosamente',
            products: results
        });
    });
});



// Ruta para guardar la dirección
app.post('/guardar-direccion', (req, res) => {
    const { userId, addressName, lat, lng } = req.body;

    // Inserta la nueva dirección en la base de datos
    db.query('INSERT INTO address (id_user, name, latitude, longitude) VALUES (?, ?, ?, ?)', [userId, addressName, lat, lng], (err, result) => {
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
    db.query('SELECT * FROM address WHERE id_user = ?', [userId], (err, results) => {
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



const port = 1001;

app.listen(port, ()=>{
    console.log("listening on", port)
})

