import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/products');
        if (!res.ok) throw new Error('Erro ao buscar produtos');
        const data = await res.json();
        const idx = parseInt(id);
        if (isNaN(idx) || !data[idx]) {
          setProduct(null);
        } else {
          setProduct(data[idx]);
        }
      } catch (error) {
        setError('Erro ao buscar produto', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-yellow-800 font-medium">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Produto não encontrado</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error('Você precisa estar logado para adicionar itens ao carrinho');
      navigate('/login');
      return;
    }
    console.log("produto", product)
    addToCart(product.product_id, quantity);
    toast.success('Produto adicionado ao carrinho!');
  };

  return (
    <div className="h-[calc(100vh-88px)] flex items-center justify-center">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100 rounded-2xl shadow-lg overflow-hidden border-4 border-yellow-400">
        <div className="p-8">
          <img
            src={product.picture_url}
            alt={product.name}
            className="w-full max-h-[200px] object-contain mb-8 rounded-lg"
          />
          <h1 className="text-3xl font-extrabold mb-4 text-yellow-900">{product.name}</h1>
          <p className="text-orange-700 mb-6">{product.description}</p>
          <div className="mb-6">
            <span className="text-2xl font-bold text-yellow-900 bg-yellow-200 px-2 py-1 rounded shadow">
              R${product.price.toFixed(2)}
            </span>
            <span className="ml-4 text-green-700 bg-green-100 px-2 py-1 rounded">
              {product.category?.name}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="quantity" className="font-semibold text-green-800">
              Quantidade:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border-2 border-yellow-400 rounded-lg"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md border-2 border-yellow-400 font-bold text-lg"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
} 