import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshToken } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          // Valider le token
          setToken(storedToken);
          
          // Parser et valider l'utilisateur
          let userData;
          try {
            userData = JSON.parse(storedUser);
            if (!userData || typeof userData !== 'object') {
              throw new Error('Invalid user data');
            }
            setUser(userData);
          } catch (jsonError) {
            console.error('Invalid user data in localStorage, clearing...');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.clear();
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, authToken, refreshTokenValue) => {
    // Valider les données
    if (!userData || typeof userData !== 'object') {
      userData = {};
    }
    if (!authToken) {
      throw new Error('Token is required');
    }
    
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    if (refreshTokenValue) {
      localStorage.setItem('refreshToken', refreshTokenValue);
    }
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateToken = (newToken) => {
    if (!newToken) {
      logout();
      return;
    }
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateToken,
    isAuthenticated: !!token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
