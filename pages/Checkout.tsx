import React from 'react';
import { UserProfile, CartItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { saveOrder, updateStock } from '../lib/db';
import { supabase } from '../lib/supabase';

interface CheckoutProps {
    cart: CartItem[];
    user: UserProfile | null;
    onClearCart: () => void;
    onCompleteOrder: (items: CartItem[], total: number) => void;
    onOpenAuth: (mode?: 'login' | 'register' | 'guest') => void;
}

const SHIPPING_PENINSULA = 4;
const SHIPPING_EXTRA = 8;
const FREE_SHIPPING_PENINSULA = 20;
const FREE_SHIPPING_EXTRA = 30;

const EXTRA_PENINSULAR_PROVINCES = [
    'LAS PALMAS', 'SANTA CRUZ DE TENERIFE', 'CEUTA', 'MELILLA', 'ILLES BALEARS', 'BALEARES', 'CANARIAS', 'TENERIFE', 'GRAN CANARIA'
];

const EXTRA_PENINSULAR_POSTAL_PREFIXES = [
    '35', '38', '51', '52', '07'
];

const Checkout: React.FC<CheckoutProps> = ({ cart, user, onClearCart, onCompleteOrder, onOpenAuth }) => {
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="pt-40 pb-20 text-center px-4">
                <div className="size-24 bg-background-light rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
                    <span className="material-symbols-outlined text-5xl">shopping_cart_off</span>
                </div>
                <h2 className="text-3xl font-black mb-4">Tu carrito está vacío</h2>
                <p className="text-text-muted mb-8 max-w-md mx-auto">Parece que aún no has añadido nada a tu nido. ¡Explora nuestra tienda y encuentra algo especial!</p>
                <button
                    onClick={() => navigate('/tienda')}
                    className="bg-primary text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all"
                >
                    Ir a la Tienda
                </button>
            </div>
        );
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const isExtraPeninsular = (() => {
        if (!user) return false;
        const province = user.province.toUpperCase();
        const postalCode = user.postalCode;
        const isProvinceMatch = EXTRA_PENINSULAR_PROVINCES.some(p => province.includes(p));
        const isPostalMatch = EXTRA_PENINSULAR_POSTAL_PREFIXES.some(prefix => postalCode.startsWith(prefix));
        return isProvinceMatch || isPostalMatch;
    })();

    const isAdmin = user && !user.isGuest && user.email === 'infopicoyamor@gmail.com';

    const shippingFee = isAdmin
        ? 0
        : (isExtraPeninsular
            ? (subtotal >= FREE_SHIPPING_EXTRA ? 0 : SHIPPING_EXTRA)
            : (subtotal >= FREE_SHIPPING_PENINSULA ? 0 : SHIPPING_PENINSULA));

    const total = subtotal + shippingFee;

    const handleFinalizeOrder = async () => {
        if (!user) return;

        try {
            // 1. Prepare order data for Supabase (Status: 'pendiente')
            const orderData = {
                customer_name: user.name,
                customer_email: user.email,
                customer_address: user.address,
                customer_city: user.city,
                customer_province: user.province,
                customer_postal_code: user.postalCode,
                customer_phone: user.phone,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image // Añadimos imagen para Stripe
                })),
                shipping_cost: shippingFee,
                shipping_method: isExtraPeninsular ? 'Extra-Peninsular' : 'Península',
                total: total,
                status: 'pendiente' // El pedido empieza como pendiente en la DB
            };

            // 2. Save to Orders table to get an ID
            const savedOrder = await saveOrder(orderData);
            const realId = savedOrder?.id;

            // 3. Call Supabase Edge Function to create Stripe Session
            const { data: session, error: sessionError } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    items: [
                        ...orderData.items,
                        { name: `Envío (${orderData.shipping_method})`, price: shippingFee, quantity: 1 }
                    ],
                    customer_email: user.email,
                    order_id: realId
                }
            });

            if (sessionError) throw sessionError;

            // 4. Redirigir a la pasarela de Stripe
            if (session?.url) {
                // GUARDAMOS EL ID EN UNA NOTA ADHESIVA PARA LUEGO
                if (realId) localStorage.setItem('pico_last_order_id', realId);
                window.location.href = session.url;
            } else {
                throw new Error('No se pudo generar la sesión de Stripe');
            }

            // NOTA: onCompleteOrder y onClearCart se llamarán en OrderSuccess.tsx 
            // tras confirmar que el pago fue exitoso (o al volver de Stripe)
        } catch (error) {
            console.error('Error in checkout process:', error);
            alert('Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-start">

                {/* Lado Izquierdo: Datos y Pago */}
                <div className="flex-1 w-full space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase">Finalizar Pedido</h2>
                        <div className="h-px bg-background-light flex-1 mt-2" />
                    </div>

                    {/* Sección de Datos de Envío */}
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-soft border border-background-light relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-10 -mt-10" />

                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-2xl filled-icon">local_shipping</span>
                                </div>
                                <h3 className="text-xl font-black text-text-main uppercase tracking-tight">Datos de Envío</h3>
                            </div>
                            {!user && (
                                <button
                                    onClick={onOpenAuth}
                                    className="text-xs font-black text-primary hover:text-primary-hover uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">login</span>
                                    Entrar / Registrarme
                                </button>
                            )}
                        </div>

                        {user ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Nombre Completo</p>
                                    <p className="font-bold text-text-main text-lg">{user.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Email</p>
                                    <p className="font-bold text-text-main text-lg">{user.email}</p>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Dirección</p>
                                    <p className="font-bold text-text-main text-lg">{user.address}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Localidad / Provincia</p>
                                    <p className="font-bold text-text-main text-lg">{user.city}, {user.province}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Código Postal / Teléfono</p>
                                    <p className="font-bold text-text-main text-lg">{user.postalCode} | {user.phone}</p>
                                </div>

                                {user.isGuest && (
                                    <div className="md:col-span-2 mt-4 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div>
                                            <p className="font-black text-text-main text-sm uppercase tracking-wide">Estás comprando como Invitado</p>
                                            <p className="text-xs text-text-muted">Tus datos no se guardarán para futuros pedidos.</p>
                                        </div>
                                        <button onClick={() => onOpenAuth('register')} className="text-xs font-black text-primary hover:text-primary-hover uppercase tracking-widest underline decoration-2 underline-offset-4">
                                            Crear cuenta ahora
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-background-light/50 rounded-3xl border-2 border-dashed border-background-light">
                                <p className="text-text-muted font-bold mb-6">Para calcular los gastos exactos y completar el envío, necesitamos tus datos.</p>
                                <button
                                    onClick={() => onOpenAuth('login')}
                                    className="bg-white text-text-main px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all border border-background-light"
                                >
                                    Rellenar datos ahora
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {/* Lado Derecho: Resumen del Pedido (Sticky) */}
                <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-32 space-y-6">
                    <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-background-light relative overflow-hidden">
                        <h3 className="text-2xl font-black text-text-main mb-8 uppercase tracking-tighter">Resumen</h3>

                        <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="size-16 rounded-2xl overflow-hidden border border-background-light bg-background-light/50 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-xs text-text-main truncate uppercase">{item.name}</h4>
                                        <p className="text-[10px] text-text-muted font-bold">CANTIDAD: {item.quantity}</p>
                                    </div>
                                    <p className="font-black text-sm">{(item.price * item.quantity).toFixed(2)}€</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-background-light">
                            <div className="flex justify-between items-center text-text-muted font-bold text-xs uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span className="text-text-main">{subtotal.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between items-center text-text-muted font-bold text-xs uppercase tracking-widest">
                                <span>Envío</span>
                                <span className={`${shippingFee === 0 ? 'text-primary font-black' : 'text-text-main'}`}>
                                    {user ? (shippingFee === 0 ? (isAdmin ? 'GRATIS (ADMIN)' : 'GRATIS') : `${shippingFee.toFixed(2)}€`) : 'PENDIENTE'}
                                </span>
                            </div>

                            <div className="pt-4 flex justify-between items-center text-text-main">
                                <span className="font-black text-lg uppercase tracking-widest">Total</span>
                                <span className="text-3xl font-black text-primary">{total.toFixed(2)}€</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-background-light space-y-4">
                            <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                <span className="material-symbols-outlined text-primary text-xl">encrypted</span>
                                <div>
                                    <p className="text-[10px] font-black text-text-main uppercase tracking-widest">Pago con Tarjeta</p>
                                    <p className="text-[9px] font-bold text-text-muted uppercase">Procesado por Stripe</p>
                                </div>
                                <div className="flex-1" />
                                <div className="flex gap-1 opacity-50">
                                    <span className="material-symbols-outlined text-xl">credit_card</span>
                                </div>
                            </div>

                            <button
                                onClick={handleFinalizeOrder}
                                disabled={!user}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all text-white shadow-xl
                    ${user
                                        ? 'bg-primary hover:bg-primary-hover shadow-primary/20 active:scale-95'
                                        : 'bg-background-light text-text-muted cursor-not-allowed shadow-none'
                                    }`}
                            >
                                Finalizar y Pagar
                            </button>

                            {!user && (
                                <p className="text-[10px] text-center text-red-500 font-bold uppercase">
                                    * Rellena tus datos para poder finalizar
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-background-light flex items-center gap-4">
                        <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-xl filled-icon">verified_user</span>
                        </div>
                        <p className="text-[10px] font-bold text-text-muted uppercase leading-relaxed">
                            Pago 100% seguro. Tus datos están protegidos bajo normativa europea de privacidad.
                        </p>
                    </div>
                </div>

            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
};

export default Checkout;
