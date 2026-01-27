import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';

const Admin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [stockLevels, setStockLevels] = useState<Record<string, number>>({});
    const [orders, setOrders] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'stock' | 'orders' | 'users'>('stock');

    const navigate = useNavigate();
    const ADMIN_EMAIL = 'infopicoyamor@gmail.com';

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.email === ADMIN_EMAIL) {
                setSession(session);
                fetchData();
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email === ADMIN_EMAIL) {
                setSession(session);
                fetchData();
            } else {
                setSession(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Stock
            const { data: stockData, error: stockError } = await supabase
                .from('products')
                .select('*')
                .order('name');
            if (stockError) throw stockError;

            const levels = stockData.reduce((acc, curr) => ({
                ...acc,
                [curr.id]: curr.stock_quantity
            }), {});
            setStockLevels(levels);

            // Fetch Orders
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });
            if (ordersError) throw ordersError;
            setOrders(ordersData);

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!window.confirm('¿Estás segura de que quieres borrar este pedido? Esta acción no se puede deshacer.')) return;

        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId);

            if (error) throw error;
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('No se pudo borrar el pedido.');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (email !== ADMIN_EMAIL) {
                throw new Error('No tienes permisos de administrador.');
            }
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    const updateStockUI = async (productId: string, delta: number) => {
        const currentStock = stockLevels[productId] || 0;
        const newStock = Math.max(0, currentStock + delta);

        try {
            const { error } = await supabase
                .from('products')
                .update({ stock_quantity: newStock })
                .eq('id', productId);

            if (error) throw error;
            setStockLevels(prev => ({ ...prev, [productId]: newStock }));
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Error al actualizar el stock');
        }
    };

    // Helper component for manual stock input
    const StockInput = ({ initialValue, onSave }: { initialValue: number, onSave: (val: number) => void }) => {
        const [localValue, setLocalValue] = useState(initialValue.toString());
        const [isSaving, setIsSaving] = useState(false);

        useEffect(() => {
            setLocalValue(initialValue.toString());
        }, [initialValue]);

        const handleBlur = () => {
            const val = parseInt(localValue);
            if (!isNaN(val) && val !== initialValue) {
                setIsSaving(true);
                onSave(val);
                setTimeout(() => setIsSaving(false), 1000);
            } else {
                setLocalValue(initialValue.toString());
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
            }
        };

        return (
            <div className="relative">
                <input
                    type="number"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`text-xl font-black w-20 text-center bg-white/50 rounded-lg border-2 border-transparent focus:border-primary/30 focus:ring-0 transition-all ${parseInt(localValue) === 0 ? 'text-red-500' : 'text-text-main'} ${isSaving ? 'bg-green-50' : ''}`}
                />
                {isSaving && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-green-500 uppercase animate-bounce">
                        Guardado
                    </div>
                )}
            </div>
        );
    };

    if (!session) {
        return (
            <div className="pt-40 pb-20 px-4 flex flex-col items-center justify-center min-h-screen bg-background-light/30">
                <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl border border-background-light">
                    <div className="text-center mb-10">
                        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl filled-icon">lock</span>
                        </div>
                        <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase">Panel de Gestión</h2>
                        <p className="text-text-muted text-sm font-medium mt-2">Acceso exclusivo para administradores</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Entrando...' : 'Entrar al Panel'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-text-main tracking-tighter uppercase">Gestión de Tienda</h1>
                    <p className="text-text-muted font-bold text-sm">Bienvenida, {session.user.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-white border-2 border-background-light text-text-muted hover:text-red-500 hover:border-red-100 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Cerrar Sesión
                </button>
            </div>

            {/* Alternador de Pestañas */}
            <div className="flex gap-4 mb-10 bg-white p-2 rounded-3xl shadow-sm border border-background-light w-full md:w-fit">
                <button
                    onClick={() => setActiveTab('stock')}
                    className={`flex-1 md:flex-none px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'stock' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-background-light'}`}
                >
                    Control de Stock
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 md:flex-none px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-background-light'}`}
                >
                    Pedidos Realizados
                </button>
            </div>

            {activeTab === 'stock' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PRODUCTS.map(product => {
                        const stock = stockLevels[product.id] || 0;
                        return (
                            <div key={product.id} className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-background-light group hover:border-primary/20 transition-all">
                                <div className="flex gap-4 items-center mb-6">
                                    <div className="size-14 rounded-2xl overflow-hidden bg-background-light/50 border border-background-light shrink-0">
                                        <img src={product.image} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black text-xs text-text-main uppercase truncate">{product.name}</h4>
                                        <p className="text-[10px] text-text-muted font-bold">ID: {product.id}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-background-light/50 p-4 rounded-3xl">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">Stock Actual</span>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => updateStockUI(product.id, -1)}
                                            className="size-10 bg-white rounded-xl flex items-center justify-center text-text-main hover:bg-red-50 hover:text-red-500 transition-all border border-background-light"
                                        >
                                            <span className="material-symbols-outlined text-lg">remove</span>
                                        </button>

                                        <StockInput
                                            initialValue={stock}
                                            onSave={(val) => updateStockUI(product.id, val - stock)}
                                        />

                                        <button
                                            onClick={() => updateStockUI(product.id, 1)}
                                            className="size-10 bg-white rounded-xl flex items-center justify-center text-text-main hover:bg-primary/10 hover:text-primary transition-all border border-background-light"
                                        >
                                            <span className="material-symbols-outlined text-lg">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-background-light">
                            <p className="text-text-muted font-black uppercase tracking-widest">No hay pedidos registrados todavía</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-soft border border-background-light space-y-8">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-background-light pb-8 relative">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase">PAGADO</span>
                                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">ID PEDIDO: {order.id.slice(0, 8)}</p>
                                        </div>
                                        <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter">
                                            {new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Total Pedido</p>
                                            <p className="text-3xl font-black text-primary">{order.total.toFixed(2)}€</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="size-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            title="Borrar pedido"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Datos del Cliente</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-text-muted uppercase">Nombre</p>
                                                <p className="font-bold text-text-main">{order.customer_name}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-text-muted uppercase">Teléfono</p>
                                                <p className="font-bold text-text-main">{order.customer_phone}</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <p className="text-[9px] font-black text-text-muted uppercase">Email</p>
                                                <p className="font-bold text-text-main">{order.customer_email}</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <p className="text-[9px] font-black text-text-muted uppercase">Dirección</p>
                                                <p className="font-bold text-text-main">{order.customer_address}</p>
                                                <p className="text-xs text-text-muted font-medium">{order.customer_postal_code} - {order.customer_city} ({order.customer_province})</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Productos</h4>
                                        <div className="bg-background-light/30 rounded-3xl p-6 space-y-4">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-black text-primary">x{item.quantity}</span>
                                                        <span className="font-bold text-text-main uppercase text-[11px]">{item.name}</span>
                                                    </div>
                                                    <span className="font-black text-text-muted">{item.price.toFixed(2)}€</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;
