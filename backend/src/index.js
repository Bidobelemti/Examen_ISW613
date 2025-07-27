const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { authenticateJWT, isUser, isAdmin } = require('./middleware/auth'); 
const authRoutes = require('./routes/auth');

dotenv.config(); 

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json()); 

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('¡API de Biblioteca funcionando!');
});


app.get('/api/usuarios', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});