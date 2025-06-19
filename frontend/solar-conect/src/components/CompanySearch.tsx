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

  const inputStyle: React.CSSProperties = { padding: '8px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' };
  const companyCardStyle: React.CSSProperties = {
    border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center'
  };
  const logoStyle: React.CSSProperties = {width: '60px', height: '60px', marginRight: '15px', objectFit: 'contain', border: '1px solid #f0f0f0'};

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: 'auto' }}>
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Find Solar Companies</h3>
      <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
        <input style={inputStyle} type="text" name="name" placeholder="Company Name" value={searchParams.name} onChange={handleInputChange} />
        <input style={inputStyle} type="text" name="city" placeholder="City" value={searchParams.city} onChange={handleInputChange} />
        <input style={inputStyle} type="text" name="state" placeholder="State (e.g., SP)" value={searchParams.state} onChange={handleInputChange} />
        <select style={inputStyle} name="categoryId" value={searchParams.categoryId} onChange={handleInputChange}>
          <option value="">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {/* No explicit search button, useEffect triggers on param change */}
      </div>

      {isLoading && <p>Loading results...</p>}
      {error && <p style={{ color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px' }}>Error: {error}</p>}

      {!isLoading && !error && companies.length === 0 && <p>No companies found matching your criteria.</p>}
      {!isLoading && !error && companies.length > 0 && <p>{totalCompanies} companies found.</p>}


      <div style={{ marginTop: '20px' }}>
        {companies.map(company => (
          <div key={company.id} style={companyCardStyle}>
            {company.logoUrl ?
              <img src={company.logoUrl} alt={`${company.name} logo`} style={logoStyle} /> :
              <div style={{...logoStyle, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Logo</div>
            }
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>{company.name}</h4>
              <p style={{ margin: '0 0 5px 0', color: '#555' }}>{company.city}, {company.state}</p>
              {company.categories && company.categories.length > 0 && (
                <p style={{fontSize: '0.9em', color: '#777', margin: '0'}}>
                  Categories: {company.categories.map(c => c.name).join(', ')}
                </p>
              )}
              {/* Example: <button onClick={() => alert(`View company ${company.id}`)} style={{marginTop: '8px'}}>View Details</button> */}
            </div>
          </div>
        ))}
      </div>

      {!isLoading && totalPages > 0 && (
         <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button
                onClick={() => handlePageChange(searchParams.page - 1)}
                disabled={searchParams.page <= 1}
                style={{padding: '8px 12px', margin: '0 5px'}}
            >
                Previous
            </button>
            <span>Page {searchParams.page} of {totalPages}</span>
            <button
                onClick={() => handlePageChange(searchParams.page + 1)}
                disabled={searchParams.page >= totalPages}
                style={{padding: '8px 12px', margin: '0 5px'}}
            >
                Next
            </button>
         </div>
      )}
    </div>
  );
};
