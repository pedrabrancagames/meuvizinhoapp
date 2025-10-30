import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { auth, db } from '../../src/firebase';
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import LoadingSpinner from '../LoadingSpinner';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmailLink: (email: string) => Promise<void>;
  register: (email: string, password: string, name: string, address: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Função de login com email e senha
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Função de login com Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Verificar se é um novo usuário e criar perfil no Firestore
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      // Criar perfil para novo usuário do Google
      await setDoc(doc(db, 'users', result.user.uid), {
        name: result.user.displayName || '',
        email: result.user.email,
        address: '',
        phone: '',
        isVerified: false,
        createdAt: new Date(),
        reputation: 5.0,
        loansMade: 0,
        loansReceived: 0,
        badges: [],
        photoURL: result.user.photoURL,
      });
    }
  };

  // Função de login com link por email
  const loginWithEmailLink = async (email: string) => {
    return sendSignInLinkToEmail(auth, email, {
      url: `${window.location.origin}/home`,
      handleCodeInApp: true,
    });
  };

  // Função de registro
  const register = async (email: string, password: string, name: string, address: string, phone: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Criar perfil no Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      email,
      address,
      phone,
      isVerified: false,
      createdAt: new Date(),
      reputation: 5.0,
      loansMade: 0,
      loansReceived: 0,
      badges: [],
      photoURL: result.user.photoURL,
    });
    
    return result;
  };

  // Função de logout
  const logout = () => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Verificar se o usuário existe no Firestore, se não existir, criar perfil padrão
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName || user.email?.split('@')[0] || 'Usuário',
            email: user.email,
            address: '',
            phone: '',
            isVerified: false,
            createdAt: new Date(),
            reputation: 5.0,
            loansMade: 0,
            loansReceived: 0,
            badges: [],
            photoURL: user.photoURL,
          });
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    loginWithEmailLink,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

// Componente para proteger rotas que requerem login
export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    // Redireciona para login, mantendo o caminho original para onde redirecionar após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};