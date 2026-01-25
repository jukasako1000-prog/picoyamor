
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState<UserProfile & { password?: string }>({ 
    name: '', 
    email: '', 
    address: '', 
    city: '', 
    province: '', 
    postalCode: '', 
    phone: '',
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Limpiar errores al cambiar de modo
  useEffect(() => {
    setError(null);
  }, [isRegister]);

  if (!isOpen) return null;

  const validatePassword = (pass: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const isLongEnough = pass.length >= 8;
    
    if (!isLongEnough) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }
    if (!hasLetter || !hasNumber) {
      setError('La contraseña debe incluir letras y números.');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      if (!validatePassword(formData.password || '')) {
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      onLogin({ ...formData });
      setLoading(false);
      onClose();
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Limpiar error mientras escribe
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        <div className="bg-primary p-6 text-white text-center relative shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 hover:rotate-90 transition-transform">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="size-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-2xl filled-icon">
              {isRegister ? 'person_add' : 'account_circle'}
            </span>
          </div>
          <h2 className="text-xl font-black">
            {isRegister ? 'Únete a la Bandada' : 'Bienvenido de nuevo'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto hide-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isRegister && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-text-muted ml-2">Nombre Completo</label>
                <input required name="name" type="text" placeholder="Ej. Juan Pérez" className="w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all text-text-main font-medium" value={formData.name} onChange={handleChange} />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-muted ml-2">Email</label>
              <input required name="email" type="email" placeholder="tu@email.com" className="w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all text-text-main font-medium" value={formData.email} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-muted ml-2">Contraseña</label>
              <input 
                required 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                className={`w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 transition-all text-text-main font-medium ${error ? 'ring-2 ring-red-400' : 'focus:ring-primary'}`} 
                value={formData.password} 
                onChange={handleChange} 
              />
              {isRegister && !error && (
                <p className="text-[9px] text-text-muted ml-2 italic">Mín. 8 caracteres, letras y números.</p>
              )}
              {isRegister && error && (
                <p className="text-[10px] text-red-500 font-bold ml-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">error</span> {error}
                </p>
              )}
            </div>

            {isRegister && (
              <>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Dirección</label>
                  <input required name="address" type="text" placeholder="Calle, número, piso..." className="w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all text-text-main font-medium" value={formData.address} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Localidad</label>
                  <input required name="city" type="text" placeholder="Valencia" className="w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all text-text-main font-medium" value={formData.city} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Provincia</label>
                  <input required name="province" type="text" placeholder="Valencia" className="w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all text-text-main font-medium" value={formData.province} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Código Postal</label>
                  <input required name="postalCode" type="text" placeholder="46001" className="w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all text-text-main font-medium" value={formData.postalCode} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Teléfono</label>
                  <input required name="phone" type="tel" placeholder="600 000 000" className="w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all text-text-main font-medium" value={formData.phone} onChange={handleChange} />
                </div>
              </>
            )}
          </div>

          <button disabled={loading} className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4">
            {loading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isRegister ? 'Crear mi Cuenta' : 'Iniciar Sesión')}
          </button>

          <div className="text-center pt-2">
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-sm font-bold text-text-muted hover:text-primary transition-colors">
              {isRegister ? '¿Ya tienes cuenta? Entra aquí' : '¿Eres nuevo? Regístrate aquí'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
