import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';
import type { User, LoginRequest, RegisterRequest } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Don't refresh automatically on mount to avoid unwanted logouts
          // User data will be refreshed when needed (e.g., on protected route access)
        } catch (error) {
          console.error('Error loading user from localStorage:', error);
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }
      setIsLoading(false);
    };

    loadUser();

    // Listen for logout events from API interceptor
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        setUser(userData);
        toast.success('Login exitoso'); // TODO: Add translation
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data);
      if (response.success && response.data) {
        toast.success('Registro exitoso. Por favor inicia sesión.'); // TODO: Add translation
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al registrarse';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    toast.success('Sesión cerrada'); // TODO: Add translation
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
      } else {
        // If response is not successful, keep cached user but log warning
        console.warn('Could not refresh user, using cached data');
      }
    } catch (error) {
      // If refresh fails, don't logout immediately - keep cached user
      // Only logout if explicitly needed (e.g., 401 from ProtectedRoute)
      console.warn('Error refreshing user, using cached data:', error);
      // Don't call logout() here to avoid unwanted logouts
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
