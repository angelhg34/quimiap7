const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 4001;

app.use(cors()); // Habilita CORS para permitir solicitudes desde tu frontend
app.use(express.json()); // Permite el parsing de JSON en las solicitudes

// Conectar a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quimiap'
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});

// Consulta general de la tabla Usuario
app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM Usuario';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    } else {
      res.json(results); // Devuelve los resultados de la consulta
    }
  });
});

// Resgistrar usuarios 
app.post('/registrarUser', (req, res) => {
    const {
      nombres, 
      apellidos, 
      telefono, 
      correo_electronico, 
      tipo_doc, 
      num_doc, 
      contrasena, 
      rol 
    } = req.body;

    const query = `CALL RegistrarUsuario(?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, 
      [nombres, apellidos, telefono, correo_electronico, tipo_doc, num_doc, contrasena, rol], 
      (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).json({ success: false, error: err });
        }
        res.json({ success: true, results });
    });
});
// endpoint para actualizar usuarios
app.put('/actualizarUser/:id_usuario', (req, res) => {
    const {
        id_usuario,            // ID del usuario a actualizar
        nombres, 
        apellidos, 
        telefono, 
        correo_electronico, 
        tipo_doc, 
        num_doc, 
        contrasena, 
        estado, 
        rol 
    } = req.body;

    const query = `CALL ActualizarUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, 
      [id_usuario, nombres, apellidos, telefono, correo_electronico, tipo_doc, num_doc, contrasena, estado, rol], 
      (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).json({ success: false, error: err });
        }
        res.json({ success: true, results });
    });
});

// Endpoint para cambiar estado al usuario
app.put('/cambiarEstadoUsuario/:id_usuario', (req, res) => {
    const { estado } = req.body; // Se espera que el estado venga en el cuerpo de la solicitud
    const id_usuario = req.params.id_usuario; // Obtener el ID del usuario desde la URL

    const query = `CALL CambiarEstadoUsuario(?, ?)`;

    connection.query(query, [id_usuario, estado], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).json({ success: false, error: err });
        }
        res.json({ success: true, results });
    });
});

//TRAER USUARIOS POR ID
app.get('/usuario/:id_usuario', (req, res) => {
    const id_usuario = req.params.id_usuario; // Obtener el ID del usuario desde la URL

    const query = `CALL ObtenerUsuarioPorID(?)`;

    connection.query(query, [id_usuario], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).json({ success: false, error: err });
        }

        // Verificar si se encontró el usuario
        if (results[0].length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({ success: true, usuario: results[0][0] }); // Devolver el primer resultado
    });
});





app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});