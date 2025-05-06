import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/orders/history/${user.id}`, {
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

    if (user?.id) {
      fetchOrderHistory();
    }
  }, [user]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-900">Histórico de Compras</h1>
        <Link
          to="/"
          className="text-green-700 hover:text-green-800 transition-colors font-bold"
        >
          ← Voltar para a loja
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100 rounded-2xl shadow-lg border-4 border-yellow-400">
          <p className="text-orange-700 text-lg">Você ainda não realizou nenhuma compra.</p>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold border-2 border-yellow-400 shadow"
          >
            Fazer minha primeira compra
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.order_id} className="bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100 rounded-2xl shadow-lg p-6 border-4 border-yellow-400">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-green-800">Pedido {order.order_id}</h2>
                  <p className="text-orange-700">
                    Data: {new Date(order.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-yellow-900">
                    Total: R$ {order.total.toFixed(2)}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${order.status === 'confirmed' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>
                    {order.status === 'confirmed' ? 'Confirmado' : order.status}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4 border-yellow-300">
                <h3 className="font-semibold text-yellow-900 mb-4">Itens do Pedido:</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-4">
                        <Link
                          to={`/product/${item.product_id}`}
                          className="text-green-700 hover:text-green-800 transition-colors font-bold"
                        >
                          Ver produto
                        </Link>
                        <span className="text-orange-700">ID: {item.product_id}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-green-800">Quantidade: {item.quantity}</span>
                        <span className="text-yellow-900 font-medium">
                          R$ {(order.total / order.items.length).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 