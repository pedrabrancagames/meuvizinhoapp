import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'password' | 'email-link'>('password');
  const [linkSent, setLinkSent] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithEmailLink } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (method === 'password') {
        await login(email, password);
        onLoginSuccess();
      } else {
        await loginWithEmailLink(email);
        window.localStorage.setItem('emailForSignIn', email);
        setLinkSent(true);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      await loginWithGoogle();
      onLoginSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMethod = () => {
    setMethod(method === 'password' ? 'email-link' : 'password');
    setError(null);
    setLinkSent(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-v-light-bg dark:bg-neutral-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-v-primary">MeuVizinhoApp</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {method === 'password' 
              ? 'Entre com sua conta' 
              : 'Envie um link de acesso para seu email'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {linkSent ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Enviamos um link de acesso para seu email. Clique no link para entrar.
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-v-primary"
                placeholder="seu@email.com"
                required
              />
            </div>

            {method === 'password' && (
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-v-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-v-primary text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-opacity-90 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Processando...' : method === 'password' ? 'Entrar' : 'Enviar link de acesso'}
            </button>
          </form>
        )}

        {method === 'password' && (
          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center bg-red-500 text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-opacity-90 transition duration-200 disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Entrar com Google
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleSwitchMethod}
            className="text-v-primary hover:underline"
          >
            {method === 'password'
              ? 'Prefiro receber um link de acesso por email'
              : 'Prefiro entrar com senha'}
          </button>
        </div>

        <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
          <p>
            Não tem uma conta?{' '}
            <a href="/register" className="text-v-primary font-medium hover:underline">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;