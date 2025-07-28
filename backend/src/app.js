const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { authenticateJWT, isUser, isAdmin } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const prestamosRoutes = require('./routes/prestamos.routes');
const multasRoutes = require('./routes/multas.routes');
const librosRoutes = require('./routes/libro.routes');

const cors = require('cors');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json()); 

app.use('/auth', authRoutes);
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/multas', multasRoutes);
app.use('/api/libros', librosRoutes);

app.get('/api/usuarios', async (req, res) => {
  const { login } = req.query;

  if (!login) {
    return res.status(400).json({ message: 'El parámetro "login" es requerido.' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { login },
      select: {
        id: true,
        nombre: true,
        apellido1: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});