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
        login(data.token);
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
      // const data = await res.json();
      console.log("res", res);
      if (res.ok) {
        toast.success('Cadastro realizado com sucesso! Faça login.');
        setIsRegister(false);
      } else {
        toast.error('E-mail já cadastrado, tente outro.');
        console.log("erro ao cadastrar aqui", res);
      }
    } catch (err) {
      console.log("erro ao cadastrar", err);
    }
  };

  return (
    <div className="h-[calc(100vh-88px)] flex items-center justify-center bg-transparent">
      <div className="w-full max-w-md bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100 rounded-2xl shadow-2xl p-6 border-4 border-yellow-400 flex flex-col items-center">
        <div className="flex justify-center mb-6 w-full">
          <button
            className={`w-1/2 px-3 py-2 rounded-l-lg font-bold border-2 border-yellow-400 text-base ${!isRegister ? 'bg-green-600 text-white' : 'bg-yellow-200 text-yellow-900'}`}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
          <button
            className={`w-1/2 px-3 py-2 rounded-r-lg font-bold border-2 border-yellow-400 text-base ${isRegister ? 'bg-green-600 text-white' : 'bg-yellow-200 text-yellow-900'}`}
            onClick={() => setIsRegister(true)}
          >
            Cadastro
          </button>
        </div>
        {!isRegister ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
            <input
              type="email"
              placeholder="Email"
              className="border-2 border-yellow-400 rounded px-3 py-2 text-base"
              value={loginData.email}
              onChange={e => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="border-2 border-yellow-400 rounded px-3 py-2 text-base"
              value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors font-bold border-2 border-yellow-400 shadow text-base">
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-3 w-full">
            <input
              type="text"
              placeholder="Nome"
              className="border-2 border-yellow-400 rounded px-3 py-2 text-base"
              value={registerData.name}
              onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border-2 border-yellow-400 rounded px-3 py-2 text-base"
              value={registerData.email}
              onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="border-2 border-yellow-400 rounded px-3 py-2 text-base"
              value={registerData.password}
              onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Rua"
                className="border-2 border-yellow-400 rounded px-3 py-2 text-base w-2/3"
                value={registerData.address.street}
                onChange={e => setRegisterData({ ...registerData, address: { ...registerData.address, street: e.target.value } })}
                required
              />
              <input
                type="text"
                placeholder="CEP"
                className="border-2 border-yellow-400 rounded px-3 py-2 text-base w-1/3"
                value={registerData.address.zip}
                onChange={e => setRegisterData({ ...registerData, address: { ...registerData.address, zip: e.target.value } })}
                required
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cidade"
                className="border-2 border-yellow-400 rounded px-3 py-2 text-base w-2/3"
                value={registerData.address.city}
                onChange={e => setRegisterData({ ...registerData, address: { ...registerData.address, city: e.target.value } })}
                required
              />
              <input
                type="text"
                placeholder="Estado"
                className="border-2 border-yellow-400 rounded px-3 py-2 text-base w-1/3"
                value={registerData.address.state}
                onChange={e => setRegisterData({ ...registerData, address: { ...registerData.address, state: e.target.value } })}
                required
              />
            </div>
            <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors font-bold border-2 border-yellow-400 shadow text-base">
              Cadastrar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
