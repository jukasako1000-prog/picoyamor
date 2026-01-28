
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onImageClick?: (url: string) => void;
  stock?: number;
  isLoadingStock?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onImageClick, stock = 0, isLoadingStock = false }) => {
  const isOutOfStock = !isLoadingStock && stock <= 0;
  return (
    <div className="group bg-surface rounded-[2rem] p-4 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Contenedor de imagen clickable con indicador de zoom */}
      <div
        className={`relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 bg-white shadow-inner flex items-center justify-center ${onImageClick ? 'cursor-zoom-in' : ''}`}
        onClick={() => onImageClick?.(product.image)}
      >
        <img
          src={product.image}
          alt=""
          className={`w-full h-full object-contain p-0 transition-transform duration-700 group-hover:scale-110`}
          style={{ transform: product.scale ? `scale(${product.scale})` : 'scale(1)' }}
        />

        {/* Overlay de zoom sutil al hacer hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
          <div className="bg-white/90 size-10 rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <span className="material-symbols-outlined text-text-main text-xl">zoom_in</span>
          </div>
        </div>

        {/* Se han eliminado los badges (etiquetas) que aparecían aquí para limpiar la parte superior */}
        {!isLoadingStock && stock > 0 && stock <= 5 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-lg shadow-lg animate-pulse">
            Quedan {stock} unidades
          </div>
        )}
      </div>

      <div className="px-2 pb-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xl font-bold text-text-main leading-tight">{product.name}</h4>
          {product.isOffer && (
            <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-lg">-{Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)}%</span>
          )}
        </div>
        <p className="text-sm text-text-muted mb-6 leading-relaxed py-1">{product.description}</p>

        <div className="mt-auto pt-4 border-t border-background-light flex items-center justify-between">
          <div className="flex flex-col">
            {product.isOffer && <span className="text-xs text-text-muted line-through">{product.oldPrice?.toFixed(2)}€</span>}
            <span className="text-2xl font-black text-text-main">{product.price.toFixed(2)}€</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onAddToCart(product);
            }}
            disabled={isOutOfStock}
            className={`flex items-center justify-center p-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg min-w-[120px] 
              ${isOutOfStock
                ? 'bg-background-light text-text-muted cursor-not-allowed shadow-none'
                : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20 hover:scale-105 active:scale-95'}`}
          >
            {isOutOfStock ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">block</span>
                Agotado
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                Añadir
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
