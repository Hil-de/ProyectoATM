import express from 'express';
import connectDB from './config/db';

// Rutas
import clienteRoutes from './routes/cliente.route';
import cuentaRoutes from './routes/cuenta.route';
import tarjetaRoutes from './routes/tarjeta.route';

const app = express();
const port = 3000;

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

app.use('/clientes', clienteRoutes);
app.use('/cuentas', cuentaRoutes);
app.use('/tarjetas', tarjetaRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
