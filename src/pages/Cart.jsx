/* eslint-disable no-unused-vars */
import { useCart } from '../context/CartContext';
import carrinhoVazio from '../assets/carrinho-vazio.png';
import { Trash } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function Cart() {
  const { cart, loading, fetchCart, removeItemFromCart, placeOrderCheckout, calculateShipping } = useCart();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [checkoutResponse, setCheckoutResponse] = useState(null);
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState(null);
  const [bairro, setBairro] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  console.log('Cart:', cart);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-yellow-800">Carregando carrinho...</div>;
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <img src={carrinhoVazio} alt="Carrinho vazio" className="mx-auto h-[500px] w-[500px] mt-10" />
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price_at_purchase, 0);

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen após os 5 primeiros dígitos
    }
    setCep(value);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePlaceOrder = async () => {
    const cartItems = cart.map((item) => ({
      product_id: item.item_id,
      quantity: item.quantity,
    }));

    const paymentData = {
      "cart_items": cartItems,
      "payment_method": paymentMethod,
    }

    try {
      const response = await placeOrderCheckout(paymentData);
      setCheckoutResponse(response);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast.error('Erro ao finalizar pedido. Tente novamente mais tarde.');
    }
  };


  const handleRemoveItem = async (itemId) => {
    try {
      await removeItemFromCart(itemId);

    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
    }
  };

  const handleCalculateShipping = async (cep) => {
    try {
      const formattedCep = cep.replace('-', ''); // Remove o traço do CEP
      console.log('Calculando frete para o CEP:', formattedCep);
      const response = await calculateShipping(formattedCep);
      console.log('Frete calculado:', response);
      setFrete(response.frete);
      setBairro(response.bairro);
      setStreet(response.logradouro);
      setCity(response.localidade);
      setState(response.estado);

    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast.error('Erro ao calcular frete. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-900">Seu Carrinho</h1>
      <div className="bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100 rounded-2xl shadow-lg overflow-hidden border-4 border-yellow-400">
        {cart.map((item) => (
          <div
            key={item.item_id}
            className="p-6 border-b last:border-b-0 flex items-center justify-between border-yellow-200"
          >
            <div className="flex-1">
              <img src={item.picture_url} className='h-14 w-14'/>
              <h2 className="text-xl font-bold text-green-800">{item.product_name}</h2>
              <p className="text-orange-700">R${item.price_at_purchase.toFixed(2)}</p>
              <p className="text-sm text-gray-600">{item.product_description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-yellow-900 bg-yellow-200 px-2 py-1 rounded shadow">
                {item.quantity}x
              </span>
              <span className="text-lg font-bold text-green-800 bg-green-100 px-2 py-1 rounded shadow">
                ${(item.quantity * item.price_at_purchase).toFixed(2)}
              </span>
              <button
                onClick={() => handleRemoveItem(item.item_id)}
                className="bg-red-600 text-white text-sm font-bold px-3 py-2 rounded shadow hover:bg-red-700 transition"
              >
                <span>
                  <Trash size={16} />
                </span>
              </button>
            </div>
          </div>
        ))}

        <div className="p-6 bg-yellow-50 border-t-4 border-yellow-300">
          <div className="mb-4">
            <label className="block text-lg font-bold mb-2 text-gray-700">Calcular Frete:</label>
            <div className="flex items-center gap-4">
              {frete ? (
                <>
                  <span className="text-lg font-bold text-green-800 bg-green-100 px-4 py-2 rounded shadow">
                    Frete: R${frete.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      setFrete(null);
                      setCep('');
                    }}
                    className="bg-yellow-400 text-white text-sm font-bold px-4 py-2 rounded shadow hover:bg-yellow-500 transition"
                  >
                    Calcular outro frete
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="Digite seu CEP"
                    className="w-full p-3 border-2 border-yellow-400 rounded bg-transparent"
                    maxLength={9}
                  />
                  <button
                    onClick={() => handleCalculateShipping(cep)}
                    className="bg-yellow-400 text-white text-sm font-bold px-4 py-2 rounded shadow hover:bg-yellow-500 transition"
                  >
                    Calcular
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-yellow-900">Total:</span>
            <span className="text-2xl font-bold text-green-700 bg-green-100 px-3 py-1 rounded shadow">
              R${(total + (frete || 0)).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className={`w-full text-white text-lg font-bold py-3 rounded shadow transition ${frete
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
              }`}
            disabled={!frete}
          >
            Realizar Compra
          </button>
        </div>
      </div>

      {showCheckout && (
        <div className="mt-6 p-6 bg-gray-100 rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-yellow-900">Finalizar Pedido</h2>
          <div className="mb-4">
            <label className="block text-lg font-bold mb-2 text-gray-700">Forma de Pagamento:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border rounded shadow"
            >
              <option value="credit_card">Cartão de Crédito</option>
              <option value="pix">Pix</option>
              <option value="boleto">Boleto</option>
            </select>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-blue-600 text-white text-lg font-bold py-3 rounded shadow hover:bg-blue-700 transition"
          >
            Confirmar Pedido
          </button>
          {checkoutResponse && (
            <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500">
              <p className="text-green-800 font-bold">{checkoutResponse.message}</p>
              <p>ID do Pedido: {checkoutResponse.order.order_id}</p>
              <p>Status: {checkoutResponse.order.status}</p>
              <p>Total: ${checkoutResponse.order.total.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}