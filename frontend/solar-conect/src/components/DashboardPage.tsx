import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { Company, AnalyticData, Benefit, Project, Testimonial, Differential } from '../types';
import { 
  Home, 
  User, 
  BarChart3, 
  Settings, 
  LogOut, 
  Save, 
  Edit3, 
  X,
  Loader2,
  Sun,
  TrendingUp,
  Users,
  Eye,
  Plus,
  Trash2,
  Globe,
  Star,
  MapPin,
  Zap,
  DollarSign
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, logOut } = useAuth();
  const [currentSection, setCurrentSection] = useState('overview');
  const [company, setCompany] = useState<Company>({
    name: '',
    description: '',
    website: '',
    logoUrl: '',
    address: '',
    phone: '',
    email: '',
    segment: '',
    products: [],
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    benefits: [],
    projects: [],
    testimonials: [],
    differentials: [],
    socialMedia: {}
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [analytics] = useState<AnalyticData[]>([
    {
      id: '1',
      interest: 'Energia Solar Residencial',
      timestamp: new Date(),
      userId: 'user123',
      pageVisited: '/solucoes-residenciais'
    },
    {
      id: '2',
      interest: 'Energia Solar Comercial',
      timestamp: new Date(Date.now() - 86400000),
      userId: 'user456',
      pageVisited: '/solucoes-comerciais'
    },
    {
      id: '3',
      interest: 'Instalação Solar',
      timestamp: new Date(Date.now() - 172800000),
      userId: 'user789',
      pageVisited: '/instalacao'
    }
  ]);

  useEffect(() => {
    if (user && !user.isAnonymous) {
      const savedCompany = localStorage.getItem('solarconnect_company');
      if (savedCompany) {
        setCompany(JSON.parse(savedCompany));
      } else {
        setCompany(prev => ({
          ...prev,
          name: user.displayName || '',
          email: user.email || '',
          logoUrl: user.photoURL || '',
          heroTitle: 'Ilumine Seu Futuro com Energia Solar Limpa',
          heroSubtitle: 'Soluções Completas para Residências e Empresas com Economia Garantida',
          heroImage: 'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=1920',
          benefits: [
            {
              id: '1',
              title: 'Economia na Conta de Luz',
              description: 'Reduza sua conta de energia em até 95%',
              icon: 'DollarSign'
            }
          ],
          projects: [],
          testimonials: [],
          differentials: [],
          socialMedia: {}
        }));
      }
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      localStorage.setItem('solarconnect_company', JSON.stringify(company));
      setMessage('Dados salvos com sucesso!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erro ao salvar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setCompany(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const addBenefit = () => {
    const newBenefit: Benefit = {
      id: Date.now().toString(),
      title: 'Novo Benefício',
      description: 'Descrição do benefício',
      icon: 'Sun'
    };
    setCompany(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), newBenefit]
    }));
  };

  const updateBenefit = (id: string, field: keyof Benefit, value: string) => {
    setCompany(prev => ({
      ...prev,
      benefits: prev.benefits?.map(benefit =>
        benefit.id === id ? { ...benefit, [field]: value } : benefit
      ) || []
    }));
  };

  const removeBenefit = (id: string) => {
    setCompany(prev => ({
      ...prev,
      benefits: prev.benefits?.filter(benefit => benefit.id !== id) || []
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'Novo Projeto',
      location: 'Localização',
      capacity: '0 kWp',
      savings: 'R$ 0/ano',
      image: 'https://images.pexels.com/photos/9875436/pexels-photo-9875436.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'residential'
    };
    setCompany(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProject]
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setCompany(prev => ({
      ...prev,
      projects: prev.projects?.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      ) || []
    }));
  };

  const removeProject = (id: string) => {
    setCompany(prev => ({
      ...prev,
      projects: prev.projects?.filter(project => project.id !== id) || []
    }));
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: 'Nome do Cliente',
      role: 'Cargo',
      company: 'Empresa',
      text: 'Depoimento do cliente',
      rating: 5,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
    };
    setCompany(prev => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), newTestimonial]
    }));
  };

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setCompany(prev => ({
      ...prev,
      testimonials: prev.testimonials?.map(testimonial =>
        testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
      ) || []
    }));
  };

  const removeTestimonial = (id: string) => {
    setCompany(prev => ({
      ...prev,
      testimonials: prev.testimonials?.filter(testimonial => testimonial.id !== id) || []
    }));
  };

  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 text-white p-6 min-h-screen">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
          <Sun className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold">Dashboard</span>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => setCurrentSection('overview')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
            currentSection === 'overview' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Visão Geral</span>
        </button>

        <button
          onClick={() => setCurrentSection('profile')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
            currentSection === 'profile' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <User className="h-5 w-5" />
          <span>Perfil</span>
        </button>

        <button
          onClick={() => setCurrentSection('page-editor')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
            currentSection === 'page-editor' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <Globe className="h-5 w-5" />
          <span>Editor da Página</span>
        </button>

        <button
          onClick={() => setCurrentSection('analytics')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
            currentSection === 'analytics' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setCurrentSection('settings')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
            currentSection === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
        </button>
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <button
          onClick={() => onNavigate('company')}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition duration-200 mb-2"
        >
          <Globe className="h-5 w-5" />
          <span>Ver Página</span>
        </button>
        
        <button
          onClick={() => onNavigate('home')}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition duration-200 mb-2"
        >
          <Home className="h-5 w-5" />
          <span>Voltar ao Site</span>
        </button>
        
        <button
          onClick={logOut}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Bem-vindo ao seu Dashboard, {user?.displayName || 'Usuário'}!
        </h2>
        <p className="text-gray-600 mb-8">
          Gerencie o perfil da sua empresa e edite sua página na plataforma SolarConnect.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Visualizações</h3>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
            <p className="text-sm text-blue-600 mt-1">+12% este mês</p>
          </div>

          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900">Leads</h3>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">89</p>
            <p className="text-sm text-green-600 mt-1">+24% este mês</p>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-900">Conversões</h3>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-600">23</p>
            <p className="text-sm text-yellow-600 mt-1">+8% este mês</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button
              onClick={() => setCurrentSection('profile')}
              className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-200"
            >
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-blue-600" />
                <span className="text-gray-900">Editar Perfil</span>
              </div>
              <span className="text-blue-600">→</span>
            </button>
            
            <button
              onClick={() => setCurrentSection('page-editor')}
              className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-200"
            >
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-green-600" />
                <span className="text-gray-900">Editar Página</span>
              </div>
              <span className="text-green-600">→</span>
            </button>
            
            <button
              onClick={() => setCurrentSection('analytics')}
              className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-200"
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span className="text-gray-900">Ver Analytics</span>
              </div>
              <span className="text-purple-600">→</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {analytics.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{item.interest}</p>
                  <p className="text-xs text-gray-500">{item.timestamp.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Perfil da Empresa</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <Edit3 className="h-4 w-4" />
            <span>Editar</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Salvar</span>
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
              <input
                type="text"
                name="name"
                value={company.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={company.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={company.website}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={company.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              name="description"
              value={company.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL do Logo</label>
              <input
                type="url"
                name="logoUrl"
                value={company.logoUrl}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Segmento</label>
              <input
                type="text"
                name="segment"
                value={company.segment}
                onChange={handleInputChange}
                placeholder="Ex: Residencial, Comercial, Industrial"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
            <input
              type="text"
              name="address"
              value={company.address}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Nome</h3>
                <p className="mt-1 text-lg text-gray-900">{company.name || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</h3>
                <p className="mt-1 text-lg text-gray-900">{company.email || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Website</h3>
                <p className="mt-1 text-lg text-gray-900">
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  ) : (
                    'Não informado'
                  )}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Telefone</h3>
                <p className="mt-1 text-lg text-gray-900">{company.phone || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Segmento</h3>
                <p className="mt-1 text-lg text-gray-900">{company.segment || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Endereço</h3>
                <p className="mt-1 text-lg text-gray-900">{company.address || 'Não informado'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Descrição</h3>
            <p className="mt-1 text-lg text-gray-900">{company.description || 'Não informado'}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderPageEditor = () => (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Hero Section Editor */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Seção Hero (Banner Principal)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título Principal</label>
            <input
              type="text"
              name="heroTitle"
              value={company.heroTitle}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Ilumine Seu Futuro com Energia Solar Limpa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
            <textarea
              name="heroSubtitle"
              value={company.heroSubtitle}
              onChange={handleInputChange}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Soluções Completas para Residências e Empresas com Economia Garantida"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem de Fundo</label>
            <input
              type="url"
              name="heroImage"
              value={company.heroImage}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
        </div>
      </div>

      {/* Benefits Editor */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Benefícios</h3>
          <button
            onClick={addBenefit}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Benefício</span>
          </button>
        </div>
        <div className="space-y-4">
          {company.benefits?.map((benefit) => (
            <div key={benefit.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Benefício #{benefit.id}</h4>
                <button
                  onClick={() => removeBenefit(benefit.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={benefit.title}
                    onChange={(e) => updateBenefit(benefit.id, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
                  <select
                    value={benefit.icon}
                    onChange={(e) => updateBenefit(benefit.id, 'icon', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DollarSign">Dinheiro</option>
                    <option value="Leaf">Folha</option>
                    <option value="TrendingUp">Crescimento</option>
                    <option value="Wrench">Ferramenta</option>
                    <option value="Sun">Sol</option>
                    <option value="Shield">Escudo</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={benefit.description}
                  onChange={(e) => updateBenefit(benefit.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Editor */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Projetos</h3>
          <button
            onClick={addProject}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Projeto</span>
          </button>
        </div>
        <div className="space-y-4">
          {company.projects?.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Projeto #{project.id}</h4>
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                  <input
                    type="text"
                    value={project.location}
                    onChange={(e) => updateProject(project.id, 'location', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacidade</label>
                  <input
                    type="text"
                    value={project.capacity}
                    onChange={(e) => updateProject(project.id, 'capacity', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 8.5 kWp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Economia Anual</label>
                  <input
                    type="text"
                    value={project.savings}
                    onChange={(e) => updateProject(project.id, 'savings', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: R$ 2.400/ano"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={project.type}
                    onChange={(e) => updateProject(project.id, 'type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="residential">Residencial</option>
                    <option value="commercial">Comercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem</label>
                  <input
                    type="url"
                    value={project.image}
                    onChange={(e) => updateProject(project.id, 'image', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Editor */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Depoimentos</h3>
          <button
            onClick={addTestimonial}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Depoimento</span>
          </button>
        </div>
        <div className="space-y-4">
          {company.testimonials?.map((testimonial) => (
            <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Depoimento #{testimonial.id}</h4>
                <button
                  onClick={() => removeTestimonial(testimonial.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={testimonial.name}
                    onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                  <input
                    type="text"
                    value={testimonial.role}
                    onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Empresa (opcional)</label>
                  <input
                    type="text"
                    value={testimonial.company || ''}
                    onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação (1-5)</label>
                  <select
                    value={testimonial.rating}
                    onChange={(e) => updateTestimonial(testimonial.id, 'rating', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 estrela</option>
                    <option value={2}>2 estrelas</option>
                    <option value={3}>3 estrelas</option>
                    <option value={4}>4 estrelas</option>
                    <option value={5}>5 estrelas</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Depoimento</label>
                <textarea
                  value={testimonial.text}
                  onChange={(e) => updateTestimonial(testimonial.id, 'text', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">URL da Foto</label>
                <input
                  type="url"
                  value={testimonial.image}
                  onChange={(e) => updateTestimonial(testimonial.id, 'image', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Editor */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Redes Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
            <input
              type="url"
              value={company.socialMedia?.facebook || ''}
              onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://facebook.com/suaempresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input
              type="url"
              value={company.socialMedia?.instagram || ''}
              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://instagram.com/suaempresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <input
              type="url"
              value={company.socialMedia?.linkedin || ''}
              onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/company/suaempresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
            <input
              type="url"
              value={company.socialMedia?.twitter || ''}
              onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://twitter.com/suaempresa"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          <span>Salvar Todas as Alterações</span>
        </button>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Analytics de Intenção de Compra</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interesse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Página Visitada
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analytics.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.interest}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.timestamp.toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.userId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.pageVisited}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Configurações</h2>
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notificações</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" defaultChecked />
              <span className="ml-2 text-sm text-gray-600">Receber notificações por email</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" defaultChecked />
              <span className="ml-2 text-sm text-gray-600">Alertas de novos leads</span>
            </label>
          </div>
        </div>
        
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Privacidade</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" defaultChecked />
              <span className="ml-2 text-sm text-gray-600">Perfil público</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              <span className="ml-2 text-sm text-gray-600">Permitir contato direto</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Zona de Perigo</h3>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
            Excluir Conta
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'profile':
        return renderProfile();
      case 'page-editor':
        return renderPageEditor();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  if (!user || user.isAnonymous) {
    onNavigate('login');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - SolarConnect</title>
        <meta name="description" content="Seu painel de controle SolarConnect. Acompanhe seus projetos de instalação de energia solar e orçamentos." />
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        {renderSidebar()}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};