
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
import OrderSuccess from './pages/OrderSuccess';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ShippingReturns from './pages/ShippingReturns';
import FAQ from './pages/FAQ';
import NewArrivals from './pages/NewArrivals';
import ClubPico from './pages/ClubPico';
import Admin from './pages/Admin';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import ImageModal from './components/ImageModal';
import ScrollToTop from './components/ScrollToTop';
import { Product, CartItem, UserProfile, Order } from './types';
import { syncProducts, getUserOrders } from './lib/db';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'guest'>('login');
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pico_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pico_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const handleOpenAuth = (mode: 'login' | 'register' | 'guest' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  useEffect(() => {
    syncProducts();
  }, []);

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

  // Sincronizar pedidos con la base de datos cuando el usuario está logueado
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (user && !user.isGuest && user.email) {
        try {
          const dbOrders = await getUserOrders(user.email);
          if (dbOrders) {
            setOrders(dbOrders);
          }
        } catch (error) {
          console.error('Error fetching user orders from DB:', error);
        }
      }
    };

    fetchUserOrders();
  }, [user]);

  const handleAddToCart = React.useCallback((product: Product) => {
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
  }, []);

  const handleRemoveFromCart = React.useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleUpdateQuantity = React.useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleClearCart = React.useCallback(() => {
    setCart([]);
  }, []);

  const handleCompleteOrder = React.useCallback((items: CartItem[], total: number, realId?: string) => {
    const newOrder: Order = {
      id: realId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      total: total,
      status: 'Procesando',
      items: items.map(i => i.name)
    };
    setOrders(prev => [newOrder, ...prev]);
  }, []);

  const handleLogin = React.useCallback((userData: UserProfile) => {
    setUser(userData);
  }, []);

  const handleLogout = React.useCallback(() => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem('pico_user');
    localStorage.removeItem('pico_orders');
  }, []);

  const handleUpdateUser = React.useCallback((updatedUser: UserProfile) => {
    setUser(updatedUser);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-body selection:bg-accent/30 selection:text-text-main overflow-x-hidden">
        <Navbar
          cart={cart}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={() => handleOpenAuth('login')}
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
                onOpenAuth={(mode?: 'login' | 'register' | 'guest') => handleOpenAuth(mode)}
              />
            } />
            <Route path="/order-success" element={<OrderSuccess onClearCart={handleClearCart} />} />
            <Route path="/aviso-legal" element={<LegalNotice />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos" element={<Terms />} />
            <Route path="/envios-devoluciones" element={<ShippingReturns />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/novedades" element={<NewArrivals />} />
            <Route path="/club-pico" element={<ClubPico />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          user={user}
          onOpenAuth={(mode?: 'login' | 'register' | 'guest') => handleOpenAuth(mode)}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
          onCompleteOrder={handleCompleteOrder}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
          initialMode={authInitialMode}
        />

        {/* Modal de Imagen Global */}
        <ImageModal imageUrl={viewingImage} onClose={() => setViewingImage(null)} />
      </div>
    </Router>
  );
};

export default App;
