
import React, { useState } from 'react';
import { UserProfile, Order } from '../types';

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

  if (!user) {
    return (
      <div className="pt-40 pb-20 text-center px-4">
        <h2 className="text-3xl font-black mb-4">Acceso Denegado</h2>
        <p className="text-text-muted mb-8">Debes iniciar sesión para ver tu perfil.</p>
        <a href="#/" className="bg-primary text-white px-8 py-3 rounded-full font-bold">Volver al Inicio</a>
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    alert('¡Perfil actualizado con éxito! 🦜');
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
                    <input className="w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Email</label>
                    <input disabled className="w-full bg-background-light border-none rounded-2xl px-6 py-4 opacity-60 cursor-not-allowed shadow-inner" value={formData.email} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Dirección de Envío</label>
                    <input className="w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Localidad</label>
                    <input className="w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Provincia</label>
                    <input className="w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner" value={formData.province} onChange={e => setFormData({ ...formData, province: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Código Postal</label>
                    <input className="w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner" value={formData.postalCode} onChange={e => setFormData({ ...formData, postalCode: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Teléfono</label>
                    <input className="w-full bg-background-light border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-inner" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                {user.isGuest ? (
                  <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">person_add</span>
                      </div>
                      <div>
                        <p className="font-black text-text-main text-sm uppercase tracking-wide">¿Quieres que guardemos tus datos?</p>
                        <p className="text-xs text-text-muted">Crea una cuenta para no tener que rellenar esto en tu próximo pedido.</p>
                      </div>
                    </div>
                    <button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary-hover text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95 text-xs uppercase tracking-widest whitespace-nowrap">
                      Registrarme ahora
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="mt-8 bg-primary hover:bg-primary-hover text-white font-black px-12 py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 text-sm"
                  >
                    Guardar Cambios
                  </button>
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
                  orders.map((order) => (
                    <div key={order.id} className="bg-background-light/50 border border-background-light p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/20 transition-colors">
                      <div>
                        <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">{order.date}</p>
                        <h4 className="font-bold text-lg">{order.id}</h4>
                        <p className="text-sm text-text-muted">{order.items.join(', ')}</p>
                      </div>
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-xl font-black">{order.total.toFixed(2)}€</p>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${order.status === 'Entregado' ? 'bg-green-100 text-green-600' :
                              order.status === 'Procesando' ? 'bg-blue-100 text-blue-600' :
                                'bg-yellow-100 text-yellow-600'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="size-10 bg-white rounded-full shadow-sm flex items-center justify-center text-text-muted hover:text-primary transition-colors border border-background-light hover:border-primary"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </div>
                    </div>
                  ))
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
                <h3 className="text-xl font-black">{selectedOrder.id}</h3>
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
                    <p className="font-bold">{selectedOrder.date}</p>
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
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-background-light p-3 rounded-2xl">
                      <div className="size-8 bg-white rounded-lg flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-sm">inventory_2</span>
                      </div>
                      <span className="font-bold text-sm text-text-main">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex justify-between items-center">
                <p className="text-lg font-bold text-text-main">Total Pagado</p>
                <p className="text-3xl font-black text-primary">{selectedOrder.total.toFixed(2)}€</p>
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
