import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BooksPage() {
  const [libros, setLibros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/libros");
        setLibros(response.data);
      } catch (error) {
        console.error("Error al obtener libros:", error);
      }
    };

    fetchLibros();
  }, []);

  const verMas = (id) => {
    navigate(`/libros/${id}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Biblioteca - Libros disponibles</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {libros.map((libro) => (
          <BookCard key={libro.id} libro={libro} onVerMas={verMas} />
        ))}
      </div>
    </div>
  );
}
