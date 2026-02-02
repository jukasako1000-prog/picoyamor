
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface OrderSuccessProps {
    onClearCart: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ onClearCart }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');

    // Intentamos recuperar el número de pedido real
    const [orderNumber, setOrderNumber] = React.useState<string>('...');

    useEffect(() => {
        window.scrollTo(0, 0);

        // FORZAR DESBLOQUEO: Aseguramos que el usuario pueda volver a navegar
        document.body.style.overflow = 'unset';
        document.body.style.pointerEvents = 'auto';

        // Limpiamos el carrito al llegar aquí
        onClearCart();

        // 1. Si viene por estado (ruta interna)
        const state = location.state as { orderId?: string } | null;
        if (state?.orderId) {
            setOrderNumber(state.orderId.slice(0, 8).toUpperCase());
            return;
        }

        // 2. Si viene de Stripe (por URL), buscamos el último pedido en el historial local
        const savedOrders = localStorage.getItem('pico_orders');
        if (savedOrders) {
            try {
                const orders = JSON.parse(savedOrders);
                if (orders && orders.length > 0) {
                    setOrderNumber(orders[0].id.slice(0, 8).toUpperCase());
                    return;
                }
            } catch (e) {
                console.error("Error leyendo historial para el ID");
            }
        }

        // 3. Si todo falla, generamos uno temporal digno
        setOrderNumber(sessionId ? 'CONFIRMADO' : `ORD-${Math.floor(1000 + Math.random() * 9000)}`);
    }, [location.state, sessionId, onClearCart]);

    return (
        <div className="min-h-screen pt-40 pb-20 px-4 flex items-center justify-center bg-background-light/30">
            <div className="max-w-2xl w-full bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-background-light relative overflow-hidden text-center animate-fade-in">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[10rem] -mr-20 -mt-20 animate-pulse-subtle" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-tr-[8rem] -ml-10 -mb-10 animate-pulse-subtle" />

                {/* Celebratory Icon */}
                <div className="relative mb-10">
                    <div className="size-28 bg-primary/10 rounded-full flex items-center justify-center mx-auto relative z-10">
                        <span className="material-symbols-outlined text-6xl text-primary animate-bounce filled-icon">check_circle</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-text-main uppercase tracking-tighter mb-4">
                    ¡Pedido Recibido! <br />
                    <span className="text-primary italic">🦜 Gracias 🦜</span>
                </h1>

                <p className="text-text-muted font-bold mb-8 max-w-md mx-auto leading-relaxed">
                    Tu pedido <span className="text-text-main font-black">#{orderNumber}</span> ha sido procesado con éxito.
                    En breve recibirás un correo con todos los detalles y el seguimiento.
                </p>

                <div className="bg-background-light/50 rounded-3xl p-6 mb-10 border border-background-light inline-block">
                    <div className="flex items-center gap-3 text-left">
                        <div className="size-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                            <span className="material-symbols-outlined text-xl">mark_email_read</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Siguiente Paso</p>
                            <p className="text-sm font-bold text-text-main">Revisa tu bandeja de entrada</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/tienda')}
                        className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95 text-sm"
                    >
                        Volver a la Tienda
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white text-text-main px-10 py-5 rounded-2xl font-black uppercase tracking-widest border border-background-light hover:bg-background-light transition-all active:scale-95 text-sm"
                    >
                        Ir al Inicio
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes pulse-subtle {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 4s infinite ease-in-out;
                }
                .filled-icon {
                    font-variation-settings: 'FILL' 1;
                }
            `}</style>
        </div>
    );
};

export default OrderSuccess;
