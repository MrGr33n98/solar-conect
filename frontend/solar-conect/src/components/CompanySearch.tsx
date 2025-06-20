import React, { useState, useEffect, ChangeEvent } from 'react';

interface Company {
  id: number;
  name: string;
  description?: string;
  city?: string;
  state?: string;
  logoUrl?: string;
  categories?: { id: number; name: string }[];
  // Add other relevant fields for display
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SearchParams {
  name: string;
  city: string;
  state: string;
  categoryId: string; // Store category ID as string for select compatibility
  page: number;
}

interface CompanySearchProps {
  onNavigate: (page: string, data?: any) => void;
}

export const CompanySearch: React.FC<CompanySearchProps> = ({ onNavigate }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    name: '',
    city: '',
    state: '',
    categoryId: '',
    page: 1
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesToCompare, setCompaniesToCompare] = useState<Company[]>([]); // Added state
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);

  // Fetch all categories for the filter dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('/api/categories'); // Assuming this endpoint exists and is public
        if (!response.ok) {
            console.error('Failed to fetch categories for filter');
            // Optionally set an error state specific to categories loading
            return;
        }
        setAllCategories(await response.json());
      } catch (err) {
        console.error("Error fetching categories for filter:", err);
      }
    };
    fetchCats();
  }, []);

  // Fetch companies based on searchParams
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);
      const query = new URLSearchParams();
      if (searchParams.name) query.append('name', searchParams.name);
      if (searchParams.city) query.append('city', searchParams.city);
      if (searchParams.state) query.append('state', searchParams.state);
      if (searchParams.categoryId) query.append('categoryId', searchParams.categoryId);
      query.append('page', searchParams.page.toString());
      query.append('limit', '10'); // Example: 10 results per page

      try {
        const response = await fetch(`/api/companies?${query.toString()}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to fetch companies');
        }
        const data = await response.json(); // Expects { companies: [], totalPages: X, totalCompanies: Y, currentPage: Z }
        setCompanies(data.companies || []);
        setTotalPages(data.totalPages || 0);
        setTotalCompanies(data.totalCompanies || 0);
        // currentPage is also available in data.currentPage if needed
      } catch (err: any) {
        console.error("API Error fetching companies:", err); // Keep console log for debugging
        // Check if the error message is one we threw deliberately from a non-ok response
        if (err.message && (err.message.includes('Failed to fetch companies') || response?.statusText)) {
             setError(err.message); // Use the specific message from backend if available and somewhat user-friendly
        } else if (err.name === 'AbortError') {
            console.log('Fetch aborted'); // Or handle as a non-error if intentional
        }
        else {
            // Generic fallback for network errors, etc.
            setError("Ocorreu um erro ao buscar empresas. Por favor, tente novamente mais tarde.");
        }
        setCompanies([]); // Clear companies on error
        setTotalPages(0);
        setTotalCompanies(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [searchParams]); // Re-fetch when searchParams change

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value, page: 1 })); // Reset to page 1 on new filter
  };

  const handlePageChange = (newPage: number) => {
     if (newPage >= 1 && newPage <= totalPages) {
        setSearchParams(prev => ({ ...prev, page: newPage }));
     }
  };

  const handleToggleCompare = (company: Company) => {
    setCompaniesToCompare(prev => {
      const isAlreadySelected = prev.find(c => c.id === company.id);
      if (isAlreadySelected) {
        return prev.filter(c => c.id !== company.id); // Remove
      } else {
        if (prev.length < 3) { // Limit to 3 companies
          return [...prev, company]; // Add
        }
        alert("Você pode comparar no máximo 3 empresas por vez.");
        return prev;
      }
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-28"> {/* Added pb-28 for footer space */}
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">Encontre Empresas de Energia Solar</h3>
      <div className="mb-8 p-4 md:p-6 bg-gray-100 rounded-lg shadow-md flex flex-col sm:flex-row sm:flex-wrap items-center gap-4">
        <input
          type="text" name="name" placeholder="Nome da Empresa (Opcional)"
          value={searchParams.name} onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm flex-grow w-full sm:w-auto"
        />
        <input
          type="text" name="city" placeholder="Cidade"
          value={searchParams.city} onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm flex-grow w-full sm:w-auto"
        />
        <input
          type="text" name="state" placeholder="Estado (Ex: SP)"
          value={searchParams.state} onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm flex-grow w-full sm:w-auto"
        />
        <select
          name="categoryId" value={searchParams.categoryId} onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm flex-grow w-full sm:w-auto"
        >
          <option value="">Todas as Categorias</option>
          {allCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            // Optional: Force re-fetch if needed by creating new object for searchParams
            // setSearchParams(prev => ({...prev}));
          }}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm w-full sm:w-auto"
        >
          Buscar Empresas
        </button>
      </div>

      {isLoading && <p className="text-center text-gray-500 py-8">Carregando resultados...</p>}
      {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">Erro: {error}</p>}

      {!isLoading && !error && companies.length === 0 && <p className="text-center text-gray-500 py-8">Nenhuma empresa encontrada com os critérios informados.</p>}
      {!isLoading && !error && companies.length > 0 && <p className="text-sm text-gray-600 mb-4">{totalCompanies} empresa(s) encontrada(s).</p>}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map(company => (
          <div key={company.id} className="bg-white p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-start gap-4">
            {company.logoUrl ?
              <img src={company.logoUrl} alt={`${company.name} logo`} className="w-16 h-16 md:w-24 md:h-24 object-contain border border-gray-200 rounded-md flex-shrink-0" /> :
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-200 text-gray-400 flex items-center justify-center rounded-md flex-shrink-0 text-xs">No Logo</div>
            }
            <div className="flex-grow">
              <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">{company.name}</h4>
              <p className="text-sm text-gray-600 mb-1">{company.city}, {company.state}</p>
              {company.categories && company.categories.length > 0 && (
                <p className="text-xs text-gray-500">
                  Categorias: {company.categories.map(c => c.name).join(', ')}
                </p>
              )}
              <button
                onClick={() => handleToggleCompare(company)}
                className={`mt-2 px-3 py-1 text-sm rounded-md w-full text-center ${
                  companiesToCompare.find(c => c.id === company.id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {companiesToCompare.find(c => c.id === company.id) ? 'Remover da Comparação' : 'Adicionar à Comparação'}
              </button>
              <button
                onClick={() => onNavigate('companyDetail', { companyId: company.id })}
                className="mt-2 px-3 py-1 text-sm rounded-md w-full text-center bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Ver Perfil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 0 && (
         <div className="mt-8 py-4 flex justify-center items-center gap-2">
            <button
                onClick={() => handlePageChange(searchParams.page - 1)}
                disabled={searchParams.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Anterior
            </button>
            <span className="text-sm text-gray-700">Página {searchParams.page} de {totalPages}</span>
            <button
                onClick={() => handlePageChange(searchParams.page + 1)}
                disabled={searchParams.page >= totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Próxima
            </button>
         </div>
      )}

      {/* Comparison Sticky Footer/Bar */}
      {companiesToCompare.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 md:p-4 shadow-lg flex flex-col sm:flex-row justify-between items-center z-50">
          <div className="mb-2 sm:mb-0">
            <span className="font-semibold text-sm sm:text-base">Empresas para Comparar:</span>
            <ul className="inline-flex list-none pl-2 flex-wrap">
              {companiesToCompare.map(c => (
                <li key={c.id} className="mr-2 mt-1 sm:mt-0 px-2 py-1 bg-gray-700 rounded text-xs">{c.name}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => {
              if (companiesToCompare.length >= 2) {
                onNavigate('compare', companiesToCompare);
              } else {
                alert("Selecione pelo menos 2 empresas para comparar.");
              }
            }}
            disabled={companiesToCompare.length < 2}
            className="px-4 py-2 md:px-6 md:py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:opacity-50 w-full sm:w-auto"
          >
            Comparar ({companiesToCompare.length})
          </button>
        </div>
      )}
    </div>
  );
};
