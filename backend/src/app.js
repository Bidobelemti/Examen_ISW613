
const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { authenticateJWT, isUser, isAdmin } = require('./middleware/auth'); 
const authRoutes = require('./routes/auth');

dotenv.config(); 

const app = express(); // Crea una instancia de la aplicación Express
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;
const prestamosRoutes = require('./routes/prestamos.routes');
const multasRoutes = require('./routes/multas.routes');
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/multas', multasRoutes);

app.get('/', (req, res) => {
  res.send('API de Biblioteca funcionando!'); // Envía una respuesta de texto plano al navegador
});

app.get('/api/libros', authenticateJWT, isUser, async (req, res) => {
  try {
    // Solo mostrar libros que tienen ejemplares disponibles
    const libros = await prisma.libro.findMany({
      where: {
        numEjemplaresDisponibles: {
          gt: 0 // greater than 0
        }
      },
      // Incluir información adicional para mejor respuesta
      select: {
        id: true,
        isbn: true,
        titulo: true,
        autor: true,
        numPaginas: true,
        numEjemplares: true,
        numEjemplaresDisponibles: true,
        portadaURL: true
      }
    });

    res.status(200).json({
      success: true,
      message: `Se encontraron ${libros.length} libros disponibles`,
      data: libros
    });
  } catch (error) {
    console.error('Error al obtener libros disponibles:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor al obtener libros.',
      error: error.message 
    });
  }
});

app.get('/api/libros/:id', authenticateJWT, isUser, async (req, res) => {
  const libroId = parseInt(req.params.id);
  
  // Validación básica del ID
  if (isNaN(libroId) || libroId <= 0) {
    return res.status(400).json({ 
      success: false,
      message: 'ID de libro inválido. Debe ser un número entero positivo.' 
    });
  }

  try {
    // Buscar el libro con sus recomendaciones embebidas
    const libro = await prisma.libro.findUnique({
      where: { id: libroId },
      include: {
        // Embebido de recomendaciones - libros que este libro recomienda
        recomendacionesOrigen: {
          include: {
            libroRecomendado: {
              select: {
                id: true,
                isbn: true,
                titulo: true,
                autor: true,
                numEjemplaresDisponibles: true,
                portadaURL: true
              }
            }
          }
        },
        // También incluir información de ejemplares para validación
        ejemplares: {
          select: {
            id: true,
            codigoEjemplar: true,
            estado: true,
            observaciones: true
          }
        }
      }
    });

    if (!libro) {
      return res.status(404).json({ 
        success: false,
        message: 'Libro no encontrado.' 
      });
    }

    // Procesar las recomendaciones para mejor formato de respuesta
    const recomendaciones = libro.recomendacionesOrigen.map(rec => ({
      comentario: rec.comentario,
      libroRecomendado: rec.libroRecomendado
    }));

    // Estructura de respuesta optimizada
    const respuesta = {
      success: true,
      data: {
        // Información básica del libro
        id: libro.id,
        isbn: libro.isbn,
        titulo: libro.titulo,
        autor: libro.autor,
        numPaginas: libro.numPaginas,
        numEjemplares: libro.numEjemplares,
        numEjemplaresDisponibles: libro.numEjemplaresDisponibles,
        portadaURL: libro.portadaURL,
        
        // Validación de disponibilidad
        disponible: libro.numEjemplaresDisponibles > 0,
        
        // Embebido de recomendaciones
        recomendaciones: recomendaciones,
        
        // Información adicional de ejemplares
        ejemplares: libro.ejemplares
      }
    };

    res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error al obtener el detalle del libro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor al obtener el detalle del libro.',
      error: error.message 
    });
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`); 
});