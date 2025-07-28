import * as libroService from '../services/libro.service.js';

export const getListadoLibros = async (req, res) => {
  try {
    const libros = await libroService.getAllLibros();
    res.status(200).json(libros);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el listado de libros.', error: error.message });
  }
};

export const getDetalleLibro = async (req, res) => {
  try {

    const libroId = parseInt(req.params.id);

    const libro = await libroService.getLibroById(libroId);

    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado.' });
    }

    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el detalle del libro.', error: error.message });
  }
};
