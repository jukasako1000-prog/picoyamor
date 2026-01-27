import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';

const Admin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [stockLevels, setStockLevels] = useState<Record<string, number>>({});
    const [editedStock, setEditedStock] = useState<Record<string, number>>({});
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
            setEditedStock(levels);

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

    const handleSaveAllStock = async () => {
        setSaving(true);
        try {
            const updates = Object.entries(editedStock)
                .filter(([id, val]) => val !== stockLevels[id])
                .map(([id, val]) => ({ id, stock_quantity: val }));

            if (updates.length === 0) return;

            for (const update of updates) {
                const { error } = await supabase
                    .from('products')
                    .update({ stock_quantity: update.stock_quantity })
                    .eq('id', update.id);
                if (error) throw error;
            }

            setStockLevels({ ...editedStock });
            alert('¡Cambios guardados correctamente!');
        } catch (error: any) {
            console.error('Error saving stock:', error);
            alert('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
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
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            if (data.user?.email !== ADMIN_EMAIL) {
                await supabase.auth.signOut();
                throw new Error('No tienes permisos de administrador.');
            }
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

    const updateEditedStock = (productId: string, newVal: number) => {
        const val = Math.max(0, newVal);
        setEditedStock(prev => ({ ...prev, [productId]: val }));
    };

    const hasChanges = Object.entries(editedStock).some(([id, val]) => val !== stockLevels[id]);

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
                                className="w-full bg-background-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all font-bold text-text-main"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all font-bold text-text-main"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                            {loading ? 'Entrando...' : 'Entrar al Panel'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-40 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter uppercase">Gestión de Tienda</h1>
                    <p className="text-text-muted font-medium">Gestiona el inventario y revisa los últimos pedidos.</p>
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
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRODUCTS.map(product => {
                            const stock = editedStock[product.id] || 0;
                            const isModified = stock !== stockLevels[product.id];
                            return (
                                <div key={product.id} className={`bg-white rounded-[2.5rem] p-6 shadow-soft border transition-all ${isModified ? 'border-orange-400 ring-2 ring-orange-100' : 'border-background-light'}`}>
                                    <div className="flex gap-4 items-center mb-6">
                                        <div className="size-14 rounded-2xl overflow-hidden bg-background-light/50 border border-background-light shrink-0">
                                            <img src={product.image} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-xs text-text-main uppercase truncate">{product.name}</h4>
                                            <p className="text-[10px] text-text-muted font-bold">ID: {product.id}</p>
                                        </div>
                                        {isModified && (
                                            <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-2 py-1 rounded-md uppercase ml-auto">Modificado</span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between bg-background-light/50 p-4 rounded-3xl">
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">Stock</span>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => updateEditedStock(product.id, stock - 1)}
                                                className="size-10 bg-white rounded-xl flex items-center justify-center text-text-main hover:bg-red-50 hover:text-red-500 transition-all border border-background-light"
                                            >
                                                <span className="material-symbols-outlined text-lg">remove</span>
                                            </button>

                                            <input
                                                type="number"
                                                value={stock}
                                                onChange={(e) => updateEditedStock(product.id, parseInt(e.target.value) || 0)}
                                                className={`text-xl font-black w-20 text-center bg-white/50 rounded-lg border-2 border-transparent focus:border-primary/30 focus:ring-0 transition-all ${stock === 0 ? 'text-red-500' : 'text-text-main'}`}
                                            />

                                            <button
                                                onClick={() => updateEditedStock(product.id, stock + 1)}
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

                    {/* Botón Flotante de Guardar */}
                    {hasChanges && (
                        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
                            <button
                                onClick={handleSaveAllStock}
                                disabled={saving}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-[0_20px_50px_rgba(249,115,22,0.3)] flex items-center gap-4 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <div className="size-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">save</span>
                                        Guardar todos los cambios
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-background-light shadow-soft">
                            <span className="material-symbols-outlined text-6xl text-text-muted mb-4">shopping_basket</span>
                            <p className="text-xl font-black text-text-main">No hay pedidos todavía</p>
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
                                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Datos del Cliente</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Nombre y Email</p>
                                                <p className="text-lg font-bold text-text-main">{order.customer_name}</p>
                                                <p className="text-text-muted font-medium">{order.customer_email}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Dirección de Envío</p>
                                                <p className="font-bold text-text-main">{order.shipping_address}</p>
                                                <p className="text-text-muted font-medium">{order.shipping_city}, {order.shipping_province}, {order.shipping_zip}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Teléfono</p>
                                                <p className="font-bold text-text-main">{order.customer_phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Artículos</h4>
                                        <div className="bg-background-light/30 rounded-3xl p-6 space-y-4">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex gap-3 items-center">
                                                        <span className="bg-white size-6 flex items-center justify-center rounded-lg font-black text-[10px] text-primary select-none">{item.quantity}x</span>
                                                        <span className="font-bold text-text-main">{item.name}</span>
                                                    </div>
                                                    <span className="font-black text-text-main">{(item.price * item.quantity).toFixed(2)}€</span>
                                                </div>
                                            ))}
                                            <div className="pt-4 border-t border-background-light flex justify-between items-center text-xs">
                                                <span className="font-black text-text-muted uppercase tracking-widest lowercase">Envío ({order.shipping_method})</span>
                                                <span className="font-black text-text-main">{order.shipping_cost.toFixed(2)}€</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            <style>{`
                @keyframes bounceIn {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            `}</style>
        </div>
    );
};

export default Admin;
