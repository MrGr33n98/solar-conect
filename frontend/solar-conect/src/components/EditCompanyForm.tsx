import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext'; // To get the token

interface CompanyData { // Simplified for this example
  id: number;
  name: string;
  description?: string;
  contactEmail?: string;
  website?: string;
  city?: string;
  state?: string;
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  logoUrl?: string;
  bannerUrl?: string;
  valueIndicator?: string;
  strengths?: string;
  warrantyDetails?: string;
  servicesOffered?: string;
  brandsWorkedWith?: string;
  categories?: { id: number; name: string }[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface EditCompanyFormProps {
  companyId: number;
  onUpdateSuccess: (updatedCompany: CompanyData) => void; // Callback on successful update
  onCancel: () => void; // Callback to cancel editing
}

export const EditCompanyForm: React.FC<EditCompanyFormProps> = ({ companyId, onUpdateSuccess, onCancel }) => {
  const { token } = useAuth();
  const [company, setCompany] = useState<Partial<CompanyData>>({});
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing company data and all categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        // Fetch company details
        const companyRes = await fetch(`/api/companies/${companyId}`);
        if (!companyRes.ok) {
          const errData = await companyRes.json();
          throw new Error(errData.message || 'Failed to fetch company details');
        }
        const companyData: CompanyData = await companyRes.json();
        setCompany(companyData);
        setSelectedCategoryIds(companyData.categories?.map(cat => cat.id) || []);

        // Fetch all categories for selection
        const categoriesRes = await fetch('/api/categories');
        if (!categoriesRes.ok) {
            const errData = await categoriesRes.json();
            throw new Error(errData.message || 'Failed to fetch categories');
        }
        setAllCategories(await categoriesRes.json());

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (companyId) {
      fetchData();
    }
  }, [companyId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const value: number[] = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }
    setSelectedCategoryIds(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'logo' | 'banner') => {
     if (e.target.files && e.target.files[0]) {
         if (fileType === 'logo') setLogoFile(e.target.files[0]);
         else setBannerFile(e.target.files[0]);
     }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // 1. Update textual data
      const companyUpdatePayload = { ...company, categoryIds: selectedCategoryIds };
      // Remove fields that are not directly part of the main model or are handled by specific endpoints
      delete companyUpdatePayload.id;
      delete companyUpdatePayload.logoUrl;  // Will be updated by specific endpoint if file is chosen
      delete companyUpdatePayload.bannerUrl; // Will be updated by specific endpoint if file is chosen
      delete companyUpdatePayload.categories; // Send categoryIds instead

      const textUpdateRes = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(companyUpdatePayload)
      });
      if (!textUpdateRes.ok) {
        const errData = await textUpdateRes.json();
        throw new Error(errData.message || 'Failed to update company details');
      }
      let updatedCompanyData: CompanyData = await textUpdateRes.json();

      // 2. Upload Logo if selected
      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append('logo', logoFile);
        const logoUploadRes = await fetch(`/api/companies/${companyId}/logo`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }, // Multer handles Content-Type for FormData
          body: logoFormData
        });
        if (!logoUploadRes.ok) {
            const errData = await logoUploadRes.json();
            throw new Error(errData.message || 'Failed to upload logo');
        }
        updatedCompanyData = (await logoUploadRes.json()).company; // Backend returns { message, company }
      }

      // 3. Upload Banner if selected
      if (bannerFile) {
        const bannerFormData = new FormData();
        bannerFormData.append('banner', bannerFile);
        const bannerUploadRes = await fetch(`/api/companies/${companyId}/banner`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: bannerFormData
        });
        if (!bannerUploadRes.ok) {
            const errData = await bannerUploadRes.json();
            throw new Error(errData.message || 'Failed to upload banner');
        }
        updatedCompanyData = (await bannerUploadRes.json()).company;
      }

      onUpdateSuccess(updatedCompanyData);
      setLogoFile(null); // Reset file inputs
      setBannerFile(null);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !company?.name) return <p>Loading company data...</p>; // Check company.name to show loader on initial load
  if (error && !company?.name) return <p style={{color: 'red'}}>Error loading initial data: {error}</p>; // Show only critical load error
  if (!company?.id && !isLoading) return <p>Company not found or unable to load (ID: {companyId}).</p>;

  // Define all fields for the form for clarity, matching CompanyData
  const formFields: (keyof Omit<CompanyData, 'id' | 'categories' | 'logoUrl' | 'bannerUrl'>)[] = [
    'name', 'description', 'contactEmail', 'website', 'city', 'state',
    'addressLine1', 'addressLine2', 'postalCode',
    'valueIndicator', 'strengths', 'warrantyDetails',
    'servicesOffered', 'brandsWorkedWith'
  ];

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '700px', margin: 'auto' }}>
      <h3 style={{textAlign: 'center', marginBottom: '20px'}}>Edit Company: {company?.name || 'Loading...'}</h3>

      {formFields.map(fieldName => (
        <div key={fieldName} style={{ marginBottom: '12px' }}>
          <label htmlFor={fieldName} style={{ display: 'block', marginBottom: '4px', textTransform: 'capitalize' }}>
            {fieldName.replace(/([A-Z])/g, ' $1')}:
          </label>
          {fieldName === 'description' || fieldName === 'strengths' || fieldName === 'warrantyDetails' || fieldName === 'servicesOffered' || fieldName === 'brandsWorkedWith' ? (
            <textarea
              id={fieldName}
              name={fieldName}
              value={company?.[fieldName] || ''}
              onChange={handleInputChange}
              style={{ width: 'calc(100% - 20px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
            />
          ) : (
            <input
              type={fieldName === 'contactEmail' ? 'email' : fieldName === 'website' ? 'url' : 'text'}
              id={fieldName}
              name={fieldName}
              value={company?.[fieldName] || ''}
              onChange={handleInputChange}
              style={{ width: 'calc(100% - 20px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          )}
        </div>
      ))}

      <div style={{ marginBottom: '15px' }}>
         <label htmlFor="categories" style={{ display: 'block', marginBottom: '5px' }}>Categories: </label>
         <select
            id="categories"
            multiple
            name="categories"
            value={selectedCategoryIds.map(String)}
            onChange={handleCategoryChange}
            style={{ width: '100%', minHeight: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
             {allCategories.map(cat => (
                 <option key={cat.id} value={cat.id}>{cat.name}</option>
             ))}
         </select>
      </div>

      <hr style={{margin: '20px 0'}} />
      <h4 style={{marginTop: '10px'}}>Uploads</h4>
      <div style={{ marginBottom: '10px' }}>
         <label htmlFor="logo" style={{ display: 'block', marginBottom: '5px' }}>Logo: </label>
         <input type="file" id="logo" name="logo" onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" style={{ display: 'block', marginBottom: '5px' }} />
         {company?.logoUrl && <img src={company.logoUrl} alt="Current company logo" style={{width: '100px', height: 'auto', display:'block', marginTop: '5px', border: '1px solid #ddd', padding: '2px' }}/>}
      </div>
      <div style={{ marginBottom: '20px' }}>
         <label htmlFor="banner" style={{ display: 'block', marginBottom: '5px' }}>Banner: </label>
         <input type="file" id="banner" name="banner" onChange={(e) => handleFileChange(e, 'banner')} accept="image/*" style={{ display: 'block', marginBottom: '5px' }} />
         {company?.bannerUrl && <img src={company.bannerUrl} alt="Current company banner" style={{width: '200px', height: 'auto', display:'block', marginTop: '5px', border: '1px solid #ddd', padding: '2px' }}/>}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }} disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" disabled={isLoading} style={{ padding: '10px 15px', backgroundColor: isLoading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>Submit Error: {error}</p>}
    </form>
  );
};
