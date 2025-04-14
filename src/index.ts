import express from 'express';
import connectDB from './config/db';

// Rutas
import clienteRoutes from './routes/cliente.route';
import cuentaRoutes from './routes/cuenta.route';
import tarjetaRoutes from './routes/tarjeta.route';

const app = express();
const port = 3000;

// Middleware para leer JSON
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Ruta raíz
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
