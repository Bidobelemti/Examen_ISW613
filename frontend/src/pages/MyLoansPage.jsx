import React, { useEffect, useState } from "react";
import LoanTable from "../components/LoanTable";
import { useAuth } from "../context/AuthContext";

export default function MyLoansPage() {
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [prestamosHistoricos, setPrestamosHistoricos] = useState([]);
  const [multa, setMulta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtén el ID del usuario y el token de autenticación del contexto
  const { getUserId, getToken } = useAuth(); 

  // Función para obtener los préstamos del usuario desde el backend
  const fetchPrestamos = async () => {
    const currentUserId = getUserId(); 
    if (!currentUserId) {
      setError("Usuario no autenticado o ID de usuario no disponible.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true); // Asegura que el estado de carga esté activo al inicio del fetch
      setError(null); // Limpia errores anteriores

      const token = getToken();
      if (!token) {
        throw new Error("No hay token de autenticación disponible. Por favor, inicie sesión.");
      }

      const response = await fetch("http://localhost:3001/api/prestamos/mis-prestamos", {
        method: "POST", // Debe ser POST para enviar body
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Envía el token para la autenticación
        },
        body: JSON.stringify({ usuarioId: currentUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener préstamos.");
      }

      const data = await response.json();
      setPrestamosActivos(data.prestamosActivos || []);
      setPrestamosHistoricos(data.prestamosHistoricos || []);
      setMulta(data.multaActual || null);
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
      setError(error.message || "Hubo un problema al cargar los préstamos.");
    } finally {
      setLoading(false); // Desactiva el estado de carga al finalizar
    }
  };

  // Se ejecuta al montar el componente y cuando cambian las dependencias
  useEffect(() => {
    fetchPrestamos();
  }, [getUserId, getToken]); // Depende de getUserId y getToken para re-fetch si cambian (ej. al login)

  // Función para manejar la devolución de un ejemplar
  const handleDevolver = async (ejemplarId) => { // Ahora recibe directamente el ejemplarId
    const confirmacion = window.confirm("¿Estás seguro de devolver este libro?");
    if (!confirmacion) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token disponible para la devolución. Por favor, inicie sesión.");
      }

      // Llama al endpoint de tu backend para devolver el ejemplar
      const response = await fetch(`http://localhost:3001/api/prestamos/devolver/${ejemplarId}`, {
        method: "POST", // O PUT, DELETE dependiendo de cómo lo hayas definido en el backend
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Envía el token para autenticación/autorización
        },
        // No se necesita body si el ejemplarId va en la URL
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al devolver el ejemplar.");
      }

      alert("Ejemplar devuelto exitosamente.");
      // Después de una devolución exitosa, vuelve a cargar los préstamos para reflejar los cambios
      fetchPrestamos(); 

    } catch (error) {
      console.error("Error al devolver el ejemplar:", error);
      alert(error.message || "Hubo un problema al devolver el ejemplar.");
    }
  };

  const calcularMultaDesdeFecha = (fechaFinStr) => {
    if (!fechaFinStr) return 0;
    const hoy = new Date();
    const fechaFin = new Date(fechaFinStr);
    const diffMs = hoy - fechaFin;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDias > 0 ? diffDias : 0;
  };

  const diasMulta = multa ? calcularMultaDesdeFecha(multa.fechaFin) : 0;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📚 Mis préstamos</h1>

      {loading ? (
        <p>Cargando préstamos...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          {prestamosActivos.length > 0 ? (
            <>
              {/* onDevolver ahora espera el ejemplarId */}
              <LoanTable prestamos={prestamosActivos} onDevolver={handleDevolver} modo="activo" /> 
              {diasMulta > 0 && (
                <div style={{ marginTop: "1rem", color: "#dc3545", fontWeight: "bold" }}>
                  ⚠️ Tienes una multa acumulada de {diasMulta} día{diasMulta !== 1 ? 's' : ''}.
                </div>
              )}
            </>
          ) : (
            <p>No tienes préstamos actualmente.</p>
          )}

          {prestamosHistoricos.length > 0 && (
            <>
              <h2 style={{ marginTop: "2rem" }}>📜 Historial de Préstamos</h2>
              {/* No hay acción de devolver para préstamos históricos */}
              <LoanTable prestamos={prestamosHistoricos} modo="historico" /> 
            </>
          )}
        </>
      )}
    </div>
  );
}