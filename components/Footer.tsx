
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-hover text-white/90 rounded-t-[3rem] pt-16 pb-8 px-4 md:px-8 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-12 bg-white rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                <img
                  src="https://i.postimg.cc/Gpywxh9s/Whats-App-Image-2026-01-11-at-15-24-14.jpg"
                  alt="Pico & Amor Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-black">Pico & Amor</h2>
            </div>
            <p className="text-white/60 mb-8 max-w-sm text-lg leading-relaxed">
              Tu tienda de confianza para el enriquecimiento ambiental de tus aves.
              Creamos felicidad y seguridad, un juguete a la vez.
            </p>

            {/* Redes Sociales Seguras */}
            <div className="flex gap-5 items-center">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="size-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300 group shadow-lg">
                <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="size-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:text-white transition-all duration-300 group shadow-lg">
                <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">photo_camera</span>
              </a>
              <a href="https://wa.me/34000000000" target="_blank" rel="noopener noreferrer" className="size-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all duration-300 group shadow-lg">
                <span className="material-symbols-outlined text-[26px] filled-icon group-hover:scale-110 transition-transform">chat</span>
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white mb-6 uppercase tracking-widest text-xs opacity-70">Explora</h5>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li><Link to="/tienda" className="hover:text-white transition-colors">Toda la Tienda</Link></li>
              <li><button onClick={scrollToTop} className="text-left hover:text-white transition-colors">Novedades</button></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog de Cuidados</Link></li>
              <li><button onClick={scrollToTop} className="text-left hover:text-white transition-colors">Club Pico</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-6 uppercase tracking-widest text-xs opacity-70">Ayuda</h5>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li><Link to="/envios-devoluciones" className="hover:text-white transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 gap-4">
          <p>© 2024 Pico & Amor. Todos los derechos reservados. Hecho con 💚 para las aves.</p>
          <div className="flex gap-6">
            <Link to="/privacidad" className="hover:text-white">Privacidad</Link>
            <Link to="/terminos" className="hover:text-white">Términos</Link>
            <Link to="/aviso-legal" className="hover:text-white">Aviso Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
