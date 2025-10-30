// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance as well
export { app };