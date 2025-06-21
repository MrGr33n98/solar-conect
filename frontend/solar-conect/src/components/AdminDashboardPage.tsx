import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext'; // Using actual AuthContext
import { getFirestore, collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore'; // Firebase imports
// import { Company } from '../types'; // Assuming a global Company type, or define one locally

// Temporary local Company type for this component's initial structure
// This should align with your actual Company type, especially adminFeatures
interface AdminCompanyView { // Simplified for this admin view initially
  id: string;
  companyName: string; // Using companyName to match fictional data
  adminFeatures?: {
    canEditBanner?: boolean;
    canAccessLeads?: boolean;
    canViewDetailedAnalytics?: boolean;
    // Add other feature flags as needed
  };
  // Add other fields an admin might want to see at a glance, like ownerId or email
  ownerId?: string;
  email?: string; // Company contact email
}

interface AdminDashboardPageProps {
  onNavigate: (page: string, data?: any) => void;
  // Conceptual: In a real app, useAuth would provide user and dbInstance
  // For this subtask, we'll mock them or assume they come from a yet-to-be-integrated useAuth
}

// Removed local mock useAuth function. Will use the imported one.

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, loading: authLoading, dbInstance, appId } = useAuth(); // Now using the real useAuth

  const [companies, setCompanies] = useState<AdminCompanyView[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoadingCompanies(true);
    setError(null);

    if (!authLoading) {
      if (user && user.isAdmin) {
        if (dbInstance && appId) { // Ensure dbInstance and appId are available
          const companiesCollectionRef = collection(dbInstance, 'artifacts', appId, 'companies');
          const q = query(companiesCollectionRef);

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedCompanies: AdminCompanyView[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              fetchedCompanies.push({
                id: doc.id,
                companyName: data.companyName || data.name || 'Nome Indisponível', // Match fictional or backend model
                adminFeatures: data.adminFeatures || { canEditBanner: false, canAccessLeads: false, canViewDetailedAnalytics: false },
                ownerId: data.ownerId || data.userId || '', // Match fictional or backend model
                email: data.email || data.contactEmail || '' // Match fictional or backend model
              });
            });
            setCompanies(fetchedCompanies);
            setError(null);
            setIsLoadingCompanies(false);
          }, (err) => {
            console.error("Error fetching companies for admin:", err);
            setError("Falha ao carregar dados das empresas. Por favor, tente novamente mais tarde.");
            setCompanies([]);
            setIsLoadingCompanies(false);
          });

          return () => unsubscribe();
        } else {
          console.error("AdminDashboard: dbInstance or appId not available from useAuth.");
          setError("Configuração de banco de dados ausente. Não foi possível carregar empresas.");
          setIsLoadingCompanies(false);
          setCompanies([]);
        }
      } else {
        setError("Acesso negado. Esta página é apenas para administradores.");
        setCompanies([]);
        setIsLoadingCompanies(false);
      }
    }
    // Not including onNavigate in dependencies as it's a function reference likely stable from App.tsx
    // and not directly involved in the data fetching logic itself.
  }, [user, authLoading, dbInstance, appId]);


  const handleFeatureToggle = async (companyId: string, featureName: string, currentValue: boolean) => {
    if (!dbInstance || !appId) {
      console.error("Firestore instance (dbInstance) or appId is not available. Cannot update feature.");
      setError("Erro de configuração. Não é possível atualizar as funcionalidades.");
      return;
    }

    const newValue = !currentValue;
    // Optimistic UI update
    setCompanies(prevCompanies => prevCompanies.map(c => {
      if (c.id === companyId) {
        return {
          ...c,
          adminFeatures: {
            ...(c.adminFeatures || {}), // Ensure adminFeatures exists
            [featureName]: newValue
          }
        };
      }
      return c;
    }));

    try {
      const companyRef = doc(dbInstance, 'artifacts', appId, 'companies', companyId);
      const featurePath = `adminFeatures.${featureName}`;

      await updateDoc(companyRef, {
        [featurePath]: newValue
      });
      console.log(`Successfully updated '${featurePath}' for company ${companyId} to ${newValue}`);
      // onSnapshot will handle reflecting the true state from Firestore if different from optimistic
    } catch (err) {
      console.error(`Error updating feature '${featureName}' for company ${companyId}:`, err);
      setError(`Falha ao atualizar a funcionalidade '${featureName}'. Por favor, tente novamente.`);
      // Revert optimistic update if Firestore update fails
      setCompanies(prevCompanies => prevCompanies.map(c => {
        if (c.id === companyId) {
          return {
            ...c,
            adminFeatures: {
              ...(c.adminFeatures || {}),
              [featureName]: currentValue // Revert to original value
            }
          };
        }
        return c;
      }));
    }
  };

  if (authLoading || isLoadingCompanies) {
    return <div className="p-8 text-center text-gray-600">Carregando dashboard do administrador...</div>;
  }

  if (error) { // This will catch the "Acesso negado" error set in useEffect
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center min-h-screen flex flex-col justify-center items-center">
        <Helmet><title>Acesso Negado | Admin SolarConnect</title></Helmet>
        <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Acesso Negado</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
            onClick={() => onNavigate('home')}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
            Ir para a Página Inicial
            </button>
        </div>
      </div>
    );
  }

  // Main Admin Dashboard UI
  return (
    <div className="font-sans bg-gray-50 min-h-screen p-4 md:p-8"> {/* Assuming font-sans from Tailwind config */}
      <Helmet>
        <title>Admin Dashboard | SolarConnect</title>
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Painel do Administrador</h1>
        <p className="text-gray-600 mt-1">Gerenciar empresas e funcionalidades da plataforma.</p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Gerenciamento de Funcionalidades das Empresas</h2>
        {companies.length === 0 && !isLoadingCompanies && !error && ( // Refined condition
            <p className="text-gray-500">Nenhuma empresa encontrada.</p>
        )}
        {/* Error message is already handled by a top-level conditional rendering for the whole page if error exists */}

        {companies.length > 0 && (
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editar Banner</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acesso a Leads</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analytics Detalhados</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {companies.map(company => (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{company.companyName}</div>
                        <div className="text-xs text-gray-500">{company.email || `ID: ${company.id}`}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <input
                            type="checkbox"
                            checked={!!company.adminFeatures?.canEditBanner}
                            onChange={() => handleFeatureToggle(company.id, 'canEditBanner', !!company.adminFeatures?.canEditBanner)}
                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-offset-0 focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <input
                            type="checkbox"
                            checked={!!company.adminFeatures?.canAccessLeads}
                            onChange={() => handleFeatureToggle(company.id, 'canAccessLeads', !!company.adminFeatures?.canAccessLeads)}
                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-offset-0 focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <input
                            type="checkbox"
                            checked={!!company.adminFeatures?.canViewDetailedAnalytics}
                            onChange={() => handleFeatureToggle(company.id, 'canViewDetailedAnalytics', !!company.adminFeatures?.canViewDetailedAnalytics)}
                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-offset-0 focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        />
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};

// export default AdminDashboardPage; // If it's the default export for a routing system
// For now, named export is fine as it's part of a larger App.tsx structure.
