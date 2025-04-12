import express from 'express';
import connectDB from './config/db';
<<<<<<< HEAD

// Rutas
import clienteRoutes from './routes/cliente.route';
import cuentaRoutes from './routes/cuenta.route';
import tarjetaRoutes from './routes/tarjeta.route';
=======
<<<<<<< HEAD
>>>>>>> 4536f42 (Version 1)
=======
>>>>>>> 53e56c0 (Version 1)
>>>>>>> 2265495 (Version 1)

const app = express();
const port = 3000;

<<<<<<< HEAD
// Middleware para leer JSON
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Ruta raíz
=======
// Conectar a la base de datos
connectDB();

<<<<<<< HEAD
>>>>>>> 4536f42 (Version 1)
=======
>>>>>>> 53e56c0 (Version 1)
>>>>>>> 2265495 (Version 1)
app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

// Rutas REST principales
app.use('/clientes', clienteRoutes);
app.use('/cuentas', cuentaRoutes);
app.use('/tarjetas', tarjetaRoutes);

// Escuchar en el puerto
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
