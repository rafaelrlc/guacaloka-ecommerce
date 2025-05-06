import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
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
      } catch (err) {
        setError('Erro ao buscar produto');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Carregando produto...</div>;
  }
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Produto não encontrado</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id || id, quantity);
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <img
            src={product.picture_url}
            alt={product.name}
            className="w-full max-h-[200px] object-contain mb-8 rounded"
          />
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="mb-6">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="ml-4 text-gray-500">{product.category?.name}</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="quantity" className="font-semibold">
              Quantidade:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
} 