import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'password' | 'email-link'>('password');
  const [linkSent, setLinkSent] = useState(false);
  const { register, loginWithEmailLink } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validações básicas
    if (method === 'password') {
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        setLoading(false);
        return;
      }

      if (!name.trim()) {
        setError('Nome é obrigatório');
        setLoading(false);
        return;
      }

      if (!address.trim()) {
        setError('Endereço é obrigatório');
        setLoading(false);
        return;
      }

      if (!phone.trim()) {
        setError('Telefone é obrigatório');
        setLoading(false);
        return;
      }
    }

    try {
      if (method === 'password') {
        await register(email, password, name, address, phone);
        onRegisterSuccess();
      } else {
        // Criar usuário no Firestore com informações básicas
        await loginWithEmailLink(email);
        window.localStorage.setItem('emailForSignIn', email);
        setLinkSent(true);

        // A criação do usuário no Firestore já é feita no AuthProvider
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error('Erro no cadastro:', err);

      // Tratar erros específicos do Firebase Auth
      let errorMessage = 'Erro ao criar conta. Tente novamente.';

      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este email já está sendo usado por outra conta.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido. Verifique o formato do email.';
            break;
          case 'auth/weak-password':
            errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Cadastro com email/senha não está habilitado. Entre em contato com o suporte.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Esta conta foi desabilitada. Entre em contato com o suporte.';
            break;
          default:
            // Traduzir mensagens comuns do Firebase
            if (err.message.includes('Password should be at least 6 characters')) {
              errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            } else if (err.message.includes('email-already-in-use')) {
              errorMessage = 'Este email já está sendo usado por outra conta.';
            } else if (err.message.includes('invalid-email')) {
              errorMessage = 'Email inválido. Verifique o formato do email.';
            } else if (err.message.includes('weak-password')) {
              errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            } else {
              errorMessage = err.message || errorMessage;
            }
        }
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
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
            Crie sua conta para começar
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {linkSent ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Enviamos um link de acesso para seu email. Clique no link para concluir seu cadastro.
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-v-primary"
                placeholder="Seu nome completo"
                required
              />
            </div>

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
              <div className="mb-4">
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
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Mínimo de 6 caracteres
                </p>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 mb-2">
                Endereço
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-v-primary"
                placeholder="Sua rua, número e bairro"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-v-primary"
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-v-primary text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-opacity-90 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Processando...' : method === 'password' ? 'Cadastrar' : 'Enviar link de acesso'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleSwitchMethod}
            className="text-v-primary hover:underline"
          >
            {method === 'password'
              ? 'Prefiro receber um link de acesso por email'
              : 'Prefiro cadastrar com senha'}
          </button>
        </div>

        <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
          <p>
            Já tem uma conta?{' '}
            <a href="/login" className="text-v-primary font-medium hover:underline">
              Entre aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;