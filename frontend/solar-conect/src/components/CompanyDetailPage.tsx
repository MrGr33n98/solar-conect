import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth provides { user, loading (auth loading state) }

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
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true); // For company data loading
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('visaoGeral'); // Default tab

  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: 'Residencial', // Default value
    averageBill: '',
    message: ''
  });
  const [formSubmitStatus, setFormSubmitStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Analytics Page View Effect
  useEffect(() => {
    if (company && company.id && !authLoading) { // Ensure company data is loaded and auth state is resolved
      const pageViewData = {
        type: 'page_view',
        pageTitle: document.title,
        pageUrl: window.location.href,
        companyId: company.id,
        companyName: company.companyName,
        userId: user?.id || null,
        isAnonymousUser: user?.isAnonymous !== undefined ? user.isAnonymous : null,
        timestamp_client: new Date().toISOString()
      };
      console.log("ANALYTICS EVENT (Conceptual): page_view", pageViewData);

      // --- Conceptual Firestore Interaction ---
      // Describe what should happen:
      // Add a document to `analytics` collection (or `artifacts/{appId}/analytics`):
      // {
      //   type: 'page_view',
      //   pageUrl: window.location.href,
      //   pageTitle: document.title, // or specific like `Company Detail: ${company.companyName}`
      //   companyId: company.id,
      //   companyName: company.companyName,
      //   userId: user?.id || null,
      //   isAnonymousUser: user?.isAnonymous !== undefined ? user.isAnonymous : null,
      //   timestamp: serverTimestamp() // Use Firebase serverTimestamp for actual implementation
      // }
      // --- End Conceptual Firestore Interaction ---
    }
  }, [company, user, authLoading]); // Run when company data, user, or authLoading state changes
      // Describe what should happen:
      // Add a document to `analytics` collection (or `artifacts/{appId}/analytics`):
      // {
      //   type: 'page_view',
      //   pageUrl: window.location.href,
      //   pageTitle: document.title, // or specific like `Company Detail: ${company.companyName}`
      //   companyId: company.id,
      //   companyName: company.companyName,
      //   // userId: authContext.user?.id, // If user is logged in and context is available
      //   timestamp: serverTimestamp() // Use Firebase serverTimestamp for actual implementation
      // }
      // --- End Conceptual Firestore Interaction ---
    }
  }, [company]); // Run when company data is successfully set/changed


  const tabs = [
    { id: 'visaoGeral', label: 'Visão Geral' },
    { id: 'depoimentos', label: 'Depoimentos' },
    { id: 'precoGarantia', label: 'Preço & Garantia' },
    { id: 'servicosMarcas', label: 'Serviços & Marcas' },
    { id: 'projetos', label: 'Projetos Reais' }, // Changed label for clarity
    { id: 'contato', label: 'Solicitar Orçamento' }
  ];

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSubmitStatus(null);

    const leadData = {
      ...contactFormData,
      companyId: company?.id,
      companyName: company?.companyName,
      submittedAt: new Date().toISOString()
    };

    console.log("Lead Data to be submitted:", leadData); // Simulate submission

    // Conceptual Lead Submission Analytics
    const analyticsLeadData = {
      type: 'lead_submission',
      companyId: company?.id,
      companyName: company?.companyName,
      leadFormFieldsSummary: {
        propertyType: leadData.propertyType,
      },
      userId: user?.id || null,
      isAnonymousUser: user?.isAnonymous !== undefined ? user.isAnonymous : null,
      timestamp_client: new Date().toISOString()
    };
    console.log("ANALYTICS EVENT (Conceptual): lead_submission", analyticsLeadData);

    // --- Conceptual Firestore Interaction ---
    // Describe what should happen:
    // Add a document to `analytics` collection (or `artifacts/{appId}/analytics`):
    // {
    //   type: 'lead_submission',
    //   companyId: company?.id,
    //   companyName: company?.companyName,
    //   userId: user?.id || null,
    //   isAnonymousUser: user?.isAnonymous !== undefined ? user.isAnonymous : null,
    //   // leadId: newLeadDocumentId, // ID of the lead document if just created in Firestore
    //   formDataSummary: {
    //       propertyType: leadData.propertyType,
    //   },
    //   timestamp: serverTimestamp() // Use Firebase serverTimestamp for actual implementation
    // }
    // --- End Conceptual Firestore Interaction ---

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setFormSubmitStatus({ message: "Solicitação enviada com sucesso! A empresa entrará em contato em breve.", type: 'success' });
    setContactFormData({ name: '', email: '', phone: '', propertyType: 'Residencial', averageBill: '', message: '' }); // Reset form

    setIsSubmitting(false);
  };

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
            {/* Company Header (Logo, Name, Location, Website) */}
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
                {company.website && <p className="text-sm text-blue-600 hover:underline mt-1"><a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer">{company.website}</a></p>}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-4 md:space-x-6 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-3 px-2 md:px-4 border-b-2 font-medium text-sm transition-colors duration-150
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'visaoGeral' && (
                <div id="visaoGeralContent" className="space-y-6 animate-fadeIn">
                  {/* Description Section JSX */}
                  <section>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Sobre a Empresa</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{company.description || 'Nenhuma descrição disponível.'}</p>
                  </section>
                  {/* Location Section JSX */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Endereço</h3> {/* Changed to text-lg for better hierarchy */}
                    <address className="not-italic text-gray-600">
                      {company.location.addressLine1 && <p>{company.location.addressLine1}</p>}
                      {company.location.addressLine2 && <p>{company.location.addressLine2}</p>}
                      <p>{company.location.city}, {company.location.state} {company.location.postalCode && `- ${company.location.postalCode}`}</p>
                    </address>
                  </section>
                   {/* Strengths (from "Diferenciais e Detalhes") JSX */}
                  {company.strengths && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Pontos Fortes</h3> {/* Changed to text-lg */}
                      {Array.isArray(company.strengths) && company.strengths.length > 0 ? (
                        <ul className="list-disc list-inside ml-4 text-gray-600">
                          {company.strengths.map((item, index) => <li key={`strength-${index}`}>{item}</li>)}
                        </ul>
                      ) : typeof company.strengths === 'string' && company.strengths.trim() !== '' ? (
                        <p className="whitespace-pre-line text-gray-600">{company.strengths}</p>
                      ) : <p className="italic text-gray-500">Não informado.</p>}
                    </section>
                  )}
                  {/* Contact Info (moved to Visão Geral for quick access) */}
                  <section>
                     <h3 className="text-lg font-semibold text-gray-700 mb-2">Informações de Contato</h3> {/* Changed to text-lg */}
                     <ul className="space-y-1 text-gray-600">
                        {company.phone && <li><strong>Telefone:</strong> <a href={`tel:${company.phone}`} className="text-blue-600 hover:underline">{company.phone}</a></li>}
                        {company.email && <li><strong>E-mail:</strong> <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">{company.email}</a></li>}
                        {/* Website is already in header, but can be repeated if desired */}
                     </ul>
                     {(!company.phone && !company.email) && <p className="text-gray-500 italic">Nenhuma informação de contato primário disponível.</p>}
                  </section>
                </div>
              )}
              {activeTab === 'depoimentos' && (
                <div id="depoimentosContent" className="animate-fadeIn">
                  {/* Entire Reviews Section JSX (average + list) */}
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Avaliações de Clientes</h3>
                  {company.reviews && company.reviews.length > 0 ? (
                    <>
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-gray-200">
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

                  {/* Review Submission Form - Conditionally Rendered */}
                  {!authLoading && user && !user.isAnonymous && (
                    <div className="mt-8 border-t pt-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Deixe sua Avaliação</h3>
                      {/* ... Review form JSX (from previous step, ensure it uses reviewFormData, handleReviewInputChange, handleStarRatingChange, handleReviewFormSubmit) ... */}
                       {/* This section would contain the review form fields: StarRatingInput, reviewerName, reviewTitle, comment, and submit button */}
                    </div>
                  )}
                  {!authLoading && (!user || user.isAnonymous) && (
                    <div className="mt-8 border-t pt-8 text-center">
                      <p className="text-gray-600 italic p-4 bg-gray-100 rounded-md">
                        <button onClick={() => onNavigate('login')} className="text-blue-600 hover:underline font-semibold">Faça login</button> para deixar sua avaliação.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'precoGarantia' && (
                <div id="precoGarantiaContent" className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Informações de Preço e Garantia</h3>
                  {company.averagePricePerKwp && (
                    <section>
                      <h4 className="text-lg font-medium text-gray-800">Preço Médio Estimado por kWp:</h4>
                      <p className="text-gray-600">{company.averagePricePerKwp.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </section>
                  )}
                  {company.valueIndicator && (
                     <section>
                      <h4 className="text-lg font-medium text-gray-800">Posicionamento de Valor:</h4>
                      <p className="text-gray-600">{company.valueIndicator}</p>
                    </section>
                  )}
                  {company.warrantyDetails && typeof company.warrantyDetails === 'string' && (
                     <section>
                      <h4 className="text-lg font-medium text-gray-800">Detalhes da Garantia (Texto):</h4>
                      <p className="whitespace-pre-line text-gray-600">{company.warrantyDetails}</p>
                    </section>
                  )}
                  {company.warrantyYears && typeof company.warrantyYears === 'object' &&
                   (company.warrantyYears.painel || company.warrantyYears.inversor || company.warrantyYears.instalacao) && (
                    <section>
                      <h4 className="text-lg font-medium text-gray-800">Garantias Detalhadas (Anos):</h3>
                      {company.warrantyYears.painel && <p className="text-gray-600"><strong>Painel:</strong> {company.warrantyYears.painel} anos</p>}
                      {company.warrantyYears.inversor && <p className="text-gray-600"><strong>Inversor:</strong> {company.warrantyYears.inversor} anos</p>}
                      {company.warrantyYears.instalacao && <p className="text-gray-600"><strong>Instalação:</strong> {company.warrantyYears.instalacao} anos</p>}
                    </section>
                  )}
                   {(!company.averagePricePerKwp && !company.valueIndicator && !company.warrantyDetails && !company.warrantyYears) &&
                     <p className="text-gray-500 italic mt-4">Nenhuma informação de preço ou garantia detalhada.</p>
                   }
                </div>
              )}
              {activeTab === 'servicosMarcas' && (
                <div id="servicosMarcasContent" className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Serviços Oferecidos e Marcas Trabalhadas</h3>
                  <section>
                    <h4 className="text-lg font-medium text-gray-800">Categorias de Serviço:</h4>
                    {company.serviceCategories && company.serviceCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {company.serviceCategories.map((category, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full shadow-sm">{category}</span>
                        ))}
                      </div>
                    ) : <p className="text-gray-600 italic">Nenhuma categoria de serviço informada.</p>}
                  </section>
                  {company.servicesOffered && (
                    <section>
                      <h4 className="text-lg font-medium text-gray-800">Serviços Detalhados:</h4>
                      {Array.isArray(company.servicesOffered) && company.servicesOffered.length > 0 ? (
                        <ul className="list-disc list-inside ml-4 text-gray-600">
                          {company.servicesOffered.map((item, index) => <li key={`service-${index}`}>{item}</li>)}
                        </ul>
                      ) : typeof company.servicesOffered === 'string' && company.servicesOffered.trim() !== '' ? (
                        <p className="whitespace-pre-line text-gray-600">{company.servicesOffered}</p>
                      ) : <p className="italic text-gray-500">Não informado.</p>}
                    </section>
                  )}
                  {company.brandsWorkedWith && (
                    <section>
                      <h4 className="text-lg font-medium text-gray-800">Marcas Trabalhadas:</h4>
                      {Array.isArray(company.brandsWorkedWith) && company.brandsWorkedWith.length > 0 ? (
                        <ul className="list-disc list-inside ml-4 text-gray-600">
                          {company.brandsWorkedWith.map((item, index) => <li key={`brand-${index}`}>{item}</li>)}
                        </ul>
                      ) : typeof company.brandsWorkedWith === 'string' && company.brandsWorkedWith.trim() !== '' ? (
                        <p className="whitespace-pre-line text-gray-600">{company.brandsWorkedWith}</p>
                      ) : <p className="italic text-gray-500">Não informado.</p>}
                    </section>
                  )}
                </div>
              )}
              {activeTab === 'projetos' && (
                <div id="projetosContent" className="animate-fadeIn">
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">Projetos Realizados</h3>
                  <p className="text-gray-600 italic">Galeria de projetos e estudos de caso será exibida aqui em breve.</p>
                  {/* Placeholder for project images/details */}
                </div>
              )}
              {activeTab === 'contato' && (
                <div id="contatoContent" className="animate-fadeIn">
                  {/* Contact/Quote Form JSX */}
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
                    Solicite um Orçamento Personalizado para {company.companyName}
                  </h2>
                  {formSubmitStatus && (
                    <div className={`p-4 mb-4 rounded-md text-center ${formSubmitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {formSubmitStatus.message}
                    </div>
                  )}
                  {(!formSubmitStatus || formSubmitStatus.type === 'error') && company && (
                    <form onSubmit={handleContactFormSubmit} className="space-y-6">
                      {/* Form fields as previously defined */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                          <input type="text" name="name" id="contact_name" value={contactFormData.name} onChange={handleContactInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                          <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                          <input type="email" name="email" id="contact_email" value={contactFormData.email} onChange={handleContactInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                          <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                          <input type="tel" name="phone" id="contact_phone" value={contactFormData.phone} onChange={handleContactInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                          <label htmlFor="contact_propertyType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Imóvel *</label>
                          <select name="propertyType" id="contact_propertyType" value={contactFormData.propertyType} onChange={handleContactInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="Residencial">Residencial</option>
                            <option value="Comercial">Comercial</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Rural">Rural</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="contact_averageBill" className="block text-sm font-medium text-gray-700 mb-1">Média da Conta de Luz Mensal (R$)</label>
                        <input type="number" name="averageBill" id="contact_averageBill" value={contactFormData.averageBill} onChange={handleContactInputChange} placeholder="Ex: 350" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                      </div>
                      <div>
                        <label htmlFor="contact_message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem Adicional</label>
                        <textarea name="message" id="contact_message" value={contactFormData.message} onChange={handleContactInputChange} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Descreva suas necessidades ou dúvidas..."></textarea>
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-6 py-3 bg-green-600 text-white font-bold text-lg rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-70"
                        >
                          {isSubmitting ? 'Enviando...' : `Solicitar Orçamento de ${company.companyName}`}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
        </div>
      </main>
    </div>
  );
};
