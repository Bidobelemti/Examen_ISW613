import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Keycloak from 'keycloak-js';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const keycloakInstanceRef = useRef(null);

  if (!keycloakInstanceRef.current) {
    keycloakInstanceRef.current = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'biblioteca',        
      clientId: 'biblioteca-app', 
    });

  }
 


  const setAuthUser = (userDataFromBackend, token) => {
    if (userDataFromBackend && token) {
      setUser({
        id: userDataFromBackend.id,
        login: userDataFromBackend.login,
        nombre: userDataFromBackend.nombre,
        apellido1: userDataFromBackend.apellido1,
        email: userDataFromBackend.email,
        tipo: userDataFromBackend.tipo,
      });
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', token);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
        try {
            const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
            
            if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
                const fetchUserProfile = async () => {
                  try {
                    const response = await axios.get(`http://localhost:3001/api/usuarios?login=${decodedToken.preferred_username}`);
                    if (response.data) {
                      setAuthUser(response.data, storedToken);
                    } else {
                      setAuthUser(null, null);
                    }
                  } catch (error) {
                    console.error("Error al obtener el perfil del usuario desde el backend:", error);
                    setAuthUser(null, null);
                  } finally {
                    setIsLoading(false);
                  }
                };
                fetchUserProfile();
            } else {
                setAuthUser(null, null);
                setIsLoading(false);
            }
        } catch (parseError) {
            console.error("Error al decodificar el token del localStorage:", parseError);
            setAuthUser(null, null);
            setIsLoading(false);
        }
    } else {
        setIsLoading(false);
    }

    if (keycloakInstanceRef.current) {
        keycloakInstanceRef.current.onAuthLogout = () => {
            console.log('Detected Keycloak logout (e.g., from admin console).');
            setAuthUser(null, null);
            setIsLoading(false);
        };
    }

  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        login: username,
        password: password,
      });

      const { access_token, user: userDataFromBackend } = response.data;
      setAuthUser(userDataFromBackend, access_token);

      return true;
    } catch (error) {
      let errorMessage = 'Error desconocido al intentar iniciar sesión.';
      console.error('--- Inicio de depuración de error de login ---');
      console.error('El objeto "error" capturado es:', error);
      console.error('¿Es un AxiosError?', axios.isAxiosError(error));
      console.error('Tipo de "error.name":', error.name);
      console.error('Tipo de "error.message":', error.message);
      console.error('--- Fin de depuración de error de login ---');

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('  Tipo: Respuesta del servidor');
          console.error('  Datos del error:', error.response.data);
          console.error('  Estado:', error.response.status);
          errorMessage = error.response.data.message || `Error del servidor: ${error.response.status}`;
        } else if (error.request) {
          console.error('  Tipo: Sin respuesta del servidor (Posiblemente CORS o servidor caído)');
          errorMessage = 'No se pudo conectar con el servidor de autenticación. Verifique la conexión o la configuración de CORS en el backend.';
        } else {
          console.error('  Tipo: Error de Axios inesperado (antes de la solicitud)');
          errorMessage = `Ocurrió un error inesperado de Axios: ${error.message || 'Error desconocido'}`;
        }
      } else {
        console.error('  Tipo: Error no-Axios (puede ser un evento o un objeto JS con referencias circulares)');
        if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = `Ocurrió un error inesperado (no-Axios): ${error.message}`;
        } else if (typeof error === 'string') {
            errorMessage = `Ocurrió un error inesperado (string): ${error}`;
        } else {
            errorMessage = 'Ocurrió un error inesperado. Por favor, intente de nuevo.';
        }
      }

      throw new Error(errorMessage);

    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthUser(null, null);
    window.location.href = '/login'; 
  };

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const getUserId = () => {
    return user ? user.id : null;
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    getToken,
    getUserId,
    keycloak: keycloakInstanceRef.current,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};