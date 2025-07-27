import React from "react";

export default function LoanTable({ prestamos, onDevolver }) {
  return (
    <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem" }}>
      <thead>
        <tr>
          <th>Título</th>
          <th>Fecha de inicio</th>
          <th>Fecha devolución</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {prestamos.map((prestamo) => (
          <tr key={prestamo.id}>
            <td>{prestamo.titulo}</td>
            <td>{prestamo.fechaInicio}</td>
            <td>{prestamo.deberiaDevolverseEl}</td>
            <td>
              <button onClick={() => onDevolver(prestamo.id)}>📤 Devolver</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
