// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <h2 style={styles.subtitle}>Página No Encontrada</h2>
      <p style={styles.message}>
        Lo sentimos, la página que estás buscando no existe.
      </p>
      <Link to="/" style={styles.link}>
        Volver a la página principal
      </Link>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    textAlign: 'center',
    backgroundColor: '#f8f8f8',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  title: {
    fontSize: '6rem',
    margin: '0',
    color: '#e74c3c', 
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '2rem',
    margin: '10px 0 20px 0',
    color: '#555',
  },
  message: {
    fontSize: '1.1rem',
    marginBottom: '30px',
    maxWidth: '500px',
    lineHeight: '1.5',
  },
  link: {
    display: 'inline-block',
    backgroundColor: '#3498db', 
    color: 'white',
    padding: '12px 25px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  linkHover: {
    backgroundColor: '#2980b9', 
    transform: 'scale(1.05)',
  },
};