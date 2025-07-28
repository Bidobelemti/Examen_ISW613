import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [libro, setLibro] = useState(null);
  const [prestamosActuales, setPrestamosActuales] = useState([]);
  const [yaPrestado, setYaPrestado] = useState(false);

  useEffect(() => {
    const fetchLibro = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/libros/${id}`);
        setLibro(response.data);
      } catch (error) {
        console.error("Error al obtener el detalle del libro:", error);
        setLibro(null);
      }
    };

    fetchLibro();

    const storedPrestamos = localStorage.getItem("misPrestamos");
    let initialPrestamos = [];

    if (storedPrestamos) {
      try {
        const parsedPrestamos = JSON.parse(storedPrestamos);
        if (Array.isArray(parsedPrestamos)) {
          initialPrestamos = parsedPrestamos;
        } else {
          console.warn("Préstamos en localStorage no son válidos, inicializando vacío.");
        }
      } catch (e) {
        console.error("Error al parsear localStorage:", e);
        initialPrestamos = [];
      }
    }

    setPrestamosActuales(initialPrestamos);
  }, [id]);

  useEffect(() => {
    if (libro && prestamosActuales.length > 0) {
      const estaPrestado = prestamosActuales.some(p => p.titulo === libro.titulo);
      setYaPrestado(estaPrestado);
    }
  }, [libro, prestamosActuales]);

  if (!libro) {
    return <h2>📕 Libro no encontrado</h2>;
  }

  const handlePedirPrestamo = () => {
    const nuevoPrestamo = {
      id: Date.now(),
      titulo: libro.titulo,
      fechaInicio: new Date().toISOString().split("T")[0],
      deberiaDevolverseEl: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };

    const nuevosPrestamos = Array.isArray(prestamosActuales)
      ? [...prestamosActuales, nuevoPrestamo]
      : [nuevoPrestamo];

    localStorage.setItem("misPrestamos", JSON.stringify(nuevosPrestamos));
    setPrestamosActuales(nuevosPrestamos);
    setYaPrestado(true);

    alert("📥 Libro prestado correctamente");
    navigate("/mis-prestamos");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{libro.titulo}</h1>
      <img
        src={libro.portadaURL}
        alt={libro.titulo}
        style={{ width: "300px", height: "auto", marginBottom: "1rem" }}
      />
      <p><strong>Autor:</strong> {libro.autor}</p>
      <p><strong>Páginas:</strong> {libro.numPaginas}</p>
      <p><strong>Ejemplares disponibles:</strong> {libro.numEjemplaresDisponibles}</p>
      <button onClick={handlePedirPrestamo} disabled={yaPrestado}>
        {yaPrestado ? "✔️ Ya prestado" : "📚 Pedir préstamo"}
      </button>
    </div>
  );
}
