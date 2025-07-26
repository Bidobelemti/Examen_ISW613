import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import librosData from "../mocks/libros.json";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [libro, setLibro] = useState(null);

  useEffect(() => {
    const found = librosData.find((l) => l.id === parseInt(id));
    setLibro(found);
  }, [id]);

  if (!libro) {
    return <h2>Libro no encontrado</h2>;
  }

  const pedirPrestamo = () => {
    // Simula POST /prestamos
    alert(`✅ Solicitud de préstamo enviada para "${libro.titulo}"`);
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
      <button onClick={pedirPrestamo}>📚 Pedir préstamo</button>
    </div>
  );
}
