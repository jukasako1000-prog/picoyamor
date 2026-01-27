import React, { useState } from 'react';
import { UserProfile, Order } from '../types';
import { saveProfile } from '../lib/db';

interface ProfileProps {
  user: UserProfile | null;
  orders: Order[];
  onUpdateUser: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, orders, onUpdateUser }) => {
  const [formData, setFormData] = useState<UserProfile>(user || {
    name: '', email: '', address: '', city: '', province: '', postalCode: '', phone: ''
  });
  const [activeTab, setActiveTab] = useState<'details' | 'orders'>('details');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const hasChanges = user ? (
    formData.name !== user.name ||
    formData.address !== user.address ||
    formData.city !== user.city ||
    formData.province !== user.province ||
    formData.postalCode !== user.postalCode ||
    formData.phone !== user.phone
  ) : false;

  if (!user) {
    return (
      <div className="pt-40 pb-20 text-center px-4">
        <h2 className="text-3xl font-black mb-4">Acceso Denegado</h2>
        <p className="text-text-muted mb-8">Debes iniciar sesión para ver tu perfil.</p>
        <a href="#/" className="bg-primary text-white px-8 py-3 rounded-full font-bold">Volver al Inicio</a>
      </div>
    );
  }

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.id) {
      alert('Error: ID de usuario no encontrado. Reintenta iniciar sesión.');
      return;
    }

    setLoading(true);
    try {
      const dbData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postalCode,
        phone: formData.phone
      };

      await saveProfile(user.id, dbData);
      onUpdateUser(formData);
      setIsEditing(false);
      alert('¡Perfil actualizado con éxito! 🦜✨');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4 shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-soft text-center">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <span className="material-symbols-outlined text-4xl filled-icon">account_circle</span>
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-black text-text-main leading-tight uppercase tracking-tighter">
                {user.isGuest ? 'Perfil Invitado' : user.name}
              </h2>
              <p className="text-sm font-medium text-text-muted">{user.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'details' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-background-light'
                }`}
            >
              <span className="material-symbols-outlined text-xl">
                {user.isGuest ? 'contact_page' : 'edit_document'}
              </span>
              {user.isGuest ? 'Datos de Envío' : 'Mis Datos'}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-background-light'}`}
            >
              <span className="material-symbols-outlined text-sm">inventory_2</span> Mis Pedidos
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[3rem] shadow-soft overflow-hidden border border-background-light">
          {activeTab === 'details' ? (
            <div className="p-8 md:p-12 space-y-8 animate-fade-in">
              <h2 className="text-3xl font-black text-text-main">Mis Datos Personales</h2>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Nombre Completo</label>
                    <input
                      disabled={!isEditing}
                      className={`w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner transition-all ${!isEditing ? 'opacity-60 grayscale-[0.5]' : ''}`}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Email</label>
                    <input disabled className="w-full bg-background-light border-none rounded-2xl px-6 py-4 opacity-40 cursor-not-allowed shadow-inner grayscale" value={formData.email} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Dirección de Envío</label>
                    <input
                      disabled={!isEditing}
                      className={`w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner transition-all ${!isEditing ? 'opacity-60 grayscale-[0.5]' : ''}`}
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Localidad</label>
                    <input
                      disabled={!isEditing}
                      className={`w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner transition-all ${!isEditing ? 'opacity-60 grayscale-[0.5]' : ''}`}
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Provincia</label>
                    <input
                      disabled={!isEditing}
                      className={`w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner transition-all ${!isEditing ? 'opacity-60 grayscale-[0.5]' : ''}`}
                      value={formData.province}
                      onChange={e => setFormData({ ...formData, province: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Código Postal</label>
                    <input
                      disabled={!isEditing}
                      className={`w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner transition-all ${!isEditing ? 'opacity-60 grayscale-[0.5]' : ''}`}
                      value={formData.postalCode}
                      onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Teléfono</label>
                    <input
                      disabled={!isEditing}
                      className={`w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner transition-all ${!isEditing ? 'opacity-60 grayscale-[0.5]' : ''}`}
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                {user.isGuest ? (
                  // ... (guest section remains the same)

                  <div className="mt-8 p-8 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in shadow-xl shadow-primary/5">
                    <div className="flex items-center gap-5">
                      <div className="size-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-3xl filled-icon">person_add</span>
                      </div>
                      <div>
                        <p className="font-black text-text-main text-lg uppercase tracking-tight">¿Quieres guardar tus datos?</p>
                        <p className="text-sm text-text-muted font-medium">Crea una cuenta para no tener que rellenar esto en tu próximo pedido.</p>
                      </div>
                    </div>
                    <button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary-hover text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-95 text-xs uppercase tracking-widest whitespace-nowrap">
                      Registrarme ahora
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-4 mt-8">
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-primary hover:bg-primary-hover text-white font-black px-12 py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-95 text-xs uppercase tracking-widest flex items-center gap-3"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                        Editar Datos
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-background-light hover:bg-gray-100 text-text-muted font-black px-12 py-5 rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center gap-3 border border-background-light"
                      >
                        <span className="material-symbols-outlined text-xl">close</span>
                        Cancelar
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={!isEditing || !hasChanges || loading}
                      className={`px-12 py-5 rounded-2xl font-black transition-all text-xs uppercase tracking-widest flex items-center gap-3
                        ${(!isEditing || !hasChanges)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-900/10 active:scale-95'
                        }`}
                    >
                      {loading ? (
                        <>
                          <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-xl">save</span>
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="p-8 md:p-12 space-y-8 animate-fade-in">
              <h2 className="text-3xl font-black text-text-main">Historial de Pedidos</h2>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="py-12 text-center space-y-4">
                    <span className="material-symbols-outlined text-5xl text-text-muted">receipt_long</span>
                    <p className="text-text-muted font-bold">Aún no has realizado ningún pedido.</p>
                  </div>
                ) : (
                  orders.map((order) => {
                    const orderDate = order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : order.date;

                    const itemsList = Array.isArray(order.items) && typeof order.items[0] === 'object'
                      ? order.items.map((item: any) => `${item.quantity}x ${item.name}`).join(', ')
                      : Array.isArray(order.items) ? order.items.join(', ') : 'Detalles no disponibles';

                    return (
                      <div key={order.id} className="bg-background-light/50 border border-background-light p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/20 transition-colors">
                        <div>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{orderDate}</p>
                          <h4 className="font-bold text-lg uppercase tracking-tight">Pedido #{order.id.slice(0, 8)}</h4>
                          <p className="text-xs text-text-muted font-medium italic">{itemsList}</p>
                        </div>
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right">
                            <p className="text-xl font-black">{order.total.toFixed(2)}€</p>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase
                                ${order.status === 'enviado' ? 'bg-blue-100 text-blue-600' :
                                  order.status === 'entregado' ? 'bg-green-100 text-green-600' :
                                    'bg-primary/10 text-primary'}`}>
                                {order.status === 'enviado' ? 'Enviado 📦' :
                                  order.status === 'entregado' ? 'Entregado ✅' :
                                    'Pagado (Procesando) 🦜'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="size-10 bg-white rounded-full shadow-sm flex items-center justify-center text-text-muted hover:text-primary transition-colors border border-background-light hover:border-primary"
                          >
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles del Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase opacity-70">Resumen de Pedido</p>
                <h3 className="text-xl font-black uppercase">Pedido #{selectedOrder.id.slice(0, 8)}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="size-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-background-light rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase">Fecha de compra</p>
                    <p className="font-bold">
                      {selectedOrder.created_at
                        ? new Date(selectedOrder.created_at).toLocaleDateString()
                        : selectedOrder.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-text-muted uppercase">Estado</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedOrder.status === 'Entregado' ? 'bg-green-100 text-green-600' :
                    selectedOrder.status === 'Procesando' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-black text-text-muted uppercase tracking-widest border-b pb-2">Productos incluidos</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, idx) => {
                    const itemName = typeof item === 'object' ? item.name : item;
                    const itemQty = typeof item === 'object' ? item.quantity : 1;
                    return (
                      <div key={idx} className="flex items-center justify-between bg-background-light p-4 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="size-8 bg-white rounded-lg flex items-center justify-center text-primary border border-background-light shadow-sm">
                            <span className="font-black text-[10px]">{itemQty}x</span>
                          </div>
                          <span className="font-bold text-sm text-text-main">{itemName}</span>
                        </div>
                        {typeof item === 'object' && item.price && (
                          <span className="text-xs font-bold text-text-muted">{(item.price * itemQty).toFixed(2)}€</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                  <span>Productos</span>
                  <span>{(selectedOrder.total - (selectedOrder.shipping_cost || 0)).toFixed(2)}€</span>
                </div>
                {selectedOrder.shipping_cost > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-primary">
                    <span>Gastos de Envío</span>
                    <span>{selectedOrder.shipping_cost.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-background-light">
                  <p className="text-lg font-black text-text-main">Total Pagado</p>
                  <p className="text-2xl font-black text-primary">{selectedOrder.total.toFixed(2)}€</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-background-light hover:bg-gray-100 text-text-main py-4 rounded-2xl font-bold transition-all active:scale-[0.98]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Profile;
