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

export const CompanySearch: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    name: '',
    city: '',
    state: '',
    categoryId: '',
    page: 1
  });
  const [companies, setCompanies] = useState<Company[]>([]);
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
        setError(err.message);
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

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">Find Solar Companies</h3>
      <div className="mb-8 p-4 md:p-6 bg-gray-100 rounded-lg shadow-md flex flex-col sm:flex-row sm:flex-wrap items-center gap-4">
        <input
          type="text" name="name" placeholder="Company Name"
          value={searchParams.name} onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm flex-grow w-full sm:w-auto"
        />
        <input
          type="text" name="city" placeholder="City"
          value={searchParams.city} onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm flex-grow w-full sm:w-auto"
        />
        <input
          type="text" name="state" placeholder="State (e.g., SP)"
          value={searchParams.state} onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm flex-grow w-full sm:w-auto"
        />
        <select
          name="categoryId" value={searchParams.categoryId} onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm flex-grow w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-center text-gray-500 py-8">Loading results...</p>}
      {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">Error: {error}</p>}

      {!isLoading && !error && companies.length === 0 && <p className="text-center text-gray-500 py-8">No companies found matching your criteria.</p>}
      {!isLoading && !error && companies.length > 0 && <p className="text-sm text-gray-600 mb-4">{totalCompanies} companies found.</p>}

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
                  Categories: {company.categories.map(c => c.name).join(', ')}
                </p>
              )}
              {/* Example: <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">View Details</button> */}
            </div>
          </div>
        ))}
      </div>

      {!isLoading && totalPages > 0 && (
         <div className="mt-8 py-4 flex justify-center items-center gap-2">
            <button
                onClick={() => handlePageChange(searchParams.page - 1)}
                disabled={searchParams.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            <span className="text-sm text-gray-700">Page {searchParams.page} of {totalPages}</span>
            <button
                onClick={() => handlePageChange(searchParams.page + 1)}
                disabled={searchParams.page >= totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
         </div>
      )}
    </div>
  );
};
