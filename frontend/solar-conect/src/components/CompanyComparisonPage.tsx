import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// Assuming a shared Company type, or define a local one consistent with App.tsx
// For now, let's use the one from App.tsx as a reference.
interface Company {
  id: number;
  name: string;
  logoUrl?: string;
  description?: string;
  city?: string;
  state?: string;
  // segment?: string[]; // Assuming segment is an array of strings
  // servicesProvided?: string[]; // Assuming servicesOffered is what backend provides as TEXT
  servicesOffered?: string; // From backend Company model
  brandsWorkedWith?: string; // From backend Company model
  warrantyDetails?: string; // From backend Company model
  // averagePricePerKwp?: number; // Not in current backend model
  // strongPoints?: string[]; // Assuming strengths is what backend provides as TEXT
  strengths?: string; // From backend Company model
  rating?: number; // Not in current backend model (could be derived or added)
  numReviews?: number; // Not in current backend model
  contactEmail?: string; // From backend Company model
  website?: string; // From backend Company model
  // Added fields from backend Company model
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  bannerUrl?: string;
  valueIndicator?: string;
  categories?: { id: number; name: string }[]; // From backend include
  // userId?: number; // Usually not displayed directly
  // owner?: { id: number; name: string; email: string }; // From backend include

  // Add any other fields expected from the objects passed by App.tsx
  [key: string]: any;
}

interface CompanyComparisonPageProps {
  selectedCompaniesData: Company[];
  onNavigate: (page: string, data?: any) => void;
}

export const CompanyComparisonPage: React.FC<CompanyComparisonPageProps> = ({ selectedCompaniesData, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false); // For any future async operations within this page
  const [error, setError] = useState<string | null>(null);

  const characteristics = [
    { label: 'Descrição', key: 'description', type: 'text' },
    // Assuming 'segment' from App.tsx's Company type is a string, not array based on backend.
    // If it were an array: { label: 'Segmentos Atendidos', key: 'segment', type: 'array' },
    { label: 'Segmentos Atendidos', key: 'segment', type: 'text' }, // Assuming string for now
    { label: 'Cidade', key: 'city', type: 'text' },
    { label: 'Estado', key: 'state', type: 'text' },
    { label: 'Website', key: 'website', type: 'link' },
    { label: 'E-mail de Contato', key: 'contactEmail', type: 'email' },
    // { label: 'Telefone', key: 'phone', type: 'phone' }, // 'phone' not in current Company interface
    { label: 'Serviços Prestados', key: 'servicesOffered', type: 'text' }, // Backend 'servicesOffered' is TEXT
    { label: 'Marcas Trabalhadas', key: 'brandsWorkedWith', type: 'text' }, // Backend 'brandsWorkedWith' is TEXT
    { label: 'Detalhes da Garantia', key: 'warrantyDetails', type: 'text' }, // Backend 'warrantyDetails' is TEXT
    // { label: 'Garantia Painel', key: 'warrantyYears.painel', type: 'years' }, // warrantyYears not in current Company interface
    // { label: 'Garantia Inversor', key: 'warrantyYears.inversor', type: 'years' },
    // { label: 'Garantia Instalação', key: 'warrantyYears.instalacao', type: 'years' },
    { label: 'Pontos Fortes', key: 'strengths', type: 'text' }, // Backend 'strengths' is TEXT
    // { label: 'Avaliação Média', key: 'rating', type: 'rating' }, // rating & numReviews not in current Company interface
    { label: 'Indicador de Valor', key: 'valueIndicator', type: 'text'},
    // We can add more if these fields are populated in the Company objects
  ];

  const renderStars = (rating: number = 0, numReviews: number = 0) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5; // Simple half-star logic, could be more nuanced
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));
    return (
      <div className="flex flex-col items-center">
        <div className="flex">
          {Array(fullStars).fill(null).map((_, i) => <span key={`full-${i}`} className="text-yellow-400 text-xl">★</span>)}
          {halfStar && <span className="text-yellow-400 text-xl">★</span>} {/* Using full star for half for simplicity */}
          {Array(emptyStars).fill(null).map((_, i) => <span key={`empty-${i}`} className="text-gray-300 text-xl">☆</span>)}
        </div>
        <span className="text-xs text-gray-500 mt-1">({numReviews || 0} {numReviews === 1 ? 'avaliação' : 'avaliações'})</span>
      </div>
    );
  };


  // Log received data for debugging (optional)
  useEffect(() => {
    console.log("Companies for Comparison:", selectedCompaniesData);
    if (!selectedCompaniesData || selectedCompaniesData.length < 2) {
      // This message could be displayed more prominently if needed
      console.warn("Not enough companies selected for comparison.");
    }
  }, [selectedCompaniesData]);

  if (!selectedCompaniesData || selectedCompaniesData.length < 2) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <Helmet>
          <title>Comparar Empresas - SolarConnect</title>
        </Helmet>
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Seleção Insuficiente</h2>
          <p className="text-gray-700 mb-6">
            Por favor, selecione pelo menos duas empresas na página de busca para comparar.
          </p>
          <button
            onClick={() => onNavigate('home')} // Navigate back to HomePage (where search is)
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Voltar para Busca
          </button>
        </div>
      </div>
    );
  }

  // Main comparison layout will go here in subsequent steps
  return (
    <div className="font-sans bg-gray-50 min-h-screen"> {/* Using a common sans-serif font class if available, e.g., font-inter from Tailwind config */}
      <Helmet>
        <title>Comparar {selectedCompaniesData.map(c => c.name).join(' vs ')} - SolarConnect</title>
      </Helmet>

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')} // Navigate back to HomePage (where search is)
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            &larr; Voltar para Busca
          </button>
          {/* Potential placeholder for future actions like "Share Comparison" */}
          <div></div>
        </div>
      </header>

      {/* Main content wrapper */}
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
          Comparativo de Empresas de Energia Solar
        </h1>
        <p className="text-center text-gray-600 mb-6 md:mb-8">
          Comparando {selectedCompaniesData.length} empresa(s): {selectedCompaniesData.map(c => c.name).join(' vs ')}
        </p>

        {/* Comparison Table Structure */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200 mt-6">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              {/* The 'top-16' class (64px) below assumes the main page sticky header is h-16. Adjust if main header height changes. */}
              <tr className="sticky top-16 z-10 bg-gray-100 shadow">
                <th
                  scope="col"
                  className="sticky left-0 z-20 bg-gray-100 px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"
                >
                  Características
                </th>
                {selectedCompaniesData.map((company) => (
                  <th
                    key={company.id}
                    scope="col"
                    style={{minWidth: '200px'}} // Ensure columns have a minimum width
                    className="px-4 py-3 md:px-6 md:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300" // Removed whitespace-nowrap from th
                  >
                    <div className="flex flex-col items-center justify-center space-y-1">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={`${company.name} logo`} className="h-12 w-auto max-h-12 object-contain mb-1 rounded" />
                      ) : (
                        <div className="h-12 w-12 flex items-center justify-center bg-gray-200 text-gray-400 rounded-md text-xs mb-1">No Logo</div>
                      )}
                      {/* Changed span to allow wrapping and constrain width if necessary */}
                      <span className="font-semibold text-gray-700 text-sm text-center block break-words max-w-[180px]">{company.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {characteristics.map((char) => (
                <tr key={char.key} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150">
                  <td className="sticky left-0 z-10 px-4 py-3 md:px-6 md:py-4 whitespace-normal text-sm font-medium text-gray-800 border-r border-gray-300 bg-inherit">
                    {char.label}
                  </td>
                  {selectedCompaniesData.map((company) => {
                    let value: any = char.key.includes('.')
                      ? char.key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), company)
                      : company[char.key as keyof Company];

                    let displayValue: React.ReactNode = <span className="text-gray-400 italic">N/D</span>; // N/D for Not Available/Não Disponível

                    if (value !== undefined && value !== null && String(value).trim() !== '') {
                      switch (char.type) {
                        case 'currency':
                          displayValue = typeof value === 'number'
                            ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            : <span className="text-gray-400 italic">N/D</span>;
                          break;
                        case 'array': // Assuming array values are strings, or convert to string
                           displayValue = Array.isArray(value) && value.length > 0
                            ? (
                                <ul className="list-disc list-inside text-left text-xs pl-2">
                                  {value.map((item, index) => <li key={index}>{String(item)}</li>)}
                                </ul>
                              )
                            : (typeof value === 'string' && value.trim() !== '' ? value : <span className="text-gray-400 italic">N/D</span>); // Display as text if string
                          break;
                        case 'years':
                          displayValue = `${value} anos`;
                          break;
                        case 'rating': // Assuming company object has 'rating' and 'numReviews'
                          displayValue = renderStars(company.rating, company.numReviews);
                          break;
                        case 'link':
                          displayValue = <a href={String(value).startsWith('http') ? String(value) : `https://${String(value)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline break-all">{String(value)}</a>;
                          break;
                        case 'email':
                          displayValue = <a href={`mailto:${String(value)}`} className="text-blue-600 hover:text-blue-800 hover:underline break-all">{String(value)}</a>;
                          break;
                        case 'phone': // Assuming 'phone' field exists
                          displayValue = <a href={`tel:${String(value)}`} className="text-blue-600 hover:text-blue-800 hover:underline">{String(value)}</a>;
                          break;
                        case 'text':
                        default:
                          displayValue = String(value);
                          break;
                      }
                    }
                    return (
                      <td key={`${company.id}-${char.key}`} className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-600 text-center border-l border-gray-300 align-top whitespace-normal">
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* End of Comparison Table Structure */}
      </main>
    </div>
  );
};
