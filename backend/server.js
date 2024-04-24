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






app.listen(1001, ()=>{
    console.log("listening on")
})

