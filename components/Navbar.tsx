
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartItem, UserProfile } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenAuth: () => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cart, onOpenCart, onOpenAuth, user, onLogout }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = (cart || []).reduce((acc, item) => acc + (item?.quantity || 0), 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset'; // Asegurar limpieza al desmontar
    };
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset'; // FORZAR desbloqueo al cambiar de página
  }, [location.pathname]);

  const handleNavClick = (path: string) => {
    setIsMenuOpen(false);
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Tienda', path: '/tienda' },
    { name: 'En el Taller', path: '/novedades' },
    { name: 'Blog', path: '/blog' },
    { name: 'Club Pico 🦜', path: '/club-pico', isSpecial: true },
    { name: 'Nosotros', path: '/about' },
    { name: 'Contacto', path: '/contact', icon: 'mail' },
  ];

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 pointer-events-none ${isScrolled ? 'pt-2' : 'pt-4'}`}>
        <nav className={`w-full max-w-7xl transition-all duration-500 pointer-events-auto flex items-center justify-between
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-hover rounded-2xl px-3 py-2 border-primary/5'
            : 'bg-surface/80 backdrop-blur-md border-white/50 shadow-soft rounded-full px-4 sm:px-6 py-4'
          }`}
        >
          {/* Lado Izquierdo: Hamburguesa (Móvil) + Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden size-10 flex items-center justify-center text-text-main hover:bg-primary/5 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <Link
              to="/"
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 sm:gap-4 group shrink-0"
            >
              <div className={`overflow-hidden rounded-full border-2 border-primary/20 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${isScrolled ? 'size-7 md:size-8' : 'size-9 md:size-10'}`}>
                <img
                  src="/LOGOPICOYAMOR.jpeg"
                  alt="Pico & Amor Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className={`text-text-main font-black tracking-tighter hidden lg:block transition-all duration-500 leading-none ${isScrolled ? 'text-base' : 'text-xl'}`}>
                Pico & Amor
              </h1>
            </Link>
          </div>

          {/* Menú Desktop (Centrado) */}
          <div className={`hidden md:flex items-center gap-1 transition-all duration-500 rounded-full p-1 ${isScrolled ? 'bg-background-light/30' : 'bg-background-light/50'}`}>
            {navLinks.map((link: any) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`px-4 xl:px-5 py-2 rounded-full text-[11px] xl:text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center 
                  ${link.isSpecial ? 'hover:scale-110 active:scale-95 hover:-rotate-3 text-primary' : ''}
                  ${location.pathname === link.path || (link.path === '/blog' && location.pathname.startsWith('/blog'))
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-main hover:text-primary hover:bg-white/50'
                  }`}
                title={link.icon ? link.name : undefined}
              >
                {link.icon ? (
                  <span className="material-symbols-outlined text-lg">{link.icon}</span>
                ) : (
                  link.name
                )}
              </Link>
            ))}
          </div>

          {/* Lado Derecho: Cuenta + Carrito */}
          <div className="flex items-center gap-1 sm:gap-3">
            {user ? (
              <div className={`flex items-center gap-1 sm:gap-2 rounded-full pl-2 sm:pl-3 pr-1 py-1 transition-colors ${isScrolled ? 'bg-background-light/50' : 'bg-background-light'}`}>
                <Link to="/profile" className="text-[10px] font-black uppercase tracking-wider text-text-main hover:text-primary transition-colors pr-1">
                  {user.email === 'infopicoyamor@gmail.com' && !user.isGuest ? 'ADMIN' : (user.isGuest ? 'Invitado' : user.name.split(' ')[0])}
                </Link>
                <button
                  onClick={onLogout}
                  className="size-7 bg-white text-text-muted hover:text-red-500 rounded-full flex items-center justify-center transition-colors shadow-sm"
                  title="Cerrar sesión"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-full transition-all text-[10px] font-black uppercase tracking-wide`}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span className="hidden xl:block">Mi Cuenta</span>
              </button>
            )}

            <button
              onClick={onOpenCart}
              className={`group relative flex items-center gap-2 transition-all duration-500 bg-primary text-white rounded-full hover:bg-primary-hover shadow-lg shadow-primary/10 active:scale-95
                ${isScrolled ? 'pl-2.5 pr-1.5 py-1' : 'pl-4 sm:pl-5 pr-2 sm:pr-2.5 py-2'}`}
            >
              <span className={`font-black uppercase tracking-wider hidden sm:block transition-all ${isScrolled ? 'text-[10px]' : 'text-xs'}`}>Carrito</span>
              <div className={`bg-white/20 rounded-full flex items-center justify-center group-hover:scale-105 transition-all ${isScrolled ? 'size-7' : 'size-9'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: isScrolled ? '16px' : '20px' }}>shopping_bag</span>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-black size-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Menú Móvil (Overlay) */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 md:hidden ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-background-light/95 backdrop-blur-2xl" onClick={() => setIsMenuOpen(false)} />

        <div className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-8 flex items-center justify-between border-b border-background-light">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full overflow-hidden border-2 border-primary/20">
                <img src="/LOGOPICOYAMOR.jpeg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-black text-text-main">Menú</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="size-10 flex items-center justify-center text-text-muted hover:bg-background-light rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-6 py-5 rounded-[2rem] font-black uppercase tracking-[0.15em] text-lg transition-all ${location.pathname === link.path
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-2'
                  : 'text-text-main hover:bg-background-light active:scale-95'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="p-8 border-t border-background-light bg-background-light/30">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">Síguenos en Instagram</p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/picoyamor.juguetes?igsh=MXQ2dHoxbnRkZW13cQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="size-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform overflow-hidden p-0"
              >
                <img src="/LOGOS/ICONOINSTAGRAM.png" alt="Instagram" className="w-full h-full object-cover" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
