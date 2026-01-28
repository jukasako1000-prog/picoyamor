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
    const [reviews, setReviews] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'stock' | 'orders' | 'users' | 'reviews'>('stock');

    const [users, setUsers] = useState<any[]>([]);
    const [userSearch, setUserSearch] = useState('');
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
                .select('*');

            if (ordersError) throw ordersError;

            // Ordenar por fecha (descendente). Si no hay fecha, usar el ID.
            const sortedOrders = (ordersData || []).sort((a, b) => {
                const dateA = a.created_at || a.id;
                const dateB = b.created_at || b.id;
                return dateB > dateA ? 1 : -1;
            });
            setOrders(sortedOrders);

            // Fetch Users
            const { data: usersData, error: usersError } = await supabase
                .from('profiles')
                .select('*');

            if (!usersError) {
                const sortedUsers = (usersData || []).sort((a, b) => {
                    const dateA = a.created_at || a.id;
                    const dateB = b.created_at || b.id;
                    return dateB > dateA ? 1 : -1;
                });
                setUsers(sortedUsers);
            }

            // Fetch Reviews
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (!reviewsError) {
                setReviews(reviewsData || []);
            }

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('¿Estás seguro de que quieres borrar este cliente? Se borrará su perfil permanentemente.')) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            setUsers(users.filter(u => u.id !== userId));
            alert('Cliente borrado con éxito.');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('No se pudo borrar el cliente.');
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!window.confirm('¿Estás seguro de que quieres borrar esta reseña? Esta acción no se puede deshacer.')) return;

        try {
            const { error, count } = await supabase
                .from('reviews')
                .delete({ count: 'exact' })
                .eq('id', reviewId);

            if (error) throw error;

            if (count === 0) {
                alert('No se pudo borrar la reseña. Esto suele pasar si faltan permisos (RLS) en Supabase o si la reseña ya no existe.');
                return;
            }

            setReviews(reviews.filter(r => r.id !== reviewId));
            alert('Reseña borrada con éxito.');
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('No se pudo borrar la reseña.');
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('No se pudo actualizar el estado del pedido.');
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
            <div className="flex gap-4 mb-10 bg-white p-2 rounded-3xl shadow-sm border border-background-light w-full md:w-fit overflow-x-auto">
                <button
                    onClick={() => setActiveTab('stock')}
                    className={`shrink-0 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'stock' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-background-light'}`}
                >
                    Control de Stock
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`shrink-0 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-background-light'}`}
                >
                    Pedidos Realizados
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`shrink-0 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-background-light'}`}
                >
                    Gestión de Clientes
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`shrink-0 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'reviews' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-background-light'}`}
                >
                    Gestión de Reseñas
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Cargando datos del panel...</p>
                </div>
            ) : activeTab === 'stock' ? (
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
            ) : activeTab === 'orders' ? (
                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-background-light shadow-soft">
                            <span className="material-symbols-outlined text-6xl text-text-muted mb-4">shopping_basket</span>
                            <p className="text-xl font-black text-text-main">No hay pedidos todavía</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-soft border border-background-light space-y-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-background-light pb-6 relative">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                                <select
                                                    value={order.status || 'pagado'}
                                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                    className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase border-none focus:ring-2 focus:ring-primary cursor-pointer transition-all
                                                    ${order.status === 'enviado' ? 'bg-blue-100 text-blue-600' :
                                                            order.status === 'entregado' ? 'bg-green-100 text-green-600' :
                                                                'bg-primary/10 text-primary'}`}
                                                >
                                                    <option value="pagado">🟢 Pagado (Procesando)</option>
                                                    <option value="enviado">🔵 Enviado</option>
                                                    <option value="entregado">✅ Entregado</option>
                                                </select>
                                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">ID: {order.id.slice(0, 8)}</p>
                                            </div>
                                            <h3 className="text-xl font-black text-text-main uppercase tracking-tighter">
                                                {order.created_at ? new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Fecha no disponible'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Pedido</p>
                                                <p className="text-2xl font-black text-primary leading-none">{order.total.toFixed(2)}€</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="size-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                title="Borrar Pedido"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Datos del Cliente</p>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Nombre y Email</p>
                                                        <p className="text-sm font-bold text-text-main">{order.customer_name}</p>
                                                        <p className="text-xs text-text-muted">{order.customer_email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Dirección de Envío</p>
                                                        <p className="text-sm font-medium text-text-main">{order.customer_address}</p>
                                                        <p className="text-sm font-medium text-text-main">{order.customer_postal_code}, {order.customer_city}, {order.customer_province}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Teléfono</p>
                                                        <p className="text-sm font-bold text-text-main">{order.customer_phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Artículos</p>
                                            <div className="bg-background-light/30 rounded-3xl p-4 space-y-3">
                                                <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-background-light/50 pb-2 last:border-0 last:pb-0">
                                                            <div className="flex gap-2 items-center">
                                                                <span className="text-[10px] font-black bg-background-light px-2 py-0.5 rounded-md text-text-muted">{item.quantity}x</span>
                                                                <p className="font-bold text-text-main text-xs">{item.name}</p>
                                                            </div>
                                                            <p className="font-medium text-text-muted text-xs">{item.price.toFixed(2)}€</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-2 border-t border-background-light space-y-1">
                                                    <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase">
                                                        <span>Total Artículos</span>
                                                        <span>{(order.total - (order.shipping_cost || 0)).toFixed(2)}€</span>
                                                    </div>
                                                    {order.shipping_cost > 0 && (
                                                        <div className="flex justify-between items-center text-[10px] font-black text-primary uppercase">
                                                            <span>Gastos de Envío</span>
                                                            <span>{order.shipping_cost.toFixed(2)}€</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center pt-1 border-t border-background-light/50">
                                                        <p className="text-[10px] font-black text-text-main uppercase">Total Final</p>
                                                        <p className="font-black text-primary text-base">{order.total.toFixed(2)}€</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>)}
                </div>
            ) : activeTab === 'users' ? (
                <div className="space-y-8">
                    <div className="bg-white rounded-[3rem] p-8 border border-background-light shadow-soft flex flex-col lg:flex-row justify-between items-center gap-6">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                <span className="material-symbols-outlined text-3xl filled-icon">group</span>
                            </div>
                            <div className="flex-1 max-w-md relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl">search</span>
                                <input
                                    type="text"
                                    placeholder="Buscar cliente por nombre o email..."
                                    className="w-full bg-background-light border-none rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-primary text-sm font-medium"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-background-light/50 px-6 py-3 rounded-2xl border border-background-light min-w-[120px]">
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Clientes</p>
                                <p className="text-2xl font-black text-primary text-center leading-none mt-1">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    {users.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-background-light shadow-soft">
                            <p className="text-xl font-black text-text-main">No hay clientes todavía</p>
                            <p className="text-text-muted mt-2">Los nuevos usuarios aparecerán aquí automáticamente.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3rem] overflow-hidden border border-background-light shadow-soft">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-background-light/50 border-b border-background-light">
                                            <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Cliente</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Ubicación</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Pedidos</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Registro</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-background-light">
                                        {users
                                            .filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()))
                                            .map(u => {
                                                const userOrdersCount = orders.filter(o => o.customer_email === u.email).length;
                                                return (
                                                    <tr key={u.id} className="hover:bg-background-light/20 transition-colors">
                                                        <td className="px-8 py-6">
                                                            <p className="font-bold text-text-main text-sm">{u.name}</p>
                                                            <p className="text-xs text-text-muted">{u.email}</p>
                                                            <p className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-tighter">{u.phone}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="text-xs font-bold text-text-main uppercase">{u.city}</p>
                                                            <p className="text-[10px] text-text-muted uppercase">{u.province}</p>
                                                        </td>
                                                        <td className="px-8 py-6 text-center">
                                                            <span className={`inline-flex items-center justify-center size-8 rounded-full font-black text-xs ${userOrdersCount > 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-background-light text-text-muted'}`}>
                                                                {userOrdersCount}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="text-xs font-medium text-text-muted">
                                                                {new Date(u.created_at).toLocaleDateString()}
                                                            </p>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => alert(`Dirección Completa:\n${u.address}\n${u.postal_code} ${u.city}, ${u.province}`)}
                                                                    className="size-10 bg-background-light text-text-main rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                                                                    title="Ver dirección completa"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">location_on</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(u.id)}
                                                                    className="size-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                                    title="Borrar cliente"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-background-light shadow-soft">
                            <span className="material-symbols-outlined text-6xl text-text-muted mb-4">rate_review</span>
                            <p className="text-xl font-black text-text-main">No hay reseñas todavía</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-background-light flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'text-primary filled-icon' : 'text-text-muted/20'}`}>grade</span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>

                                    <p className="text-sm font-bold text-text-main leading-relaxed mb-4 italic flex-grow">
                                        "{review.text}"
                                    </p>

                                    {review.image_url && (
                                        <div className="mb-4 rounded-xl overflow-hidden border border-background-light bg-background-light/20">
                                            <img
                                                src={review.image_url}
                                                alt=""
                                                className="w-full h-auto max-h-[300px] object-contain block mx-auto"
                                            />
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-background-light flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs uppercase">
                                            {review.name[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-text-main text-xs truncate">{review.name}</p>
                                            <p className="text-[10px] font-bold text-primary truncate">{review.bird_name}</p>
                                        </div>
                                        <p className="ml-auto text-[8px] font-black uppercase text-text-muted">{new Date(review.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <style>{`
                @keyframes bounceIn {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .filled-icon { font-variation-settings: 'FILL' 1; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Admin;

