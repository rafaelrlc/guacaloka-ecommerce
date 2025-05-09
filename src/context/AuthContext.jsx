import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settings, setSettings] = useState([    
    { "id": "mostrar_recomendacoes", "status": false },
    { "id": "mostrar_popup_carrinho", "status": false },
    { "id": "mostrar_descricao_produto", "status": false },
    { "id": "permitir_pagamento_pix", "status": false },
    { "id": "permitir_pagamento_cartao_credito", "status": false },
    { "id": "permitir_pagamento_boleto", "status": false }
  ])

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/configurations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar configurações');
      }
      const data = await response.json();
      console.log('Configurações recebidas do servidor:', data);
      setSettings(data);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    }
  };

  const saveSettings = async (updatedSettings) => {
    console.log('Salvando configurações no servidor:', updatedSettings);
    try {
      const response = await fetch('http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/configurations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedSettings),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar configurações');
      }
      console.log('Configurações salvas com sucesso no servidor');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw error; // Lança o erro para evitar salvar no localStorage
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

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
    <AuthContext.Provider value={{ isLoggedIn, login, logout, settings, setSettings, saveSettings}}>
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