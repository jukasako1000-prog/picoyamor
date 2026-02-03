
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface PacksProps {
  onAddToCart: (p: Product) => void;
  onImageClick: (url: string) => void;
}

const Packs: React.FC<PacksProps> = ({ onAddToCart, onImageClick }) => {
  const [filter, setFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockLevels, setStockLevels] = useState<Record<string, number>>({});
  const [loadingStock, setLoadingStock] = useState(true);

  const categories = ['Todos', 'Packs', 'Columpios', 'Forrajeo/Colgantes'];

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, stock_quantity');

      if (error) throw error;

      if (data) {
        const levels = data.reduce((acc, curr) => ({
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

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = filter === 'Todos' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-text-main tracking-tight">Nuestra Tienda</h1>
          <p className="text-base md:text-lg text-text-muted max-w-xl font-medium leading-relaxed">
            Materiales orgánicos, texturas irresistibles y diseños artesanales pensados para el bienestar mental de tu ave.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Buscador */}
          <div className="relative w-full lg:max-w-md group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              placeholder="Buscar juguetes o packs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-background-light rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-main font-medium placeholder:text-text-muted/50 shadow-sm"
            />
          </div>

          {/* Filtros de Categoría con indicador de scroll */}
          <div className="relative w-full lg:w-auto group/scroll">
            <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2 shrink-0 w-full lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`whitespace-nowrap px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 focus:outline-none ${filter === cat
                    ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-105'
                    : 'bg-white hover:bg-background-light text-text-main border-2 border-background-light shadow-sm'
                    }`}
                >
                  {cat}
                </button>
              ))}
              {/* Espaciador final para que el último item no quede tapado por el desvanecimiento */}
              <div className="w-8 shrink-0 lg:hidden"></div>
            </div>

            {/* Gradiente de desvanecimiento (Aviso de más contenido) */}
            <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-l from-background-light via-background-light/80 to-transparent lg:hidden z-10"></div>

            {/* Icono sutil de indicación */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 lg:hidden z-20 animate-pulse pointer-events-none opacity-50">
              <span className="material-symbols-outlined text-primary text-lg">chevron_right</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
        {filteredProducts.map((product) => (
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

      {filteredProducts.length === 0 && (
        <div className="py-24 text-center space-y-6 bg-white rounded-[3rem] shadow-soft border border-background-light">
          <div className="size-24 bg-background-light rounded-full flex items-center justify-center mx-auto text-text-muted">
            <span className="material-symbols-outlined text-5xl">search_off</span>
          </div>
          <div>
            <p className="text-2xl font-black text-text-main">No encontramos lo que buscas</p>
            <p className="text-text-muted font-medium">Prueba con otros términos o cambia el filtro.</p>
          </div>
          <button
            onClick={() => { setFilter('Todos'); setSearchQuery(''); }}
            className="text-primary font-black text-lg underline underline-offset-8"
          >
            Ver toda la colección
          </button>
        </div>
      )}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Packs;
