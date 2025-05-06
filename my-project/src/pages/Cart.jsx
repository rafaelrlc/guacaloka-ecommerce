import { useCart } from '../context/CartContext';

export function Cart() {
  const { cart, loading, total, fetchCart } = useCart();

  // Atualiza o carrinho ao entrar na página
  // (caso o usuário tenha adicionado produtos em outra aba/página)
  // useEffect(() => { fetchCart(); }, []); // Descomente se quiser sempre atualizar

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Carregando carrinho...</div>;
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>
        <p className="text-gray-600">Seu carrinho está vazio</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {cart.map((item) => (
          <div
            key={item.product_id}
            className="p-6 border-b last:border-b-0 flex items-center justify-between"
          >
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price.toFixed(2)} cada</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">
                {item.quantity}x
              </span>
              <span className="text-lg font-bold">
                ${item.subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 