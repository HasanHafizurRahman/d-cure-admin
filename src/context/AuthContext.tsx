import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User, MenuItem } from '../types';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  menus: MenuItem[] | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [menus, setMenus] = useState<MenuItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth state from LocalStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('dcure_admin_token');
    const storedUser = localStorage.getItem('dcure_admin_user');
    const storedMenus = localStorage.getItem('dcure_admin_menus');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
        if (storedMenus) {
          setMenus(JSON.parse(storedMenus));
        }
      } catch (e) {
        console.error('Failed to parse auth data from localStorage', e);
        // Clean up invalid storage
        localStorage.removeItem('dcure_admin_token');
        localStorage.removeItem('dcure_admin_user');
        localStorage.removeItem('dcure_admin_menus');
      }
    }
    setIsLoading(false);
  }, []);

  // Listen to 401 unauthorized event from api service
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      setMenus(null);
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('dcure_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('dcure_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      
      if (response.success && response.access_token) {
        localStorage.setItem('dcure_admin_token', response.access_token);
        localStorage.setItem('dcure_admin_user', JSON.stringify(response.user));
        localStorage.setItem('dcure_admin_menus', JSON.stringify(response.menus));

        setToken(response.access_token);
        setUser(response.user);
        setMenus(response.menus);

        toast.success(response.message || 'Login successful!');
      } else {
        throw new Error(response.message || 'Unknown error occurred during login.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Incorrect email or password.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('dcure_admin_token');
      localStorage.removeItem('dcure_admin_user');
      localStorage.removeItem('dcure_admin_menus');

      setToken(null);
      setUser(null);
      setMenus(null);

      toast.info('Logged out successfully.');
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        menus,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
