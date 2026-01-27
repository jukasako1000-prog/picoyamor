
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Packs from './pages/Packs';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import ImageModal from './components/ImageModal';
import ScrollToTop from './components/ScrollToTop';
import { Product, CartItem, UserProfile, Order } from './types';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pico_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pico_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user && !user.isGuest) {
      localStorage.setItem('pico_user', JSON.stringify(user));
    } else if (!user) {
      localStorage.removeItem('pico_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pico_orders', JSON.stringify(orders));
  }, [orders]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCompleteOrder = (items: CartItem[], total: number) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      total: total,
      status: 'Procesando',
      items: items.map(i => i.name)
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem('pico_user');
    localStorage.removeItem('pico_orders');
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-body selection:bg-accent/30 selection:text-text-main overflow-x-hidden">
        <Navbar
          cart={cart}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onAddToCart={handleAddToCart} onImageClick={setViewingImage} />} />
            <Route path="/tienda" element={<Packs onAddToCart={handleAddToCart} onImageClick={setViewingImage} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile user={user} orders={orders} onUpdateUser={handleUpdateUser} />} />
            <Route path="/checkout" element={
              <Checkout
                cart={cart}
                user={user}
                onClearCart={handleClearCart}
                onCompleteOrder={handleCompleteOrder}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
          onCompleteOrder={handleCompleteOrder}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
        />

        {/* Modal de Imagen Global */}
        <ImageModal imageUrl={viewingImage} onClose={() => setViewingImage(null)} />
      </div>
    </Router>
  );
};

export default App;
