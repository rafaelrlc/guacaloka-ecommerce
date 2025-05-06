import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    address: { street: '', city: '', state: '', zip: '' }
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      console.log("login realizado", data);
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('customer', JSON.stringify(data.customer));
        login(data.token, data.customer);
        toast.success('Login realizado com sucesso!');
        setTimeout(() => {
          navigate('/');
        }, 100);
      } else {
        console.log("erro ao fazer login", data);
        toast.error(data.message || 'Erro ao fazer login');
      }
    } catch (err) {
      console.log("erro ao fazer login", err);
      toast.error('Credenciais inválidas');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("registerData", registerData);  
    try {
      const res = await fetch('http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      console.log("res", res);
      if (res.ok) {
        toast.success('Cadastro realizado com sucesso! Faça login.');
        setIsRegister(false);
      } else {
        console.log("erro ao cadastrar aqui", data);
        toast.error(data.message || 'Erro ao cadastrar');
      }
    } catch (err) {
      console.log("erro ao cadastrar", err);
      toast.error('Credenciais inválidas');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-lg ${!isRegister ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg ${isRegister ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setIsRegister(true)}
          >
            Cadastro
          </button>
        </div>
        {!isRegister ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-3 py-2"
              value={loginData.email}
              onChange={e => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="border rounded px-3 py-2"
              value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome"
              className="border rounded px-3 py-2"
              value={registerData.name}
              onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-3 py-2"
              value={registerData.email}
              onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="border rounded px-3 py-2"
              value={registerData.password}
              onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Rua"
              className="border rounded px-3 py-2"
              value={registerData.address.street}
              onChange={e => setRegisterData({ ...registerData, address: { ...registerData.address, street: e.target.value } })}
              required
            />
            <input
              type="text"
              placeholder="Cidade"
              className="border rounded px-3 py-2"
              value={registerData.address.city}
              onChange={e => setRegisterData({ ...registerData, address: { ...registerData.address, city: e.target.value } })}
              required
            />
            <input
              type="text"
              placeholder="Estado"
              className="border rounded px-3 py-2"
              value={registerData.address.state}
              onChange={e => setRegisterData({ ...registerData, address: { ...registerData.address, state: e.target.value } })}
              required
            />
            <input
              type="text"
              placeholder="CEP"
              className="border rounded px-3 py-2"
              value={registerData.address.zip}
              onChange={e => setRegisterData({ ...registerData, address: { ...registerData.address, zip: e.target.value } })}
              required
            />
            <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
              Cadastrar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
