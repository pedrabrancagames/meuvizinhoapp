import React, { useState } from 'react';
import { GoogleIcon } from './Icons';

// HACK: Firebase é carregado via CDN, então precisamos informar ao TypeScript sobre ele.
declare const firebase: any;

export default function Login() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithRedirect(provider);
      // O listener onAuthStateChanged no App.tsx cuidará da navegação após o redirecionamento.
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleEmailLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const actionCodeSettings = {
      url: window.location.href, // URL para redirecionar após o clique no link
      handleCodeInApp: true,
    };

    try {
      await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar o link. Verifique o email e tente novamente.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-v-light-bg dark:bg-neutral-900 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-v-primary tracking-tight">MeuVizinhoApp</h1>
            <p className="text-lg text-v-neutral dark:text-gray-300 mt-2">Conectando vizinhos, fortalecendo comunidades.</p>
        </div>
      
        <div className="w-full max-w-sm bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-v-neutral dark:text-gray-200 text-center mb-6">Bem-vindo(a)!</h2>
            
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</p>}
            
            {emailSent ? (
                 <div className="text-center p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                    <h3 className="font-bold text-green-700 dark:text-green-300">Link enviado!</h3>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">Verifique sua caixa de entrada (e spam) para acessar sua conta.</p>
                </div>
            ) : (
                <>
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center p-3 border border-gray-300 dark:border-neutral-600 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors font-semibold text-v-neutral dark:text-gray-200 disabled:opacity-50"
                    >
                        <GoogleIcon className="w-6 h-6 mr-3" />
                        Entrar com Google
                    </button>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-200 dark:border-neutral-700"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400">OU</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-neutral-700"></div>
                    </div>

                    <form onSubmit={handleEmailLinkSignIn}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu e-mail"
                            required
                            className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary mb-3"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full bg-v-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all disabled:bg-gray-300 dark:disabled:bg-neutral-600"
                        >
                            {isLoading ? 'Enviando...' : 'Entrar com E-mail'}
                        </button>
                    </form>
                </>
            )}
      </div>
    </div>
  );
}