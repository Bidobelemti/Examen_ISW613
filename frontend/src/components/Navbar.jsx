import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>📘 Biblioteca</h2>
      <ul style={styles.links}>
        <li><Link to="/libros" style={styles.link}>Libros</Link></li>
        <li><Link to="/mis-prestamos" style={styles.link}>Mis préstamos</Link></li>
        <li><Link to="/login" style={styles.link}>Login</Link></li>
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
  },
  link: {
    color: "#ecf0f1",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
