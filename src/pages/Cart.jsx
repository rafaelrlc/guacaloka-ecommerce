import { useCart } from '../context/CartContext';
import { useEffect } from 'react';
export function Cart() {
  const { cart, loading, total, fetchCart } = useCart();

  // Atualiza o carrinho ao entrar na página
  // (caso o usuário tenha adicionado produtos em outra aba/página)
  useEffect(() => { fetchCart(); }, []); // Descomente se quiser sempre atualizar

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-yellow-800">Carregando carrinho...</div>;
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-yellow-900 ">Seu Carrinho</h1>
        <p className="text-orange-700">Seu carrinho está vazio</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-900">Seu Carrinho</h1>
      <div className="bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100 rounded-2xl shadow-lg overflow-hidden border-4 border-yellow-400">
        {cart.map((item) => (
          <div
            key={item.product_id}
            className="p-6 border-b last:border-b-0 flex items-center justify-between border-yellow-200"
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold text-green-800">{item.name}</h2>
              <p className="text-orange-700">${item.price.toFixed(2)} cada</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-yellow-900 bg-yellow-200 px-2 py-1 rounded shadow">
                {item.quantity}x
              </span>
              <span className="text-lg font-bold text-green-800 bg-green-100 px-2 py-1 rounded shadow">
                ${item.subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
        <div className="p-6 bg-yellow-50 border-t-4 border-yellow-300">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-yellow-900">Total:</span>
            <span className="text-2xl font-bold text-green-700 bg-green-100 px-3 py-1 rounded shadow">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 