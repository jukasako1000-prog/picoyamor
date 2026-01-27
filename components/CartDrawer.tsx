import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, UserProfile } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: UserProfile | null;
  onOpenAuth: () => void;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  onCompleteOrder: (items: CartItem[], total: number) => void;
}

const FREE_SHIPPING_PENINSULA = 15;
const FREE_SHIPPING_EXTRA = 25;
const SHIPPING_PENINSULA = 4;
const SHIPPING_EXTRA = 7;

// Listado de provincias por nombre para detección automática
const EXTRA_PENINSULAR_PROVINCES = [
  'ceuta', 'melilla', 'baleares', 'islas baleares',
  'las palmas', 'santa cruz de tenerife', 'canarias', 'tenerife'
];

// Prefijos de Códigos Postales extrapeninsulares
const EXTRA_PENINSULAR_CP_PREFIXES = ['07', '35', '38', '51', '52'];

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  user,
  onOpenAuth,
  onRemove,
  onUpdateQuantity,
  onClearCart,
  onCompleteOrder
}) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Cálculo de totales
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const isExtraPeninsular = (() => {
    if (!user) return false;
    const prov = (user.province || '').toLowerCase().trim();
    const hasExtraProv = EXTRA_PENINSULAR_PROVINCES.some(p => prov.includes(p));
    const cp = (user.postalCode || '').trim();
    const cpPrefix = cp.substring(0, 2);
    const hasExtraCP = EXTRA_PENINSULAR_CP_PREFIXES.includes(cpPrefix);
    return hasExtraProv || hasExtraCP;
  })();

  const shippingFee = isExtraPeninsular
    ? (subtotal >= FREE_SHIPPING_EXTRA ? 0 : SHIPPING_EXTRA)
    : (subtotal >= FREE_SHIPPING_PENINSULA ? 0 : SHIPPING_PENINSULA);

  const activeThreshold = isExtraPeninsular ? FREE_SHIPPING_EXTRA : FREE_SHIPPING_PENINSULA;
  const remainingForFree = Math.max(0, activeThreshold - subtotal);

  const total = user ? (subtotal + shippingFee) : subtotal;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Ya no seleccionamos todo por defecto
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(cart.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
    if (!user) {
      onOpenAuth();
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={handleClose} />

      {/* Panel del Carrito */}
      <div className="relative w-full max-w-[440px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left md:m-4 md:rounded-[2.5rem] border border-gray-100">

        {status === 'success' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-fade-in">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
              <span className="material-symbols-outlined text-5xl filled-icon">check_circle</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text-main">¡Pedido Recibido!</h2>
              <p className="text-sm text-text-muted">Estamos preparando tus cositas para tu ave.</p>
            </div>
            <button onClick={handleClose} className="w-full max-w-xs bg-primary hover:bg-primary-hover text-white py-4 rounded-full font-bold transition-all">Cerrar</button>
          </div>
        ) : (
          <>
            {/* Cabecera */}
            <div className="px-8 py-8 flex items-center justify-between bg-white shrink-0">
              <h2 className="text-2xl font-black text-[#3F3D3C] flex items-baseline gap-1.5">
                Tu Carrito
                <span className="text-sm font-medium text-gray-400">({cart.length})</span>
              </h2>
              <button onClick={handleClose} className="text-[#3F3D3C] hover:bg-gray-50 p-2 rounded-full transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Selector SELECCIONAR TODO */}
            {cart.length > 0 && (
              <div className="px-8 py-3.5 bg-[#F9F9F8] flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={cart.length > 0 && selectedIds.size === cart.length}
                    onChange={handleSelectAll}
                  />
                  <div className="size-5 bg-[#6c9371]/20 border border-[#6c9371]/10 rounded peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[14px] font-black scale-0 peer-checked:scale-100 transition-transform">check</span>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#6c7a6e]">Seleccionar todo</span>
                </label>

                {selectedIds.size > 0 && (
                  <button
                    onClick={() => {
                      if (selectedIds.size === cart.length) onClearCart();
                      else selectedIds.forEach(id => onRemove(id));
                      setSelectedIds(new Set());
                    }}
                    className="flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors animate-fade-in"
                    title="Eliminar seleccionados"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                )}
              </div>
            )}

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto p-8 space-y-0 hide-scrollbar scroll-smooth">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <span className="material-symbols-outlined text-6xl">shopping_cart</span>
                  <p className="font-bold">Tu cesta está vacía</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 relative group py-4 border-b border-background-light last:border-0 transition-colors hover:bg-background-light/20 -mx-4 px-4 rounded-2xl">
                    <div className="flex items-center shrink-0">
                      <label className="cursor-pointer">
                        <input type="checkbox" className="peer sr-only" checked={selectedIds.has(item.id)} onChange={() => toggleSelect(item.id)} />
                        <div className="size-5 border-2 border-[#6c9371]/20 rounded-full peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-all">
                          <div className="size-2 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                      </label>
                    </div>

                    <div className="size-24 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-white flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-4/5 h-4/5 object-contain" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="font-black text-[15px] text-text-main leading-tight uppercase tracking-tight">{item.name}</h4>
                        <button onClick={() => onRemove(item.id)} className="text-[#D1D1D1] hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-[#F5F5F3] rounded-full px-2.5 py-0.5">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-[#A1A1A1] hover:text-primary transition-colors flex items-center">
                            <span className="material-symbols-outlined text-base">remove</span>
                          </button>
                          <span className="text-xs font-black text-[#3F3D3C]">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-[#A1A1A1] hover:text-primary transition-colors flex items-center">
                            <span className="material-symbols-outlined text-base">add</span>
                          </button>
                        </div>
                        <span className="font-black text-xs text-[#3F3D3C]">{item.price.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer de Totales Compacto */}
            {cart.length > 0 && (
              <div className="px-6 pt-4 pb-10 space-y-4 shrink-0 bg-white border-t border-background-light">
                {/* Resumen de Totales */}
                <div className="space-y-2 bg-background-light/30 rounded-2xl p-4 border border-background-light">
                  <div className="flex justify-between items-center text-[#6c7a6e]">
                    <span className="font-black uppercase tracking-widest text-[10px]">Subtotal</span>
                    <span className="font-black text-sm text-[#3F3D3C]">{subtotal.toFixed(2)}€</span>
                  </div>

                  <div className="flex justify-between items-center text-[#6c7a6e]">
                    <span className="font-black uppercase tracking-widest text-[10px]">Envío</span>
                    <span className="font-black text-sm text-[#3F3D3C]">
                      {!user ? (
                        <span className="text-[9px] text-gray-400 font-bold italic uppercase tracking-wider">Por calcular</span>
                      ) : (
                        shippingFee === 0 ? '0.00€' : `${shippingFee.toFixed(2)}€`
                      )}
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-[#3F3D3C] border-t border-background-light/50 mt-1">
                    <span className="font-black uppercase tracking-widest text-xs">Total</span>
                    <span className="font-black text-xl">
                      {total.toFixed(2)}€
                      {!user && <span className="text-[10px] text-gray-400 ml-1 font-bold">*</span>}
                    </span>
                  </div>
                </div>

                {user && remainingForFree > 0 && (
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-center gap-3 animate-fade-in my-3">
                    <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-lg filled-icon">redeem</span>
                    </div>
                    <p className="text-[11px] leading-tight">¡Solo te faltan <span className="font-black text-primary">{remainingForFree.toFixed(2)}€</span> para tener <span className="font-black uppercase">envío gratis</span>! 🦜✨</p>
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={handleCheckout}
                    disabled={status === 'loading'}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98] text-sm uppercase tracking-widest"
                  >
                    {status === 'loading' ? (
                      <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      'Tramitar Pedido'
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full bg-background-light hover:bg-gray-100 text-text-main font-black py-4 rounded-2xl transition-all active:scale-[0.98] text-[10px] uppercase tracking-widest"
                  >
                    Seguir Comprando
                  </button>
                </div>

                {/* Info de Envío Optimizada */}
                <div className="pt-2 border-t border-background-light">
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-center">
                      <span className="text-text-main">Península:</span> <span className="text-primary">Gratis desde {FREE_SHIPPING_PENINSULA}€</span>
                    </p>
                    <p className="text-[11px] font-black uppercase tracking-widest text-center">
                      <span className="text-text-main">Otros:</span> <span className="text-primary">Gratis desde {FREE_SHIPPING_EXTRA}€</span>
                    </p>
                  </div>
                </div>

                {user?.isGuest && (
                  <div className="mt-3 p-3 bg-primary/10 rounded-xl border border-primary/20 flex flex-col gap-2 animate-pulse-subtle">
                    <p className="text-[10px] text-text-main font-black uppercase tracking-widest text-center">
                      ¿Quieres guardar tus datos?
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuth();
                      }}
                      className="text-[9px] font-black text-primary hover:text-primary-hover uppercase tracking-[0.2em] flex items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px] filled-icon">person_add</span>
                      Crear una cuenta ahora
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes slide-left { 
          from { transform: translateX(100%); } 
          to { transform: translateX(0); } 
        }
        .animate-slide-left { animation: slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CartDrawer;
