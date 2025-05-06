import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { PurchaseHistory } from './pages/PurchaseHistory';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100">
            <Header />
            <main className="pt-24">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/purchase-history" element={<PurchaseHistory />} />
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
