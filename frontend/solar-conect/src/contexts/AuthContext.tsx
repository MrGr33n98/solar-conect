import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Simula o carregamento inicial do usuário
    const savedUser = localStorage.getItem('solarconnect_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserId(userData.uid);
    } else {
      // Cria um usuário anônimo
      const anonymousUser: User = {
        uid: `anon_${Date.now()}`,
        email: '',
        displayName: '',
        isAnonymous: true
      };
      setUser(anonymousUser);
      setUserId(anonymousUser.uid);
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    const googleUser: User = {
      uid: `google_${Date.now()}`,
      email: 'demo@solarconnect.com',
      displayName: 'Demo User',
      photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      isAnonymous: false
    };
    
    setUser(googleUser);
    setUserId(googleUser.uid);
    localStorage.setItem('solarconnect_user', JSON.stringify(googleUser));
  };

  const signInWithLinkedIn = async () => {
    const linkedinUser: User = {
      uid: `linkedin_${Date.now()}`,
      email: 'linkedin@solarconnect.com',
      displayName: 'LinkedIn User',
      photoURL: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      isAnonymous: false
    };
    
    setUser(linkedinUser);
    setUserId(linkedinUser.uid);
    localStorage.setItem('solarconnect_user', JSON.stringify(linkedinUser));
  };

  const logOut = async () => {
    localStorage.removeItem('solarconnect_user');
    localStorage.removeItem('solarconnect_company');
    
    const anonymousUser: User = {
      uid: `anon_${Date.now()}`,
      email: '',
      displayName: '',
      isAnonymous: true
    };
    
    setUser(anonymousUser);
    setUserId(anonymousUser.uid);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userId, 
      loading, 
      signInWithGoogle, 
      signInWithLinkedIn, 
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