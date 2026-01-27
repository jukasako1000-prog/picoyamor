
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, TESTIMONIALS, HERO_SLIDES } from '../constants';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface HomeProps {
  onAddToCart: (p: Product) => void;
  onImageClick: (url: string) => void;
}

const Home: React.FC<HomeProps> = ({ onAddToCart, onImageClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [stockLevels, setStockLevels] = useState<Record<string, number>>({});
  const [loadingStock, setLoadingStock] = useState(true);

  // Detector de redimensión
  useEffect(() => {
    fetchStock();
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Reset index on resize to prevent visual glitches
      setTestimonialIndex(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Lógica del Carrusel de Testimonios
  const maxIndex = isMobile ? TESTIMONIALS.length - 1 : TESTIMONIALS.length - 2;

  const nextTestimonial = useCallback(() => {
    setTestimonialIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevTestimonial = useCallback(() => {
    setTestimonialIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);

  const fetchStock = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, stock_quantity');

      if (error) throw error;

      if (data) {
        const levels = data.reduce((acc, curr: any) => ({
          ...acc,
          [curr.id]: curr.stock_quantity
        }), {});
        setStockLevels(levels);
      }
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoadingStock(false);
    }
  };

  return (
    <div className="space-y-12 md:space-y-24">
      {/* Hero Section */}
      <section className="relative w-full pt-28 md:pt-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full min-h-[480px] md:min-h-[620px] rounded-[3rem] overflow-hidden group shadow-2xl bg-[#E8E1D6]">
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {slide.type === 'video' ? (
                  <video
                    src={slide.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    loading="eager"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{
                      imageRendering: 'high-quality',
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent md:bg-gradient-to-br md:from-black/75 md:via-black/15 md:to-transparent"></div>

                <div className="relative h-full flex flex-col justify-start items-start p-8 md:p-16 lg:p-20 max-w-4xl pt-6 md:pt-10 lg:pt-12">
                  <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-[0.92] mb-5 tracking-tighter drop-shadow-2xl">
                    {slide.title.split('\n').map((line, i) => (
                      <span key={i} className="block whitespace-nowrap uppercase">{line}</span>
                    ))}
                    {slide.subtitle.split('\n').map((subLine, i) => (
                      <span key={i} className={`text-accent italic font-extrabold block whitespace-nowrap uppercase ${i === 0 ? 'mt-1' : ''}`}>
                        {subLine}
                      </span>
                    ))}
                  </h2>

                  <p className="text-white/90 text-sm md:text-base font-medium mb-8 max-w-sm leading-relaxed drop-shadow-lg">
                    {slide.desc}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link
                      to="/tienda"
                      className="bg-accent hover:bg-[#b8e030] text-text-main font-black text-base md:text-lg px-10 py-4 rounded-[1.6rem] transition-all duration-300 shadow-2xl shadow-black/20 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                      Ver Colección
                      <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight leading-tight">Por qué nos eligen los agapornis</h2>
            <p className="text-lg text-text-muted leading-relaxed font-medium">Materiales biófilos pensados para la seguridad y felicidad plena de tu mascota.</p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-background-light text-center space-y-4 hover:-translate-y-2 transition-transform">
              <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <span className="material-symbols-outlined text-2xl filled-icon">verified</span>
              </div>
              <h3 className="text-lg font-bold text-text-main leading-tight uppercase tracking-tight">Materiales de Calidad</h3>
              <p className="text-xs text-text-muted">Madera de poda y fibras naturales 100% libres de tóxicos.</p>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-background-light text-center space-y-4 hover:-translate-y-2 transition-transform">
              <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <span className="material-symbols-outlined text-2xl filled-icon">medical_services</span>
              </div>
              <h3 className="text-lg font-bold text-text-main leading-tight uppercase tracking-tight">Aval Veterinario</h3>
              <p className="text-xs text-text-muted">Supervisado por expertos en exóticos para un juego seguro.</p>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-background-light text-center space-y-4 hover:-translate-y-2 transition-transform">
              <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <span className="material-symbols-outlined text-2xl filled-icon">recycling</span>
              </div>
              <h3 className="text-lg font-bold text-text-main leading-tight uppercase tracking-tight">Envíos Eco</h3>
              <p className="text-xs text-text-muted">Packaging libre de plásticos para cuidar su planeta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Nuestros Favoritos</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">Top Ventas</h2>
            </div>
            <Link to="/tienda" className="flex items-center gap-2 text-text-main font-bold hover:text-primary transition-colors border-b-2 border-primary/20 pb-1 group text-sm">
              Ver toda la colección
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.slice(0, 3).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onImageClick={onImageClick}
                stock={stockLevels[product.id] ?? 0}
                isLoadingStock={loadingStock}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-24 bg-background-light/40 rounded-[4rem] mx-4 md:mx-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-block bg-accent/20 text-accent px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Opiniones Reales</div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter">La Bandada dice...</h2>
          </div>

          <div className="relative group max-w-6xl mx-auto">
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-12 -right-12 justify-between z-30 pointer-events-none">
              <button
                onClick={prevTestimonial}
                className="pointer-events-auto size-14 bg-white rounded-full shadow-xl flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={nextTestimonial}
                className="pointer-events-auto size-14 bg-white rounded-full shadow-xl flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${testimonialIndex * (isMobile ? 100 : 50)}%)` }}
              >
                {TESTIMONIALS.map((t) => (
                  <div
                    key={t.id}
                    className="w-full md:w-1/2 px-2 md:px-4 shrink-0"
                  >
                    <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-soft border border-background-light flex flex-col md:flex-row gap-6 items-center md:items-start h-full">
                      {/* Avatar Busto Personalizado */}
                      <div className="size-20 md:size-16 rounded-full border-4 border-white shrink-0 shadow-sm flex items-center justify-center overflow-hidden bg-white">
                        <img
                          src={t.avatar}
                          className="w-full h-full object-cover"
                          alt={t.name}
                        />
                      </div>

                      <div className="space-y-4 text-center md:text-left flex-1">
                        <div className="flex justify-center md:justify-start text-accent">
                          {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined filled-icon text-[14px]">star</span>)}
                        </div>
                        <p className="text-lg md:text-xl font-medium text-text-main italic leading-relaxed">
                          {t.text}
                        </p>
                        <div className="pt-2">
                          <p className="text-[11px] font-black text-primary uppercase tracking-widest">{t.name}</p>
                          <p className="text-[9px] font-bold text-text-muted uppercase">Compañero: {t.birdName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-12">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${i === testimonialIndex ? 'w-10 bg-primary' : 'w-2.5 bg-primary/20 hover:bg-primary/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 md:px-8 pb-24 pt-12">
        <div className="max-w-7xl mx-auto relative overflow-hidden bg-primary rounded-[4rem] p-12 md:p-24 text-center text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-10">
            <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">¿Listo para unirte a la bandada?</h2>
            <p className="text-lg md:text-xl font-medium opacity-90 leading-relaxed">Descubre qué pack es mejor para tu compañero emplumado.</p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to="/tienda" className="bg-white text-primary hover:bg-background-light px-10 py-5 rounded-full font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95">
                <span className="material-symbols-outlined">shopping_basket</span>
                Ir a la Tienda
              </Link>
              <Link to="/contact" className="border-2 border-white/30 hover:bg-white/10 px-10 py-5 rounded-full font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95">
                <span className="material-symbols-outlined">mail</span>
                Escríbenos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-15px) rotate(1deg); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        img { image-rendering: high-quality; }
      `}</style>
    </div>
  );
};

export default Home;
