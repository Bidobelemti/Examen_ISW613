import express from 'express';
import dotenv from 'dotenv';
// Importamos el enrutador de libros que hemos creado.
import libroRoutes from './routes/libro.routes.js';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Creamos una instancia de la aplicación Express.
const app = express();

// Middleware para que Express pueda interpretar cuerpos de petición en formato JSON.
app.use(express.json());

// Montamos nuestras rutas de libros bajo el prefijo '/api/libros'.
// Esto significa que todas las rutas definidas en libro.routes.js
// comenzarán con /api/libros.
app.use('/api/libros', libroRoutes);

// Definimos el puerto en el que escuchará el servidor.
// Tomará el valor de la variable de entorno PORT, o usará 3000 por defecto.
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor.
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
