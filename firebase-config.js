// Configuración pública de Firebase. No incluir credenciales administrativas.
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCHS-Tx5YwvecG_ttRDYVkuqdGao8MyiPg",
  authDomain: "encuesta-5cd5f.firebaseapp.com",
  projectId: "encuesta-5cd5f",
  storageBucket: "encuesta-5cd5f.firebasestorage.app",
  messagingSenderId: "975163452966",
  appId: "1:975163452966:web:ef408626d5c6b66178c0e7",
  measurementId: "G-K5WNTFMHBZ"
};

// Configuración de la plataforma (no es secreta; las reglas de Firestore deben coincidir con el correo del moderador).
window.APP_CONFIG = {
  moderadorEmail: "emil.economia@gmail.com",        // cuenta propietaria; debe ser la misma de firestore.rules
  segundoExpositorEmail: "gramirezfunes@gmail.com", // se precarga en «invitar segundo expositor»; déjalo vacío si no aplica
  segundosPorPregunta: 40                           // valor por defecto (10 a 180)
};
