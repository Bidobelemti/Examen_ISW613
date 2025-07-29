import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Para obtener el usuario

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [libro, setLibro] = useState(null);
  const [yaPrestado, setYaPrestado] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getUserId } = useAuth();

  useEffect(() => {
    const fetchLibroYPrestamo = async () => {
      try {
        // 1. Obtener datos del libro
        const libroResp = await axios.get(`http://localhost:3001/api/libros/${id}`);
        setLibro(libroResp.data);

        // 2. Consultar si el usuario tiene préstamo activo de este libro
        const prestamosResp = await axios.post("http://localhost:3001/api/prestamos/mis-prestamos", {
          usuarioId: getUserId()
        });

        const prestamosActivos = prestamosResp.data.prestamosActivos;

        // Verificar si alguno de los ejemplares prestados pertenece a este libro
        const prestado = prestamosActivos.some(
          (p) => p.ejemplar.libroId === parseInt(id)
        );
        setYaPrestado(prestado);

      } catch (error) {
        console.error("Error al cargar detalle del libro o préstamos:", error);
        setLibro(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLibroYPrestamo();
  }, [id, getUserId]);

  const handlePedirPrestamo = async () => {
    try {
      // Buscar un ejemplar disponible del libro
      const ejemplaresDisponiblesResp = await axios.get(`http://localhost:3001/api/prestamos/${id}/ejemplares-disponibles`);
      const ejemplares = ejemplaresDisponiblesResp.data;

      if (!ejemplares.length) {
        alert("No hay ejemplares disponibles actualmente.");
        return;
      }

      const ejemplarDisponible = ejemplares[0];

      await axios.post("http://localhost:3001/api/prestamos", {
        usuarioId: getUserId(),
        ejemplarId: ejemplarDisponible.id,
      });

      alert("📚 Préstamo realizado correctamente.");
      navigate("/mis-prestamos");

    } catch (error) {
      console.error("Error al solicitar préstamo:", error);
      alert("No se pudo completar el préstamo.");
    }
  };

  if (loading) return <p>Cargando libro...</p>;

  if (!libro) return <h2>📕 Libro no encontrado</h2>;

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

      <button onClick={handlePedirPrestamo} disabled={yaPrestado || libro.numEjemplaresDisponibles <= 0}>
        {yaPrestado
          ? "✔️ Ya tienes un ejemplar prestado"
          : libro.numEjemplaresDisponibles > 0
          ? "📚 Pedir préstamo"
          : "❌ Sin disponibilidad"}
      </button>
    </div>
  );
}
