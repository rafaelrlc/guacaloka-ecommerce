import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedCustomer = localStorage.getItem('customer');
    if (token && storedCustomer) {
      try {
        const parsedCustomer = JSON.parse(storedCustomer);
        setIsLoggedIn(true);
        setCustomer(parsedCustomer);
      } catch (error) {
        console.error('Error parsing customer data:', error);
        // If there's an error parsing, clear the invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('customer');
      }
    }
  }, []);

  const login = (token, customerData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('customer', JSON.stringify(customerData));
    setIsLoggedIn(true);
    setCustomer(customerData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    setIsLoggedIn(false);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, customer, login, logout }}>
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