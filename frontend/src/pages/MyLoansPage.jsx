import React, { useEffect, useState } from "react";
import prestamosData from "../mocks/prestamos.json";
import LoanTable from "../components/LoanTable";

export default function MyLoansPage() {
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    // Simula un fetch desde el backend
    const prestamosGuardados = JSON.parse(localStorage.getItem("misPrestamos")) || [];
    setPrestamos(prestamosGuardados);
  }, []);

  const handleDevolver = (idPrestamo) => {
    const confirmacion = window.confirm("¿Estás seguro de devolver este libro?");
    if (confirmacion) {
      //setPrestamos((prev) => prev.filter((p) => p.id !== idPrestamo));
       const nuevosPrestamos = prestamos.filter((p) => p.id !== idPrestamo);
      setPrestamos(nuevosPrestamos);
      localStorage.setItem("misPrestamos", JSON.stringify(nuevosPrestamos));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📚 Mis préstamos</h1>
      {prestamos.length > 0 ? (
        <LoanTable prestamos={prestamos} onDevolver={handleDevolver} />
      ) : (
        <p>No tienes préstamos actualmente.</p>
      )}
    </div>
  );
}
