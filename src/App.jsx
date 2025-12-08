import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* Redirect /categories to /shop */}
                <Route path="/categories" element={<Navigate to="/shop" replace />} />
              </Routes>
              <Footer />
            </Layout>
          </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
