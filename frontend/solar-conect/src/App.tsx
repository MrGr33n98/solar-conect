import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { CompanyPage } from './components/CompanyPage';
import { DashboardPage } from './components/DashboardPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'company':
        return <CompanyPage onNavigate={handleNavigation} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigation} />;
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