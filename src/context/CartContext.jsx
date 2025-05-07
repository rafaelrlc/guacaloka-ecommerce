import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Erro ao buscar carrinho');
      const data = await res.json();
      setCart(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.log(err);
      setCart([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (itemId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/cart/remove_item/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao remover item do carrinho');
      }
      fetchCart();
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      toast.error('Erro ao remover item do carrinho. Tente novamente mais tarde.');
    }
  };

  const placeOrderCheckout = async (order) => {
    console.log('Order data:', order);
    try {
      const response = await fetch('http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(order)
      });
  
      if (!response.ok) {
        throw new Error('Erro ao finalizar pedido');
      }
  
      const data = await response.json();
      return data
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast.error('Erro ao finalizar pedido. Tente novamente mais tarde.');
    }
  }

  const calculateShipping = async (cep) => {
    if (!cep) {
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/shipping`, {
        method: 'POST',
        body: JSON.stringify({ cep }),
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao calcular frete');
      }

      const data = await response.json();
      // toast.success(`Frete calculado: ${data.frete}`);
      return data;
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast.error('CEP inválido.');
    }
  }

  const placeCheckout = async (order) => {
    console.log('Dados do pedido:', order);
    try {
      const response = await fetch('http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(order),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao realizar o checkout');
      }
  
      const data = await response.json();
      toast.success('Compra realizada com sucesso!');
      console.log('Resposta do checkout:', data);
    } catch (error) {
      console.error('Erro ao realizar o checkout:', error);
      toast.error('Erro ao realizar o checkout. Tente novamente mais tarde.');
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    await fetch('http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/cart/add_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId, quantity })
    });
    fetchCart();
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, fetchCart, loading, total, removeItemFromCart, placeOrderCheckout, calculateShipping, placeCheckout }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 