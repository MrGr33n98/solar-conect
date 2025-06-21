/** @jsxImportSource react */
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, MapPin, Mail, Phone, Star, Users, Award, DollarSign, Wrench, Leaf,
} from 'lucide-react';
import axios from 'axios';

// Contexto de autenticação
const AuthContext = createContext(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      axios
        .get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser(response.data))
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Tipos
interface Company {
  id?: string;
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  rating?: number;
  numReviews?: number;
}

interface CompanyDetailPageProps {
  companyId?: string;
  onNavigate: (page: string, props?: any) => void;
}

export const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({ companyId, onNavigate }) => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setError('ID da empresa não fornecido.');
      setLoading(false);
      return;
    }

    axios
      .get(`/api/companies/${companyId}`)
      .then((response) => {
        setCompany(response.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados da empresa:', err);
        setError('Erro ao carregar os detalhes da empresa.');
      })
      .finally(() => setLoading(false));
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Carregando detalhes da empresa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h3 className="text-2xl font-bold text-red-700 mb-4">Erro ao Carregar</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => onNavigate('home')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Voltar para a Lista de Empresas
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{company.name} - SolarConnect</title>
        <meta name="description" content={`Detalhes da empresa ${company.name}.`} />
      </Helmet>
      <div className="min-h-screen bg-white">
        <header className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => onNavigate('home')}
                className="p-2 rounded-md text-gray-600 hover:text-blue-600"
              >
                <ArrowRight className="h-6 w-6 rotate-180" />
              </button>
              <span className="text-2xl font-bold text-gray-900">{company.name}</span>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold">{company.name}</h1>
          <p>{company.description}</p>
          <div className="mt-4">
            <p>
              <MapPin className="inline-block mr-2" />
              {company.city}, {company.state}
            </p>
            <p>
              <Mail className="inline-block mr-2" />
              {company.email}
            </p>
            <p>
              <Phone className="inline-block mr-2" />
              {company.phone}
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export const CompanyPage = CompanyDetailPage; // Ou exporte diretamente o componente correto

export default CompanyDetailPage;

