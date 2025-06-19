import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, LogIn } from 'lucide-react';

// Assuming App.tsx or a parent component passes onNavigate for routing
interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, isLoadingAuth } = useAuth(); // Removed signInWithGoogle, signInWithLinkedIn
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      const success = await login(email, password);
      if (success) {
        onNavigate('dashboard'); // Navigate to dashboard or desired page
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during login.');
      console.error("Login failed on page:", err.message);
    }
  };

  // If initial auth check is happening, show a generic loader
  // (isLoadingAuth also covers login process loading)
  if (isLoadingAuth && !error) { // Avoid showing loader if there's an error message to display
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-lg text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login - SolarConnect</title>
        <meta name="description" content="Acesse sua conta na SolarConnect para gerenciar seus projetos de energia solar e visualizar orçamentos." />
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              {/* Placeholder for a logo or icon if desired */}
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo à SolarConnect</h2>
            <p className="text-gray-600">Conecte-se ao futuro da energia solar</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Sua senha"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoadingAuth}
                className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70"
              >
                {isLoadingAuth ? (
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                ) : (
                  <LogIn className="h-6 w-6 mr-2" />
                )}
                Entrar
              </button>
            </div>
          </form>

          {/* Placeholder for "Forgot password?" or "Sign up" links if needed in the future */}
          <div className="mt-6 text-center">
            <p className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Esqueceu sua senha?
              </a>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Não tem uma conta?{' '}
              <button onClick={() => onNavigate('register')} className="font-medium text-blue-600 hover:text-blue-500">
                Cadastre-se
              </button>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Ao fazer login, você concorda com nossos{' '}
              <a href="#" className="text-gray-500 hover:underline">Termos de Uso</a>
              {' '}e{' '}
              <a href="#" className="text-gray-500 hover:underline">Política de Privacidade</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};