import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for unauthorized events from axios interceptor
    const handleUnauthorized = () => {
      logout();
      toast.error('Session expired. Please log in again.');
    };
    
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      
      const userData = { email: data.email, fullName: data.fullName, role: data.role };
      
      setToken(data.token);
      setUser(userData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success(`Welcome back, ${data.fullName}!`);
      navigate('/dashboard');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
      throw error;
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const data = await authService.register(fullName, email, password);
      
      const userData = { email: data.email, fullName: data.fullName, role: data.role };
      
      setToken(data.token);
      setUser(userData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Registration successful!');
      navigate('/dashboard');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
