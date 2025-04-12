import express from 'express';
import connectDB from './config/db';

const app = express();
const port = 3000;

// Conectar a la base de datos
connectDB();

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
