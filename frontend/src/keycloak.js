import Keycloak from 'keycloak-js';

// Configuración de Keycloak
const keycloak = new Keycloak ({
    url: 'http://localhost:8080/',
    realm: 'biblioteca', 
    clientId: 'biblioteca-frontend'
});

// Inicialización de Keycloak
keycloak.init({
  onLoad: 'check-sso', // O 'login-required' si quieres forzar el login
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false, // Desactiva el iframe si no lo necesitas, puede causar problemas CORS
})
.then(authenticated => {
  console.log(`Keycloak inicializado y ${authenticated ? 'autenticado' : 'no autenticado'}`);
})
.catch(error => {
  console.error('Error durante la inicialización de Keycloak en keycloak.js:', error);
});

export default keycloak;