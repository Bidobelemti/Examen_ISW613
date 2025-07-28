import React from "react";

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

// Función para calcular si el préstamo está vencido
const estaVencido = (fechaDevolucion) => {
  if (!fechaDevolucion) return false;
  const hoy = new Date();
  const fechaDev = new Date(fechaDevolucion);
  hoy.setHours(0, 0, 0, 0);
  fechaDev.setHours(0, 0, 0, 0);
  return hoy > fechaDev;
};

// Función para calcular días de retraso
const diasRetraso = (fechaDevolucion) => {
  if (!fechaDevolucion) return 0;
  const hoy = new Date();
  const fechaDev = new Date(fechaDevolucion);
  const diferenciaMs = hoy - fechaDev;
  const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  return dias > 0 ? dias : 0;
};

export default function LoanTable({ prestamos, onDevolver, modo = "activo" }) {
  if (!prestamos || prestamos.length === 0) {
    return (
      <p style={styles.noData}>
        No hay {modo === "activo" ? "préstamos activos" : "préstamos históricos"} para mostrar.
      </p>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Título</th>
            <th style={styles.th}>Código Ejemplar</th>
            <th style={styles.th}>Fecha de inicio</th>
            {modo === "activo" ? (
              <th style={styles.th}>Fecha devolución esperada</th>
            ) : (
              <th style={styles.th}>Fecha devolución real</th>
            )}
            {modo === "historico" && (
              <th style={styles.th}>Multa asociada</th>
            )}
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((prestamo) => {
            const tituloLibro = prestamo.ejemplar?.libro?.titulo || 'Título Desconocido';
            const codigoEjemplar = prestamo.ejemplar?.codigoEjemplar || 'N/A';
            
            const fechaLimite = prestamo.deberiaDevolverseEl; 
            const fechaDevolucionReal = prestamo.fechaDevolucion; 
            
            const vencido = modo === "activo" && estaVencido(fechaLimite);
            const retrasoDias = vencido ? diasRetraso(fechaLimite) : 0;

            return (
              <tr key={prestamo.id} style={vencido ? styles.rowVencido : styles.row}>
                <td style={styles.td}>{tituloLibro}</td>
                <td style={styles.td}>{codigoEjemplar}</td>
                <td style={styles.td}>{formatDate(prestamo.fechaInicio)}</td>
                <td style={styles.td}>
                  {modo === "activo" ? formatDate(fechaLimite) : formatDate(fechaDevolucionReal)}
                </td>
                {modo === "historico" && (
                  <td style={styles.td}>
                    {prestamo.multa ? 
                      `$${prestamo.multa.monto.toFixed(2)} (${prestamo.multa.dias} días)` 
                      : 'N/A'}
                  </td>
                )}
                <td style={styles.td}>
                  {modo === "activo" ? (
                    <>
                      <button
                        // CAMBIO CLAVE AQUÍ: Pasa prestamo.ejemplar.id a onDevolver
                        onClick={() => onDevolver(prestamo.ejemplar.id)} 
                        style={styles.button}
                      >
                        Devolver
                      </button>
                      {vencido && (
                        <div style={styles.retrasoText}>
                          {`🔴 ${retrasoDias} día${retrasoDias !== 1 ? 's' : ''} de retraso`}
                        </div>
                      )}
                    </>
                  ) : (
                    <span style={styles.historicoText}>Finalizado</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '2rem',
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
  },
  th: {
    backgroundColor: "#2c3e50",
    color: "#fff",
    padding: "12px 15px",
    textAlign: "left",
    borderBottom: "2px solid #34495e",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: "0.9em",
  },
  td: {
    padding: "10px 15px",
    borderBottom: "1px solid #e0e0e0",
    verticalAlign: "middle",
    color: "#333",
    fontSize: "0.95em",
  },
  row: {
    backgroundColor: "#fff",
  },
  rowVencido: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9em",
    fontWeight: "bold",
    transition: "background-color 0.2s ease, transform 0.1s ease",
  },
  buttonHover: {
    backgroundColor: "#218838",
  },
  retrasoText: {
    color: "#d32f2f",
    fontSize: "0.85em",
    marginTop: "5px",
    display: "block",
  },
  historicoText: {
    color: "#6c757d",
    fontSize: "0.9em",
    fontStyle: "italic",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    fontSize: "1.1rem",
    color: "#777",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    margin: "1rem 0",
  },
};