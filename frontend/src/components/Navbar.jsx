import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth(); // Ya no necesitas 'login' aquí
  const navigate = useNavigate(); // <--- Inicializa useNavigate

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>📘 Biblioteca</h2>

      <ul style={styles.links}>
        <li><Link to="/libros" style={styles.link}>Libros</Link></li>

        {isAuthenticated && (
          <li><Link to="/mis-prestamos" style={styles.link}>Mis préstamos</Link></li>
        )}

        {!isLoading && (
          <li style={styles.authSection}>
            {isAuthenticated ? (
              <div style={styles.userSection}>
                {/* Asegúrate de que user?.nombre exista o usa un fallback como user?.login */}
                <span style={styles.userName}>👤 {user?.nombre || user?.login || 'Usuario'}</span>
                <button onClick={logout} style={styles.authButton}>
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button onClick={handleLoginRedirect} style={styles.authButton}>
                Iniciar Sesión
              </button>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2c3e50",
    padding: "1rem 2rem",
    color: "#fff",
  },
  logo: {
    margin: 0,
  },
  links: {
    listStyle: "none",
    display: "flex",
    gap: "1rem",
    margin: 0,
    padding: 0,
    alignItems: "center",
  },
  link: {
    color: "#ecf0f1",
    textDecoration: "none",
    fontWeight: "bold",
  },
  authSection: {
    marginLeft: "1rem",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  userName: {
    color: "#ecf0f1",
    fontSize: "14px",
  },
  authButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  }
};