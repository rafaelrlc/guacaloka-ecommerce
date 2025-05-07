import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Carousel } from '../components/Carousel';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';
const CATEGORIES = [
  { label: 'Clássico', value: 'Clássico' },
  { label: 'Combos', value: 'Combos' },
  { label: 'Recomendados', value: 'Recomendados' },
];

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { fetchCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://ec2-44-201-141-230.compute-1.amazonaws.com:3000/dev/products');
        if (!res.ok) throw new Error('Erro ao buscar produtos');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Erro ao buscar produtos');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-yellow-800 font-medium">Carregando produtos...</p>
        </div>
      </div>
    );
  }
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;

  return (
    <>
      <Carousel />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {/* <h1 className="text-4xl font-extrabold text-yellow-900 drop-shadow ">Menu:</h1> */}
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? '' : cat.value)}
                className={`px-3 py-1 rounded-lg font-bold border-2 shadow transition-colors
                  ${selectedCategory === cat.value
                    ? cat.value === 'Books' ? 'bg-yellow-300 text-yellow-900 border-yellow-500'
                      : cat.value === 'Electronics' ? 'bg-green-300 text-green-900 border-green-500'
                        : cat.value === 'Clothing' ? 'bg-orange-300 text-orange-900 border-orange-500'
                          : 'bg-gray-200 text-gray-800 border-gray-400'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-yellow-100'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(p => !selectedCategory || p.category?.name === selectedCategory)
            .map((product, idx) => (
              <Link
                key={idx}
                to={`/product/${idx}`}
                className="bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border-4 border-yellow-400 hover:border-green-500"
              >
                <div className="p-6">
                  <img
                    src={product.picture_url}
                    alt={product.name}
                    className="w-full h-50 object-cover mb-4 rounded-lg "
                  />
                  <h2 className="text-xl font-bold mb-2 text-green-800">{product.name}</h2>
                  <p className="text-orange-700 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-yellow-900 bg-yellow-200 px-2 py-1 rounded shadow">
                      R${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">
                      {product.category?.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
} 