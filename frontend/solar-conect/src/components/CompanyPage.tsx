import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { Company, ContactForm } from '../types';
import { 
  Sun, 
  Zap, 
  Shield, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle,
  Users,
  Award,
  Wrench,
  DollarSign,
  Leaf,
  Clock,
  Camera,
  Send,
  Menu,
  X
} from 'lucide-react';

interface CompanyPageProps {
  onNavigate: (page: string) => void;
}

export const CompanyPage: React.FC<CompanyPageProps> = ({ onNavigate }) => {
  const { user, logOut } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    propertyType: 'residential',
    averageBill: '',
    message: ''
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    // Carrega dados da empresa do localStorage ou usa dados padrão
    const savedCompany = localStorage.getItem('solarconnect_company');
    if (savedCompany) {
      setCompany(JSON.parse(savedCompany));
    } else {
      // Dados padrão para demonstração
      setCompany({
        name: 'SolarTech Solutions',
        description: 'Especialistas em energia solar com mais de 10 anos de experiência',
        website: 'https://solartech.com',
        logoUrl: '',
        address: 'Rua das Energias, 123 - São Paulo, SP',
        phone: '(11) 9999-8888',
        email: 'contato@solartech.com',
        segment: 'Residencial e Comercial',
        products: ['Painéis Solares', 'Inversores', 'Sistemas Completos'],
        heroTitle: 'Ilumine Seu Futuro com Energia Solar Limpa',
        heroSubtitle: 'Soluções Completas para Residências e Empresas com Economia Garantida de até 95%',
        heroImage: 'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=1920',
        benefits: [
          {
            id: '1',
            title: 'Economia na Conta de Luz',
            description: 'Reduza sua conta de energia em até 95% com nossos sistemas solares',
            icon: 'DollarSign'
          },
          {
            id: '2',
            title: 'Sustentabilidade',
            description: 'Contribua para um planeta mais limpo com energia 100% renovável',
            icon: 'Leaf'
          },
          {
            id: '3',
            title: 'Retorno do Investimento',
            description: 'Recupere seu investimento em 3-5 anos e economize por 25+ anos',
            icon: 'TrendingUp'
          },
          {
            id: '4',
            title: 'Manutenção Reduzida',
            description: 'Sistemas duráveis com manutenção mínima e garantia estendida',
            icon: 'Wrench'
          }
        ],
        projects: [
          {
            id: '1',
            title: 'Residência Familiar - Zona Sul',
            location: 'São Paulo, SP',
            capacity: '8.5 kWp',
            savings: 'R$ 2.400/ano',
            image: 'https://images.pexels.com/photos/9875436/pexels-photo-9875436.jpeg?auto=compress&cs=tinysrgb&w=800',
            type: 'residential'
          },
          {
            id: '2',
            title: 'Empresa de Tecnologia',
            location: 'Campinas, SP',
            capacity: '45 kWp',
            savings: 'R$ 18.000/ano',
            image: 'https://images.pexels.com/photos/9875445/pexels-photo-9875445.jpeg?auto=compress&cs=tinysrgb&w=800',
            type: 'commercial'
          },
          {
            id: '3',
            title: 'Indústria Alimentícia',
            location: 'Ribeirão Preto, SP',
            capacity: '120 kWp',
            savings: 'R$ 48.000/ano',
            image: 'https://images.pexels.com/photos/9875449/pexels-photo-9875449.jpeg?auto=compress&cs=tinysrgb&w=800',
            type: 'industrial'
          }
        ],
        testimonials: [
          {
            id: '1',
            name: 'Carlos Silva',
            role: 'Proprietário',
            company: 'Residência Familiar',
            text: 'Excelente atendimento e instalação impecável. Minha conta de luz reduziu 90% no primeiro mês!',
            rating: 5,
            image: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          {
            id: '2',
            name: 'Ana Costa',
            role: 'Diretora Financeira',
            company: 'TechCorp',
            text: 'O ROI foi ainda melhor que o prometido. Recomendo a SolarTech para qualquer empresa.',
            rating: 5,
            image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          {
            id: '3',
            name: 'Roberto Oliveira',
            role: 'Gerente de Operações',
            company: 'Indústria AlimentAR',
            text: 'Profissionais competentes e projeto executado no prazo. Economia surpreendente!',
            rating: 5,
            image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
          }
        ],
        differentials: [
          {
            id: '1',
            title: 'Equipe Certificada',
            description: 'Profissionais com certificações internacionais e experiência comprovada',
            icon: 'Award'
          },
          {
            id: '2',
            title: 'Materiais Premium',
            description: 'Utilizamos apenas equipamentos de marcas líderes mundiais',
            icon: 'Shield'
          },
          {
            id: '3',
            title: 'Suporte Pós-Venda',
            description: 'Monitoramento 24/7 e suporte técnico especializado',
            icon: 'Users'
          },
          {
            id: '4',
            title: 'Financiamento Facilitado',
            description: 'Parcerias com bancos para financiamento em até 120x',
            icon: 'Clock'
          }
        ],
        socialMedia: {
          facebook: 'https://facebook.com/solartech',
          instagram: 'https://instagram.com/solartech',
          linkedin: 'https://linkedin.com/company/solartech'
        }
      });
    }
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula envio do formulário
    console.log('Formulário enviado:', contactForm);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        propertyType: 'residential',
        averageBill: '',
        message: ''
      });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      DollarSign: <DollarSign className="h-8 w-8" />,
      Leaf: <Leaf className="h-8 w-8" />,
      TrendingUp: <TrendingUp className="h-8 w-8" />,
      Wrench: <Wrench className="h-8 w-8" />,
      Award: <Award className="h-8 w-8" />,
      Shield: <Shield className="h-8 w-8" />,
      Users: <Users className="h-8 w-8" />,
      Clock: <Clock className="h-8 w-8" />
    };
    return icons[iconName] || <Sun className="h-8 w-8" />;
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Empresas - SolarConnect</title>
        <meta name="description" content="Detalhes da empresa instaladora de energia solar. Encontre informações e contatos na SolarConnect." />
      </Helmet>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="h-12 w-12 object-contain" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Sun className="h-7 w-7 text-white" />
                </div>
              )}
              <span className="text-2xl font-bold text-gray-900">{company.name}</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#inicio" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Início</a>
              <a href="#solucoes" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Soluções</a>
              <a href="#projetos" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Projetos</a>
              <a href="#sobre" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Sobre Nós</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">FAQ</a>
              <a href="#contato" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Contato</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user && !user.isAnonymous ? (
                <div className="hidden md:flex items-center space-x-3">
                  <img 
                    src={user.photoURL || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={logOut}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="hidden md:block px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition duration-300"
                >
                  Entrar
                </button>
              )}
              
              <a 
                href="#contato" 
                className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105"
              >
                Orçamento Grátis
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3 pt-4">
                <a href="#inicio" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Início</a>
                <a href="#solucoes" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Soluções</a>
                <a href="#projetos" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Projetos</a>
                <a href="#sobre" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Sobre Nós</a>
                <a href="#faq" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">FAQ</a>
                <a href="#contato" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Contato</a>
                {user && !user.isAnonymous ? (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="text-left text-gray-600 hover:text-blue-600 transition duration-300 font-medium"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={logOut}
                      className="text-left text-gray-600 hover:text-blue-600 transition duration-300 font-medium"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-left text-gray-600 hover:text-blue-600 transition duration-300 font-medium pt-2 border-t border-gray-200"
                  >
                    Entrar
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${company.heroImage})` }}
        ></div>
        <div className="relative container mx-auto text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {company.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            {company.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#contato"
              className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold text-lg rounded-full shadow-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Solicite Seu Orçamento Grátis
              <ArrowRight className="inline ml-2 h-5 w-5" />
            </a>
            <a 
              href="#solucoes"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Calcule Sua Economia
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="solucoes" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Vantagens da Energia Solar
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como a energia solar pode transformar sua vida e seu negócio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {company.benefits?.map((benefit) => (
              <div key={benefit.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
                  <div className="text-white">
                    {getIcon(benefit.icon)}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Processo simples e transparente do início ao fim
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Consulta e Projeto Personalizado</h3>
              <p className="text-gray-600">Análise detalhada do seu consumo e elaboração de projeto sob medida para suas necessidades</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Instalação por Especialistas</h3>
              <p className="text-gray-600">Equipe técnica certificada realiza a instalação com equipamentos de alta qualidade</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-yellow-600">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Conexão à Rede e Economia</h3>
              <p className="text-gray-600">Sistema conectado à rede elétrica e você começa a economizar imediatamente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Portfolio */}
      <section id="projetos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Projetos Realizados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça alguns dos nossos projetos de sucesso
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {company.projects?.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.type === 'residential' ? 'bg-blue-100 text-blue-800' :
                      project.type === 'commercial' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {project.type === 'residential' ? 'Residencial' :
                       project.type === 'commercial' ? 'Comercial' : 'Industrial'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-green-500" />
                      <span>Capacidade: {project.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Economia: {project.savings}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
              <Camera className="inline mr-2 h-5 w-5" />
              Ver Mais Projetos
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
              ))}
              <span className="text-2xl font-bold text-gray-900 ml-2">4.9/5</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {company.testimonials?.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 text-lg">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    {testimonial.company && (
                      <p className="text-sm text-blue-600">{testimonial.company}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="sobre" className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Por Que Nos Escolher
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Somos referência em energia solar com diferenciais únicos no mercado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {company.differentials?.map((differential) => (
              <div key={differential.id} className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-white">
                    {getIcon(differential.icon)}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{differential.title}</h3>
                <p className="opacity-90">{differential.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contato" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Solicite Seu Orçamento Grátis
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Preencha o formulário e receba uma proposta personalizada em até 24 horas
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-xl font-semibold mb-2">Formulário Enviado com Sucesso!</h3>
                <p>Entraremos em contato em breve para elaborar sua proposta personalizada.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Imóvel *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={contactForm.propertyType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    >
                      <option value="residential">Residencial</option>
                      <option value="commercial">Comercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="rural">Rural</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="averageBill" className="block text-sm font-medium text-gray-700 mb-2">
                    Média da Conta de Luz (R$)
                  </label>
                  <input
                    type="number"
                    id="averageBill"
                    name="averageBill"
                    value={contactForm.averageBill}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Ex: 350"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem Adicional
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Descreva suas necessidades ou dúvidas..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-green-700 transition duration-300 transform hover:scale-105"
                >
                  <Send className="inline mr-2 h-5 w-5" />
                  Solicitar Orçamento Grátis
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="h-10 w-10 object-contain" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <Sun className="h-6 w-6 text-white" />
                  </div>
                )}
                <span className="text-2xl font-bold">{company.name}</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                {company.description}
              </p>
              <div className="flex space-x-4">
                {company.socialMedia?.facebook && (
                  <a href={company.socialMedia.facebook} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300">
                    <span className="text-sm font-bold">f</span>
                  </a>
                )}
                {company.socialMedia?.instagram && (
                  <a href={company.socialMedia.instagram} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition duration-300">
                    <span className="text-sm font-bold">ig</span>
                  </a>
                )}
                {company.socialMedia?.linkedin && (
                  <a href={company.socialMedia.linkedin} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300">
                    <span className="text-sm font-bold">in</span>
                  </a>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6">Links Rápidos</h3>
              <ul className="space-y-3">
                <li><a href="#inicio" className="text-gray-400 hover:text-white transition duration-300">Início</a></li>
                <li><a href="#solucoes" className="text-gray-400 hover:text-white transition duration-300">Soluções</a></li>
                <li><a href="#projetos" className="text-gray-400 hover:text-white transition duration-300">Projetos</a></li>
                <li><a href="#sobre" className="text-gray-400 hover:text-white transition duration-300">Sobre Nós</a></li>
                <li><a href="#contato" className="text-gray-400 hover:text-white transition duration-300">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6">Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400">{company.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400">{company.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400">{company.address}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} {company.name}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div> {/* Closes <div className="min-h-screen bg-white"> */}
  </> // Added closing fragment tag
  );
};