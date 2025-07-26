import React, { useEffect, useState } from "react";
import prestamosData from "../mocks/prestamos.json";
import LoanTable from "../components/LoanTable";

export default function MyLoansPage() {
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    // Simula un fetch desde el backend
    setPrestamos(prestamosData);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📚 Mis préstamos</h1>
      {prestamos.length > 0 ? (
        <LoanTable prestamos={prestamos} />
      ) : (
        <p>No tienes préstamos actualmente.</p>
      )}
    </div>
  );
}
