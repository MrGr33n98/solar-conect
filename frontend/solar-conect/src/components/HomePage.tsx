import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Zap, Shield, TrendingUp, Star, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { CompanySearch } from './CompanySearch'; // Added

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user, logOut } = useAuth();

  return (
    <>
      <Helmet>
        <title>SolarConnect - Conectando Você à Energia Solar</title>
        <meta name="description" content="Encontre os melhores instaladores de energia solar, solicite orçamentos e comece seu projeto de energia renovável com a SolarConnect." />
      </Helmet>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Sun className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">SolarConnect</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-600 hover:text-blue-600 transition duration-300">Início</a>
              <a href="#empresas" className="text-gray-600 hover:text-blue-600 transition duration-300">Empresas</a>
              <a href="#solucoes" className="text-gray-600 hover:text-blue-600 transition duration-300">Soluções</a>
              <a href="#contato" className="text-gray-600 hover:text-blue-600 transition duration-300">Contato</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user && !user.isAnonymous ? (
                <div className="flex items-center space-x-3">
                  <img 
                    src={user.photoURL || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700 hidden sm:block">
                    Olá, {user.displayName || user.email}!
                  </span>
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
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition duration-300"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* New Search Section - Placed at the top of the main content */}
      <section id="search-empresas" className="py-12 md:py-16 bg-gray-100"> {/* Example styling */}
        <div className="container mx-auto px-6">
          {/* Optional: Add a title for the search section if desired */}
          {/* <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            Encontre Empresas de Energia Solar
          </h1> */}
          <CompanySearch />
        </div>
      </section>

      {/* Hero Section */}
      <section id="inicio" className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Sua Fonte de Energia<br />
            <span className="text-yellow-400">Limpa e Sustentável</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Conectamos você às melhores empresas de energia solar do mercado.
            Descubra soluções personalizadas para sua casa ou empresa.
          </p>
          <button className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold text-lg rounded-full shadow-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105 hover:shadow-xl">
            Encontre Sua Solução Solar
            <ArrowRight className="inline ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a SolarConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma oferece as melhores soluções em energia solar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Economia Garantida</h3>
              <p className="text-gray-600">Reduza sua conta de luz em até 90% com energia solar</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Empresas Certificadas</h3>
              <p className="text-gray-600">Trabalhamos apenas com empresas licenciadas e experientes</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">ROI Rápido</h3>
              <p className="text-gray-600">Retorno do investimento em 3-5 anos com valorização do imóvel</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustentabilidade</h3>
              <p className="text-gray-600">Contribua para um futuro mais limpo e sustentável</p>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="empresas" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Parceiros de Confiança
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 h-20 rounded-lg flex items-center justify-center hover:bg-gray-200 transition duration-300">
                <Sun className="h-10 w-10 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h2 className="text-4xl font-bold mb-6">
              Encontre a solução perfeita para o seu negócio!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Nossa plataforma conecta você às melhores empresas e tecnologias em energia solar.
              Descubra softwares de gestão, monitoramento e muito mais.
            </p>
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition duration-300">
              Saiba Mais
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 p-4 rounded-lg">
                  <TrendingUp className="h-8 w-8 mb-2" />
                  <span className="text-sm">Analytics</span>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <Zap className="h-8 w-8 mb-2" />
                  <span className="text-sm">Monitoramento</span>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <Shield className="h-8 w-8 mb-2" />
                  <span className="text-sm">Segurança</span>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <Sun className="h-8 w-8 mb-2" />
                  <span className="text-sm">Eficiência</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "João Silva",
                role: "CEO, SolarSolutions",
                image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
                text: "A SolarConnect transformou a forma como encontramos parceiros de energia solar. É intuitivo e nos conectou com as melhores opções do mercado!"
              },
              {
                name: "Mariana Costa",
                role: "Gerente de Vendas, SunPower",
                image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
                text: "Ferramenta essencial para nossa empresa! O dashboard é completo e as análises de intenção de compra são incrivelmente úteis."
              },
              {
                name: "Carlos Oliveira",
                role: "Diretor, EcoEnergy",
                image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150",
                text: "Excelente plataforma! Conseguimos aumentar nossa base de clientes em 150% no primeiro ano usando a SolarConnect."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Sun className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">SolarConnect</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Conectando você ao futuro da energia solar. Encontre as melhores 
                empresas e soluções em energia renovável.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300 cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition duration-300 cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300 cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6">Links Rápidos</h3>
              <ul className="space-y-3">
                <li><a href="#inicio" className="text-gray-400 hover:text-white transition duration-300">Início</a></li>
                <li><a href="#empresas" className="text-gray-400 hover:text-white transition duration-300">Empresas</a></li>
                <li><a href="#solucoes" className="text-gray-400 hover:text-white transition duration-300">Soluções</a></li>
                <li><a href="#contato" className="text-gray-400 hover:text-white transition duration-300">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6">Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400">info@solarconnect.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400">(11) 9999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400">São Paulo, SP</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} SolarConnect. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div> {/* Closes <div className="min-h-screen bg-white"> */}
  </> // Added closing fragment tag
  );
};