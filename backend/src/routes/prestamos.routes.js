// src/routes/prestamos.routes.js
const express = require('express');
const { solicitarPrestamo, devolverEjemplar, getMisPrestamos } = require('../controllers/prestamos.controller');
const router = express.Router();

router.post('/', solicitarPrestamo);
router.post('/devolver/:ejemplarId', devolverEjemplar);
router.post('/mis-prestamos', getMisPrestamos);

module.exports = router;