import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// This Company interface should ideally be shared and match the full data structure.
// It's defined comprehensively here for this component's needs.
interface Review {
  customerName: string;
  rating: number;
  comment: string;
}

interface Company {
  id: number | string;
  companyName: string;
  location: {
    city: string;
    state: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
  };
  logo: string; // Filename
  banner: string; // Filename
  description: string;
  serviceCategories: string[]; // This was in fictional data
  reviews: Review[];

  // Fields from "Comparator/Detailed Fields" and fictional data
  website?: string;
  // contactEmail from backend model, email from fictional data's CompanyPage.tsx. Assume 'email' for general contact.
  email?: string;
  phone?: string;
  valueIndicator?: string;
  strengths?: string; // Fictional data had this as a single TEXT, but G2 implies array. Let's use string to match fictional.
  warrantyDetails?: string;
  servicesOffered?: string; // Fictional data had this as TEXT
  brandsWorkedWith?: string; // Fictional data had this as TEXT

  // These fields are not in the provided fictional_company_data.json structure
  // but were in the Company interface in App.tsx. Keep for consistency if data might include them.
  averagePricePerKwp?: number;
  rating?: number; // Overall average rating
  numReviews?: number; // Total number of reviews

  // Allow other properties that might come from the full dataset
  [key: string]: any;
}

interface CompanyDetailPageProps {
  companyId: string | number;
  onNavigate: (page: string, data?: any) => void;
}

// Placeholder for the full dataset. In a real app, this would come from a global state, context, or be fetched.
// For this subtask's execution, it will be empty. Jules will use the actual data conceptually.
let JULES_LOADED_FICTIONAL_DATA: Company[] = [
    // Example structure for subtask's isolated context, REMOVE/REPLACE when Jules uses full data.
    // {
    //   id: "temp1",
    //   companyName: "Sample Solar Inc. (Placeholder)",
    //   location: { city: "Sample City", state: "SS"},
    //   logo:"logo_sample.png",
    //   banner:"banner_sample.jpg",
    //   description:"A sample description of a solar company.",
    //   serviceCategories:["Instalação Residencial", "Manutenção"],
    //   reviews:[{customerName: "John Doe", rating: 5, comment: "Great service!"}]
    // }
];


export const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({ companyId, onNavigate }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to render stars for reviews
  const renderStarsDisplay = (rating: number, starSize: string = "h-5 w-5") => {
    const fullStars = Math.floor(rating);
    // Simple half-star: if decimal is >= 0.4, count as a full star for display simplicity here, or use a half-star icon
    const roundedRating = Math.round(rating * 2) / 2; // Rounds to nearest .0 or .5
    const displayFullStars = Math.floor(roundedRating);
    const halfStarExists = roundedRating % 1 !== 0;
    const emptyStars = 5 - displayFullStars - (halfStarExists ? 1 : 0);

    const stars = [];
    for (let i = 0; i < displayFullStars; i++) stars.push(<span key={`full-${i}`} className={`text-yellow-400 ${starSize}`}>★</span>);
    if (halfStarExists) stars.push(<span key="half" className={`text-yellow-400 ${starSize}`}>☆</span>); // Using outline for half, or find a specific half-star icon
    for (let i = 0; i < emptyStars; i++) stars.push(<span key={`empty-${i}`} className={`text-gray-300 ${starSize}`}>☆</span>);
    return <div className="flex items-center">{stars}</div>;
  };

  // This state simulates having access to the larger dataset.
  // In this subtask's isolated run, it will use the JULES_LOADED_FICTIONAL_DATA placeholder.
  const [internalAllCompanies, setInternalAllCompanies] = useState<Company[]>(JULES_LOADED_FICTIONAL_DATA);

  useEffect(() => {
    // In a real app, if internalAllCompanies is empty, you might fetch all company data here,
    // or fetch just the specific company by ID if your backend supports that.
    // For this phase, we rely on JULES_LOADED_FICTIONAL_DATA being conceptually populated.

    // If JULES_LOADED_FICTIONAL_DATA is empty (as it will be in subtask execution by default),
    // this effect simulates attempting to "load" it.
    // This is purely for structuring the component; actual data loading strategy is external.
    if (internalAllCompanies.length === 0) {
        // console.log("Attempting to simulate load of master company data (will be empty in subtask).");
        // In a real scenario, this might be an async fetch to a JSON file or API endpoint
        // if data isn't already in a global state.
        // For now, we just acknowledge it's empty for the subtask run.
    }
  }, []); // Runs once to set initial data (which is placeholder here)

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const findCompany = () => {
      if (internalAllCompanies.length === 0 && !isLoading) {
        // This means the "master data" (placeholder) is empty and we are not in an initial loading state.
        // This state indicates that the conceptual data loading by Jules hasn't happened for this component's context.
        // setError("Dados de empresas não disponíveis. Verifique o carregamento inicial.");
        // For now, let's assume if it's empty, the company won't be found.
      }

      // Try to find the company. Note: companyId from props might be number or string.
      const foundCompany = internalAllCompanies.find(c => String(c.id) === String(companyId) || c.companyName === companyId);

      if (foundCompany) {
        setCompany(foundCompany);
      } else {
        // Only set "not found" error if we actually had data to search through.
        // If internalAllCompanies is empty, the error is more about data availability.
        if (internalAllCompanies.length > 0 || !isLoading) { // Or after initial load attempt
             setError(`Empresa com ID ou Nome '${companyId}' não encontrada.`);
        } else {
            // Still waiting for conceptual data load or it failed silently.
            // setError("Aguardando dados das empresas ou falha no carregamento inicial.");
        }
      }
      setIsLoading(false);
    };

    // If internalAllCompanies is empty, this will likely result in "not found" unless companyId matches the placeholder.
    findCompany();

  }, [companyId, internalAllCompanies, isLoading]); // Re-run if companyId or the dataset changes.

  if (isLoading) { // Show loading if actively finding/setting company
    return <div className="p-8 text-center text-gray-600">Carregando dados da empresa...</div>;
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center min-h-screen flex flex-col justify-center items-center bg-gray-50">
         <Helmet>
            <title>Erro ao Carregar Empresa | SolarConnect</title>
        </Helmet>
        <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Erro</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button onClick={() => onNavigate('home')} className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
            Voltar para Busca
            </button>
        </div>
      </div>
    );
  }

  if (!company) {
    // This state means data loading (even if placeholder) finished, but no company matched.
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <Helmet>
            <title>Empresa Não Encontrada | SolarConnect</title>
        </Helmet>
        <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Empresa Não Encontrada</h2>
            <p className="text-gray-600 mb-6">Não foi possível encontrar detalhes para a empresa com ID ou Nome '{companyId}'.</p>
            <button onClick={() => onNavigate('home')} className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
            Voltar para Busca
            </button>
        </div>
      </div>
    );
  }

  // Main detail page layout
  return (
    <div className="font-sans bg-gray-50 min-h-screen"> {/* Assuming font-sans is globally defined or replace with font-inter if needed */}
      <Helmet>
        <title>{company.companyName} - Detalhes | SolarConnect</title>
      </Helmet>

      <header className="sticky top-0 z-30 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            &larr; Voltar para Busca
          </button>
          <h1 className="text-xl font-semibold text-gray-700 truncate ml-4">{company.companyName}</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {company.banner && (
          <div className="mb-4 md:mb-8 h-48 md:h-64 lg:h-80 w-full overflow-hidden rounded-lg shadow-lg">
            <img
              src={`/images/banners/${company.banner}`} // Placeholder path
              alt={`${company.companyName} banner`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 mb-6">
              {company.logo && (
                <img
                  src={`/images/logos/${company.logo}`} // Placeholder path
                  alt={`${company.companyName} logo`}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-md border border-gray-200 shadow-md bg-white p-1 flex-shrink-0"
                />
              )}
              <div className="text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {company.companyName}
                </h1>
                <p className="text-md text-gray-600 mt-1">{company.location.city}, {company.location.state}</p>
                {company.website && <p className="text-sm text-blue-600 hover:underline mt-1"><a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>}
              </div>
            </div>

            {/* Full Location */}
            <div className="mt-6 border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Endereço</h2>
              <address className="not-italic text-gray-600">
                {company.location.addressLine1 && <p>{company.location.addressLine1}</p>}
                {company.location.addressLine2 && <p>{company.location.addressLine2}</p>}
                <p>{company.location.city}, {company.location.state} {company.location.postalCode && `- ${company.location.postalCode}`}</p>
              </address>
            </div>

            {/* Description */}
            <div className="mt-6 border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Sobre {company.companyName}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{company.description || 'Nenhuma descrição disponível.'}</p>
            </div>

            {/* Contact Information */}
            <div className="mt-6 border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Contato</h2>
              <ul className="space-y-2 text-gray-600">
                {company.phone && (
                  <li>
                    <strong>Telefone:</strong> <a href={`tel:${company.phone}`} className="text-blue-600 hover:underline">{company.phone}</a>
                  </li>
                )}
                {company.email && ( // Assuming 'email' is the contact email from fictional data
                  <li>
                    <strong>E-mail:</strong> <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">{company.email}</a>
                  </li>
                )}
                {company.website && ( // company.website is already displayed with name, but can be repeated here if desired
                  <li>
                    <strong>Website:</strong> <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.website}</a>
                  </li>
                )}
              </ul>
              {(!company.phone && !company.email && !company.website) && <p className="text-gray-500 italic">Nenhuma informação de contato disponível.</p>}
            </div>

            {/* Service Categories - already present, ensure it's after new sections or integrate as needed */}
            <div className="mt-6 border-t pt-6">
                 <h2 className="text-2xl font-semibold text-gray-700 mb-3">Categorias de Serviço</h2>
                 {company.serviceCategories && company.serviceCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {company.serviceCategories.map((category, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full shadow-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                 ) : (
                    <p className="text-gray-600 italic">Nenhuma categoria de serviço informada.</p>
                 )}
            </div>

            {/* Detailed Comparator Fields Section */}
            <div className="mt-6 border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Diferenciais e Detalhes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-gray-600">

                {company.valueIndicator && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Posicionamento de Valor:</h3>
                    <p>{company.valueIndicator}</p>
                  </div>
                )}

                {company.averagePricePerKwp && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Preço Médio Estimado por kWp:</h3>
                    <p>{company.averagePricePerKwp.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                )}

                {/* Strengths: Render as list if array, or paragraph if string */}
                {company.strengths && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Pontos Fortes:</h3>
                    {Array.isArray(company.strengths) && company.strengths.length > 0 ? (
                      <ul className="list-disc list-inside ml-4">
                        {company.strengths.map((item, index) => <li key={`strength-${index}`}>{item}</li>)}
                      </ul>
                    ) : typeof company.strengths === 'string' && company.strengths.trim() !== '' ? (
                      <p className="whitespace-pre-line">{company.strengths}</p>
                    ) : <p className="italic">Não informado.</p>}
                  </div>
                )}

                {/* Services Offered (Detailed): Render as list if array, or paragraph if string */}
                {/* This assumes 'servicesOffered' might be more detailed than 'serviceCategories' */}
                {company.servicesOffered && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Serviços Detalhados:</h3>
                    {Array.isArray(company.servicesOffered) && company.servicesOffered.length > 0 ? (
                      <ul className="list-disc list-inside ml-4">
                        {company.servicesOffered.map((item, index) => <li key={`service-${index}`}>{item}</li>)}
                      </ul>
                    ) : typeof company.servicesOffered === 'string' && company.servicesOffered.trim() !== '' ? (
                      <p className="whitespace-pre-line">{company.servicesOffered}</p>
                    ) : <p className="italic">Não informado.</p>}
                  </div>
                )}

                {/* Brands Worked With: Render as list if array, or paragraph if string */}
                {company.brandsWorkedWith && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Marcas Trabalhadas:</h3>
                    {Array.isArray(company.brandsWorkedWith) && company.brandsWorkedWith.length > 0 ? (
                      <ul className="list-disc list-inside ml-4">
                        {company.brandsWorkedWith.map((item, index) => <li key={`brand-${index}`}>{item}</li>)}
                      </ul>
                    ) : typeof company.brandsWorkedWith === 'string' && company.brandsWorkedWith.trim() !== '' ? (
                      <p className="whitespace-pre-line">{company.brandsWorkedWith}</p>
                    ) : <p className="italic">Não informado.</p>}
                  </div>
                )}

                {/* Warranty Details (Text Field) */}
                {company.warrantyDetails && typeof company.warrantyDetails === 'string' && (
                   <div>
                    <h3 className="text-lg font-medium text-gray-800">Detalhes da Garantia (Texto):</h3>
                    <p className="whitespace-pre-line">{company.warrantyDetails}</p>
                  </div>
                )}

                {/* Warranty Years (Object from Fictional Data) */}
                {company.warrantyYears && typeof company.warrantyYears === 'object' &&
                 (company.warrantyYears.painel || company.warrantyYears.inversor || company.warrantyYears.instalacao) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Garantias Detalhadas (Anos):</h3>
                    {company.warrantyYears.painel && <p><strong>Painel:</strong> {company.warrantyYears.painel} anos</p>}
                    {company.warrantyYears.inversor && <p><strong>Inversor:</strong> {company.warrantyYears.inversor} anos</p>}
                    {company.warrantyYears.instalacao && <p><strong>Instalação:</strong> {company.warrantyYears.instalacao} anos</p>}
                  </div>
                )}
              </div>
              {(!company.valueIndicator && !company.averagePricePerKwp && !company.strengths && !company.servicesOffered && !company.brandsWorkedWith && !company.warrantyDetails && !company.warrantyYears ) &&
                <p className="text-gray-500 italic mt-4">Nenhum detalhe adicional ou diferencial informado.</p>
              }
            </div>

            <p className="mt-8 text-center text-gray-500 italic">
                (Seção de Avaliações de Clientes será implementada na próxima etapa.)
            </p>

            {/* Customer Reviews Section */}
            <div className="mt-6 border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Avaliações de Clientes</h2>
              {company.reviews && company.reviews.length > 0 ? (
                <>
                  <div className="mb-6 p-4 bg-gray-100 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow">
                    <div>
                      <span className="text-3xl font-bold text-gray-800">
                        {(company.reviews.reduce((acc, review) => acc + review.rating, 0) / company.reviews.length).toFixed(1)}
                      </span>
                      <span className="text-gray-600"> / 5</span>
                      {renderStarsDisplay(company.reviews.reduce((acc, review) => acc + review.rating, 0) / company.reviews.length, "h-6 w-6")}
                    </div>
                    <p className="text-gray-700 font-medium">
                      Baseado em {company.reviews.length} {company.reviews.length === 1 ? 'avaliação' : 'avaliações'}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {company.reviews.map((review, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-2">
                          {/* Placeholder for customer avatar if available in future */}
                          {/* <img src="/path/to/avatar.png" alt={review.customerName} className="w-10 h-10 rounded-full mr-3" /> */}
                          <div>
                            <h4 className="font-semibold text-gray-800">{review.customerName}</h4>
                            {renderStarsDisplay(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-600 italic leading-relaxed">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-600 italic">Esta empresa ainda não possui avaliações.</p>
              )}
            </div>
        </div>
      </main>
    </div>
  );
};
