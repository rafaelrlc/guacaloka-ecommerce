import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    
    if (token) {
      try {
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('token', error);
      }
    } else {
      console.log('No token or customer found in localStorage');
    }
  }, []);

  const login = (token) => {
    console.log('Login function called with token:', token);
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log('Logout function called');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 