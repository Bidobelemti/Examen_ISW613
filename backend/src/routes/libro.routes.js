const express = require('express');
const { getListadoLibros, getDetalleLibro } = require('../controllers/libro.controller');

const router = express.Router();

router.get('/', getListadoLibros);

router.get('/:id', getDetalleLibro);

module.exports = router;