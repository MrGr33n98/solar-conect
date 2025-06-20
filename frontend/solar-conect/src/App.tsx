import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { CompanyPage } from './components/CompanyPage'; // This might be the old generic one, or the detail page itself. Let's assume it's the old one for now.
import { DashboardPage } from './components/DashboardPage';
import { CompanyComparisonPage } from './components/CompanyComparisonPage';
import { CompanyDetailPage } from './components/CompanyDetailPage'; // Added

// Define a basic Company type here if not imported from a global types file
// This should ideally match the structure of your actual company objects
interface Company {
  id: number;
  name: string;
  // Include other fields that are expected by CompanyComparisonPage and passed from HomePage
  logoUrl?: string;
  description?: string;
  city?: string;
  state?: string;
  // segment?: string[]; // Assuming segment is part of Company type from types.ts eventually
  // servicesProvided?: string[];
  // brandsWorkedWith?: string[];
  // warrantyYears?: { painel?: number; inversor?: number; instalacao?: number };
  // averagePricePerKwp?: number;
  // strongPoints?: string[];
  // rating?: number;
  // numReviews?: number;
  // phone?: string;
  // email?: string;
  // website?: string;
  [key: string]: any; // To allow any other properties
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [comparisonCompanies, setComparisonCompanies] = useState<Company[]>([]);
  const [viewCompanyId, setViewCompanyId] = useState<string | number | null>(null); // Added state

  // Modified handleNavigation
  const handleNavigation = (page: string, data?: any) => {
    setCurrentPage(page);
    if (page === 'compare' && data) {
      setComparisonCompanies(data as Company[]);
    } else if (page === 'companyDetail' && data && data.companyId) {
      setViewCompanyId(data.companyId);
    }
    // Optional: Clear viewCompanyId or comparisonCompanies when navigating away
    // if (page !== 'companyDetail' && viewCompanyId !== null) {
    //   setViewCompanyId(null);
    // }
    // if (page !== 'compare' && comparisonCompanies.length > 0) {
    //   setComparisonCompanies([]);
    // }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleNavigation} />;
      case 'company': // This might be an old route, or could be an alias for companyDetail if only one companyId is passed
        // For now, assuming 'company' might be a generic listing or different page.
        // If 'company' was intended to be the detail page, it should also use viewCompanyId.
        // Let's keep it as is, assuming 'companyDetail' is the explicit new route for details.
        return <CompanyPage onNavigate={handleNavigation} />; // This is the old CompanyPage.tsx (company profile for logged-in user)
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigation} />;
      case 'compare':
        return <CompanyComparisonPage selectedCompaniesData={comparisonCompanies} onNavigate={handleNavigation} />;
      case 'companyDetail': // Added case
        if (viewCompanyId === null) {
          console.warn("Navigated to companyDetail without a companyId.");
          return <HomePage onNavigate={handleNavigation} />; // Fallback to home
        }
        return <CompanyDetailPage companyId={viewCompanyId} onNavigate={handleNavigation} />;
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <AuthProvider>
      <div className="App">
        {renderCurrentPage()}
      </div>
    </AuthProvider>
  );
}

export default App;