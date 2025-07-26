const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { authenticateJWT, isUser, isAdmin } = require('./middleware/auth'); 

dotenv.config(); 

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('¡API de Biblioteca funcionando!');
});


app.get('/api/libros', authenticateJWT, isUser, async (req, res) => {
  try {
    const libros = await prisma.libro.findMany({
      where: {
        numEjemplaresDisponibles: {
          gt: 0
        }
      }
    });
    res.json(libros);
  } catch (error) {
    console.error('Error al obtener libros disponibles:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.get('/api/libros/:id', authenticateJWT, isUser, async (req, res) => {
  const libroId = parseInt(req.params.id);
  if (isNaN(libroId)) {
    return res.status(400).json({ message: 'ID de libro inválido.' });
  }
  try {
    const libro = await prisma.libro.findUnique({
      where: { id: libroId },
    });
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado.' });
    }
    res.json(libro);
  } catch (error) {
    console.error('Error al obtener el libro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
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

app.post('/api/libros', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const nuevoLibro = await prisma.libro.create({
      data: req.body, 
    });
    res.status(201).json(nuevoLibro);
  } catch (error) {
    console.error('Error al crear el libro:', error);
    res.status(500).json({ message: 'Error al crear el libro.' });
  }
});

app.delete('/api/libros/:id', authenticateJWT, isAdmin, async (req, res) => {
  const libroId = parseInt(req.params.id);
  if (isNaN(libroId)) {
    return res.status(400).json({ message: 'ID de libro inválido.' });
  }
  try {
    await prisma.libro.delete({
      where: { id: libroId },
    });
    res.status(204).send(); 
  } catch (error) {
    console.error('Error al eliminar el libro:', error);
    res.status(500).json({ message: 'Error al eliminar el libro.' });
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