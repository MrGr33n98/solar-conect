import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
// import { jwtDecode } from 'jwt-decode'; // Can be used for quick client-side checks

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true); // For initial load & login process

  useEffect(() => {
    const loadUserFromToken = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          // Verify token with backend by fetching user details
          const response = await fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Token might be invalid or expired
            localStorage.removeItem('authToken');
            console.error('Failed to verify token or token expired.');
          }
        } catch (error) {
          console.error("Error loading user from token:", error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoadingAuth(false);
    };
    loadUserFromToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed due to server error');
      }

      const data = await response.json(); // Expecting { message: string, token: "Bearer <actual_token>" }

      if (!data.token || !data.token.startsWith('Bearer ')) {
        throw new Error('Invalid token format received from server.');
      }
      const actualToken = data.token.split(' ')[1];

      localStorage.setItem('authToken', actualToken);
      setToken(actualToken);

      // Fetch user details with the new token
      const userResponse = await fetch('/api/users/me', {
          headers: { 'Authorization': `Bearer ${actualToken}` }
      });

      if(userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          setIsAuthenticated(true);
          setIsLoadingAuth(false);
          return true; // Indicate success
      } else {
          // This case means login was successful (got token) but fetching user details failed
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          throw new Error('Login succeeded but failed to fetch user details.');
      }
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      throw error; // Re-throw for LoginPage to handle and display
    }
  };

  const logOut = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Here you might want to redirect the user to the login page
    // For example, using window.location.href = '/login'; if not using a router for this.
    // Or, if using React Router, use the navigate function from useNavigate().
    console.log("User logged out.");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      isAuthenticated,
      isLoadingAuth,
      login,
      logOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};