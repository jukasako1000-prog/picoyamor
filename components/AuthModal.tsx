import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { saveProfile } from '../lib/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  initialMode?: 'login' | 'register' | 'guest';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'guest' | 'forgot' | 'update'>(initialMode);
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
  const [success, setSuccess] = useState<string | null>(null);

  // Limpiar estados al cambiar de modo
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [mode]);

  // Sincronizar modo inicial cuando se abre el modal
  useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Escuchar evento de recuperación de contraseña
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!validatePassword(formData.password || '')) {
          setLoading(false);
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password || '',
        });

        if (authError) throw authError;

        if (authData.user) {
          const profileData = {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            province: formData.province,
            postal_code: formData.postalCode,
            phone: formData.phone
          };

          await saveProfile(authData.user.id, profileData);
          onLogin({ ...formData, id: authData.user.id, isGuest: false });
          alert('¡Cuenta creada con éxito! Bienvenido a la bandada 🦜✨');
          onClose();
        }
      } else if (mode === 'login') {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password || '',
        });

        if (authError) throw authError;

        if (authData.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (!profileError && profile) {
            onLogin({
              id: authData.user.id,
              name: profile.name,
              email: profile.email,
              address: profile.address,
              city: profile.city,
              province: profile.province,
              postalCode: profile.postal_code,
              phone: profile.phone,
              isGuest: false
            });
          } else {
            onLogin({ ...formData, id: authData.user.id, email: authData.user.email || '', isGuest: false });
          }
          onClose();
        }
      } else if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: window.location.origin + (window.location.pathname === '/' ? '' : window.location.pathname) + '#/',
        });
        if (resetError) throw resetError;
        setSuccess('¡Email de recuperación enviado! Revisa tu bandeja de entrada o spam.');
      } else if (mode === 'update') {
        if (!validatePassword(formData.password || '')) {
          setLoading(false);
          return;
        }
        const { error: updateError } = await supabase.auth.updateUser({
          password: formData.password
        });
        if (updateError) throw updateError;
        alert('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.');
        setMode('login');
      } else if (mode === 'guest') {
        onLogin({ ...formData, isGuest: true });
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
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
              {mode === 'register' ? 'person_add' :
                mode === 'guest' ? 'local_shipping' :
                  mode === 'forgot' ? 'lock_reset' :
                    mode === 'update' ? 'lock_open' :
                      'account_circle'}
            </span>
          </div>
          <h2 className="text-xl font-black">
            {mode === 'register' ? 'Únete a la Bandada' :
              mode === 'guest' ? 'Pedido Invitado' :
                mode === 'forgot' ? 'Recuperar Cuenta' :
                  mode === 'update' ? 'Nueva Contraseña' :
                    'Bienvenido de nuevo'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto hide-scrollbar">
          {success && (
            <div className="bg-green-50 border-2 border-green-100 p-4 rounded-2xl flex items-center gap-3 animate-fade-in mb-4">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              <p className="text-sm font-bold text-green-700">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-fade-in mb-4">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="text-sm font-bold text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(mode === 'register' || mode === 'guest') && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-text-muted ml-2">Nombre Completo</label>
                <input required name="name" type="text" placeholder="Ej. Juan Pérez" className="w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all text-text-main font-medium" value={formData.name} onChange={handleChange} />
              </div>
            )}

            {mode !== 'update' && (
              <div className={`space-y-1 ${mode === 'forgot' ? 'md:col-span-2' : ''}`}>
                <label className="text-[10px] font-black uppercase text-text-muted ml-2">Email</label>
                <input required name="email" type="email" placeholder="tu@email.com" className="w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all text-text-main font-medium" value={formData.email} onChange={handleChange} />
              </div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'update') && (
              <div className={`space-y-1 ${mode === 'update' ? 'md:col-span-2' : ''}`}>
                <label className="text-[10px] font-black uppercase text-text-muted ml-2">
                  {mode === 'update' ? 'Nueva Contraseña' : 'Contraseña'}
                </label>
                <input
                  required
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-background-light border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all text-text-main font-medium"
                  value={formData.password}
                  onChange={handleChange}
                />
                {mode !== 'login' && (
                  <p className="text-[9px] text-text-muted ml-2 italic">Mín. 8 caracteres, letras y números.</p>
                )}
              </div>
            )}

            {(mode === 'register' || mode === 'guest') && (
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
            {loading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
              mode === 'register' ? 'Crear mi Cuenta' :
                mode === 'guest' ? 'Continuar como Invitado' :
                  mode === 'forgot' ? 'Enviar enlace de recuperación' :
                    mode === 'update' ? 'Cambiar Contraseña' :
                      'Iniciar Sesión'
            )}
          </button>

          <div className="text-center pt-4 space-y-4">
            {mode === 'login' && (
              <button type="button" onClick={() => setMode('forgot')} className="text-xs font-bold text-primary hover:underline block mx-auto">
                ¿Has olvidado tu contraseña?
              </button>
            )}

            {(mode === 'login' || mode === 'register') && (
              <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm font-bold text-text-muted hover:text-primary transition-colors block w-full">
                {mode === 'login' ? '¿Eres nuevo? Regístrate aquí' : '¿Ya tienes cuenta? Entra aquí'}
              </button>
            )}

            {(mode === 'forgot' || mode === 'update') && (
              <button type="button" onClick={() => setMode('login')} className="text-sm font-bold text-text-muted hover:text-primary transition-colors block w-full">
                Volver al inicio de sesión
              </button>
            )}

            {(mode === 'login' || mode === 'register') && (
              <div className="pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setMode('guest')} className="text-sm font-black text-primary hover:text-primary-hover transition-colors flex items-center justify-center gap-1 mx-auto">
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  Comprar como invitado
                </button>
              </div>
            )}

            {mode === 'guest' && (
              <button type="button" onClick={() => setMode('login')} className="text-xs font-bold text-text-muted hover:text-primary transition-colors">
                Volver al inicio de sesión
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
