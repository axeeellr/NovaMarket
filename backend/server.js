const express = require('express')
const mysql2 = require('mysql2')
const cors = require('cors')

const app = express()
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




// Importa el módulo 'body-parser' para procesar los datos enviados en el cuerpo de las solicitudes POST.
const bodyParser = require('body-parser');

// Configura body-parser para que pueda manejar solicitudes JSON.
app.use(bodyParser.json());


// Ruta para el registro de usuarios.
app.post('/registro', (req, res) => {
    const { name, email, password } = req.body;

    // Ejecuta la consulta de inserción
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
        if (err) {
            // Maneja el error de la base de datos
            console.error("Error al registrar usuario:", err);
            return res.status(500).json({ error: 'Error al registrar usuario' });
        }

        // Verifica si se insertó correctamente
        if (result.affectedRows > 0) {
            // Obtener el ID del usuario recién registrado
            const userId = result.insertId;

            // Realizar una consulta para obtener los datos del usuario recién registrado
            db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
                if (err) {
                    console.error("Error al obtener los datos del usuario:", err);
                    return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
                }

                // Tomar el primer resultado (el usuario recién registrado)
                const user = results[0];

                // Devolver los datos del usuario junto con un mensaje de éxito
                return res.status(200).json({
                    message: 'Usuario registrado exitosamente',
                    user: user
                });
            });
        } else {
            return res.status(500).json({ error: 'Error al registrar usuario' });
        }
    });
});


// Ruta para el inicio de sesión.
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Aquí debes agregar la lógica para verificar las credenciales del usuario.
    // Por ejemplo:
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        if (results.length > 0) {
            const user = results[0];

            return res.status(200).json({
                message: 'Inicio de sesión exitoso',
                user: user
            });
        } else {
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


// Ruta para obtener los datos de las tarjetas de crédito de un usuario específico
app.get('/getCarts/:userId', (req, res) => {
    const userId = req.params.userId;

    // Consulta a la base de datos para obtener las tarjetas de crédito asociadas al ID de usuario
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




const port = 1001;

app.listen(port, ()=>{
    console.log("listening on", port)
})

