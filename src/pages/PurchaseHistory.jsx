import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function PurchaseHistory() {
  const { fetchCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    const fetchOrderHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order history');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 mt-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-900">Histórico de Pedidos</h1>
        <Link
          to="/"
          className="text-green-700 hover:text-green-800 transition-colors font-bold"
        >
          ← Voltar para a loja
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-6 bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100 rounded-2xl shadow-lg border-4 border-yellow-400">
          <p className="text-orange-700 text-lg">Você ainda não realizou nenhuma compra.</p>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold border-2 border-yellow-400 shadow"
          >
            Fazer minha primeira compra
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderContent = (
              <div className="bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100 rounded-2xl shadow-lg px-6 py-3 border-4 border-yellow-400 transform transition-transform hover:scale-105 hover:shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-green-800">Pedido {order.id}</h2>
                    <p className="text-orange-700">
                      Data: {new Date(order.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-yellow-900">
                      Total: R$ {order.total.toFixed(2)}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${order.status === 'FINALIZADO' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            );

            return order.status === 'NO CARRINHO' ? (
              <div key={order.id} onClick={() => navigate('/cart')} className="cursor-pointer">
                {orderContent}
              </div>
            ) : (
              <div key={order.id}>{orderContent}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}