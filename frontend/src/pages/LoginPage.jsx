import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
  const { isAuthenticated, login, user, isLoading, getUserId } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  if (isAuthenticated) {
    console.log("Usuario autenticado. ID del usuario:", getUserId());
    return <Navigate to="/libros" replace />;
  }

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <h3>Cargando...</h3>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      await login(username, password);
    } catch (error) {
      setLoginError(error.message || 'Error en el inicio de sesión. Inténtelo de nuevo.');
      console.error('Error de autenticación:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 Iniciar Sesión</h1>
        <p style={styles.description}>
          Accede a tu cuenta para gestionar tus préstamos de libros
        </p>

        {loginError && (
          <div style={styles.errorMessage}>
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Usuario:</label>
            <input
              type="text"
              id="username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña:</label>
            <input
              type="password"
              id="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" style={styles.loginButton} disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={styles.info}>
          <p style={styles.infoText}>
            💡 Tus credenciales serán validadas de forma segura
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '1rem',
    fontSize: '2rem',
  },
  description: {
    color: '#7f8c8d',
    marginBottom: '2rem',
    fontSize: '1.1rem',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    marginBottom: '1rem',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#34495e',
    fontWeight: 'bold',
  },
  input: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  loginButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '14px 32px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    width: '100%',
    marginBottom: '1rem',
    opacity: '0.9',
  },
  errorMessage: {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '1.5rem',
    border: '1px solid #f5c6cb',
  },
  info: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#e3f2fd',
    borderRadius: '6px',
  },
  infoText: {
    margin: 0,
    color: '#1976d2',
    fontSize: '14px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
};