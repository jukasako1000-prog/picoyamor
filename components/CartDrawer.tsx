
import React, { useState, useEffect, useMemo } from 'react';
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

const MIN_ORDER = 20;
const PENINSULA_SHIPPING_FEE = 3.50;
const EXTRA_PENINSULAR_FEE = 5;

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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Cálculo de totales (ahora solo sobre seleccionados)
  const selectedItems = useMemo(() => cart.filter(item => selectedIds.has(item.id)), [cart, selectedIds]);
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const isExtraPeninsular = useMemo(() => {
    if (!user) return false;
    const prov = (user.province || '').toLowerCase().trim();
    const hasExtraProv = EXTRA_PENINSULAR_PROVINCES.some(p => prov.includes(p));
    const cp = (user.postalCode || '').trim();
    const cpPrefix = cp.substring(0, 2);
    const hasExtraCP = EXTRA_PENINSULAR_CP_PREFIXES.includes(cpPrefix);
    return hasExtraProv || hasExtraCP;
  }, [user]);

  const isBelowMinimum = subtotal > 0 && subtotal < MIN_ORDER;
  const remainingForMinimum = (MIN_ORDER - subtotal).toFixed(2);

  const shippingFee = isExtraPeninsular ? EXTRA_PENINSULAR_FEE : (subtotal < MIN_ORDER ? PENINSULA_SHIPPING_FEE : 0);
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Solo seleccionamos por defecto los que no estuvieran ya en el Set para no sobreescribir
      // Pero para cumplir con la petición de "desactivar" la opción de seleccionar todo de golpe:
      // Si el Set está vacío (primera vez o se vació), seleccionamos lo que haya.
      // Si ya hay cosas, no forzamos la selección de TODO el carrito de nuevo.
      if (selectedIds.size === 0 && cart.length > 0) {
        setSelectedIds(new Set(cart.map(item => item.id)));
      }
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]); // Quitamos cart.length para que no se resetee al añadir items

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
    if (isBelowMinimum) return;
    if (!user) {
      onOpenAuth();
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      onCompleteOrder(selectedItems, total);
      // Solo eliminamos del carrito los items que se han comprado
      selectedIds.forEach(id => onRemove(id));
      setStatus('success');
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStatus('idle'), 300);
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
            {/* Cabecera idéntica a la imagen */}
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
              <div className="px-8 py-3.5 bg-[#F9F9F8] flex items-center justify-between group/selectall">
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
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-600 transition-colors animate-fade-in"
                    title="Eliminar seleccionados"
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider">Eliminar</span>
                    <span className="material-symbols-outlined text-xl">delete_sweep</span>
                  </button>
                )}
              </div>
            )}

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 hide-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <span className="material-symbols-outlined text-6xl">shopping_cart</span>
                  <p className="font-bold">Tu cesta está vacía</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-5 relative group">
                    <div className="flex items-start pt-3">
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

                    <div className="flex-1 flex flex-col justify-between pt-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-[14px] text-[#3F3D3C] leading-snug pr-6 max-w-[160px]">{item.name}</h4>
                        <button onClick={() => onRemove(item.id)} className="text-[#D1D1D1] hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 bg-[#F5F5F3] rounded-full px-3 py-1">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-[#A1A1A1] hover:text-primary transition-colors flex items-center">
                            <span className="material-symbols-outlined text-lg">remove</span>
                          </button>
                          <span className="text-[13px] font-black text-[#3F3D3C]">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-[#A1A1A1] hover:text-primary transition-colors flex items-center">
                            <span className="material-symbols-outlined text-lg">add</span>
                          </button>
                        </div>
                        <span className="font-black text-[14px] text-[#3F3D3C]">{item.price.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer de Totales */}
            {cart.length > 0 && (
              <div className="px-8 pt-6 pb-14 space-y-8 shrink-0 bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[#6c7a6e]">
                    <span className="font-black uppercase tracking-widest text-[11px]">Subtotal Productos</span>
                    <span className="font-black text-[16px] text-[#3F3D3C]">{subtotal.toFixed(2)}€</span>
                  </div>

                  <div className="flex justify-between items-center text-[#6c7a6e]">
                    <span className="font-black uppercase tracking-widest text-[11px]">Gastos de Envío</span>
                    <span className="font-black text-[16px] text-[#3F3D3C]">
                      {shippingFee === 0 ? '0.00€' : `${shippingFee.toFixed(2)}€`}
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-[#3F3D3C]">
                    <span className="font-black uppercase tracking-[0.15em] text-[13px]">Total Pedido</span>
                    <span className="font-black text-[22px]">
                      {total.toFixed(2)}€
                    </span>
                  </div>

                  {isBelowMinimum && (
                    <div className="bg-[#FFF1F1] py-4 px-6 rounded-full border border-[#FFE4E4] animate-pulse mt-4">
                      <p className="text-center text-[11px] font-black text-[#FF6363] uppercase tracking-wider">
                        ¡Faltan {remainingForMinimum}€ para el pedido mínimo!
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={handleCheckout}
                    disabled={status === 'loading' || isBelowMinimum}
                    className={`w-full h-[64px] rounded-full font-black text-[16px] transition-all active:scale-[0.97] shadow-lg
                      ${isBelowMinimum
                        ? 'bg-[#D1D1D1] text-white cursor-not-allowed opacity-80 shadow-none'
                        : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20'
                      }
                    `}
                  >
                    {status === 'loading' ? (
                      <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      isBelowMinimum ? `Pedido Mínimo ${MIN_ORDER}€` : 'Tramitar Pedido'
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full h-[64px] bg-[#F9F9F8] text-[#6c7a6e] rounded-full font-black text-[12px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all active:scale-[0.97]"
                  >
                    Seguir comprando
                  </button>
                </div>

                {/* Info de Envío - Se quitan los paréntesis según instrucción */}
                <div className="text-center pt-2 space-y-1.5">
                  <p className="text-[13px] font-black text-[#5a5a5a] tracking-[0.06em] uppercase leading-tight">
                    Envío Peninsular: <span className="text-primary font-black">{subtotal >= MIN_ORDER ? 'GRATIS CON PEDIDO MÍNIMO' : `${PENINSULA_SHIPPING_FEE.toFixed(2)}€`}</span>
                  </p>
                  <p className="text-[13px] font-black text-[#5a5a5a] tracking-[0.06em] uppercase leading-tight">
                    BALEARES, CANARIAS, CEUTA Y MELILLA: <span className="text-[#3F3D3C]">{EXTRA_PENINSULAR_FEE.toFixed(2)}€</span>
                  </p>
                  <p className="text-[15px] mt-4 text-[#3F3D3C] font-black uppercase tracking-wider">
                    PEDIDO MÍNIMO {MIN_ORDER}€
                  </p>
                </div>
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
