import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="bg-gray-100">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
            <Toaster position="bottom-right" />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
