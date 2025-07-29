// src/routes/prestamos.routes.js
const express = require('express');
const { solicitarPrestamo, devolverEjemplar, getMisPrestamos } = require('../controllers/prestamos.controller');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', solicitarPrestamo);
router.post('/devolver/:ejemplarId', devolverEjemplar);
router.post('/mis-prestamos', getMisPrestamos);
router.get('/:id/ejemplares-disponibles', async (req, res) => {
  const { id } = req.params;
  const ejemplares = await prisma.ejemplar.findMany({
    where: {
      libroId: parseInt(id),
      estado: 'disponible',
    },
  });
  res.json(ejemplares);
});

module.exports = router;