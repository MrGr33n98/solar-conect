import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInWithLinkedIn, loading } = useAuth();

  if (loading) {
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
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo à SolarConnect</h2>
          <p className="text-gray-600">Conecte-se ao futuro da energia solar</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center w-full px-6 py-4 border border-gray-200 rounded-xl shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google logo" 
              className="h-6 w-6 mr-3" 
            />
            Entrar com Google
          </button>

          <button
            onClick={signInWithLinkedIn}
            className="flex items-center justify-center w-full px-6 py-4 border border-gray-200 rounded-xl shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
          >
            <div className="h-6 w-6 mr-3 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">in</span>
            </div>
            Entrar com LinkedIn
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Ao fazer login, você concorda com nossos{' '}
            <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a>
            {' '}e{' '}
            <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  );
};