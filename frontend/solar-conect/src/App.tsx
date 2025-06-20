import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { CompanyPage } from './components/CompanyPage';
import { DashboardPage } from './components/DashboardPage';
import { CompanyComparisonPage } from './components/CompanyComparisonPage'; // Added

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
  const [comparisonCompanies, setComparisonCompanies] = useState<Company[]>([]); // Added state

  // Modified handleNavigation
  const handleNavigation = (page: string, data?: any) => {
    setCurrentPage(page);
    if (page === 'compare' && data) {
      setComparisonCompanies(data as Company[]);
    }
    // Optional: Clear comparison data when navigating away
    // if (page !== 'compare' && comparisonCompanies.length > 0) {
    //   setComparisonCompanies([]);
    // }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleNavigation} />; // Added onNavigate
      case 'company':
        return <CompanyPage onNavigate={handleNavigation} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigation} />;
      case 'compare': // Added case
        return <CompanyComparisonPage selectedCompaniesData={comparisonCompanies} onNavigate={handleNavigation} />;
      case 'home':
      default:
        // Pass the modified onNavigate to HomePage
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