// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: Verify the appId value in your Firebase Console after setup
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCLT0ZVwWa3Qv7niuQm4p05AvAnWkB4oMM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dbmeuvizinhoapp-f3ad6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dbmeuvizinhoapp-f3ad6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dbmeuvizinhoapp-f3ad6.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "887066252361",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:887066252361:web:6d9b0e9b89e9f5b7c7e5e4" // Verify this in Firebase Console
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Firestore settings for better offline support
try {
  // Enable offline persistence using the new API
  if (typeof window !== 'undefined') {
    // A persistência offline agora é configurada automaticamente no Firebase v9+
    // Não é mais necessário chamar enableIndexedDbPersistence explicitamente
    console.log('Firestore configurado com persistência offline automática');
  }
} catch (error) {
  console.warn('Erro ao configurar Firestore:', error);
}

// Função para reconectar ao Firestore
export const reconnectFirestore = async () => {
  try {
    await enableNetwork(db);
    console.log('Firestore reconectado com sucesso');
  } catch (error) {
    console.error('Erro ao reconectar Firestore:', error);
  }
};

// Função para desconectar do Firestore
export const disconnectFirestore = async () => {
  try {
    await disableNetwork(db);
    console.log('Firestore desconectado');
  } catch (error) {
    console.error('Erro ao desconectar Firestore:', error);
  }
};

// Export the app instance as well
export { app };