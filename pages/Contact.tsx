
import React, { useState } from 'react';
import { IMG_CONTACT_MAIN } from '../constants';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      motivo: formData.get('motivo'),
      mensaje: formData.get('mensaje')
    };

    try {
      // Guardamos el mensaje en una nueva tabla 'contact_messages'
      // Esto disparará el email automáticamente igual que con los pedidos
      const { error } = await supabase
        .from('contact_messages')
        .insert([data]);

      if (!error) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 10000);
      } else {
        console.error('Error from Supabase:', error);
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  return (
    <div className="relative pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
      {/* Logo de Marca Flotante - TAMAÑO REDUCIDO */}
      <div className="absolute top-40 right-6 md:top-60 md:right-16 lg:right-32 z-30 pointer-events-none select-none">
        <div className="size-16 md:size-32 lg:size-36 rounded-full border-[5px] md:border-[7px] border-white shadow-[0_30px_70px_rgba(0,0,0,0.2)] overflow-hidden animate-float-slow bg-white">
          <img
            src="https://i.postimg.cc/Gpywxh9s/Whats-App-Image-2026-01-11-at-15-24-14.jpg"
            alt="Pico & Amor Seal"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="text-center md:text-left space-y-4 max-w-2xl relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm">mail</span> Hablemos
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">Contacto</h1>
        <p className="text-lg text-text-muted leading-relaxed font-medium">
          ¿Tienes dudas? Estamos aquí para ayudarte a crear un entorno feliz y seguro para tu agapornis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
        <div className="lg:col-span-7 bg-white rounded-[3rem] p-8 md:p-16 shadow-soft border border-background-light space-y-12">
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-24 animate-fade-in">
              <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-5xl filled-icon">check_circle</span>
              </div>
              <h3 className="text-3xl font-black">¡Mensaje Recibido!</h3>
              <p className="text-xl text-text-muted font-medium">Te responderemos a tu email en menos de 24 horas. ¡Gracias por confiar!</p>
              <button onClick={() => setStatus('idle')} className="text-primary font-black text-lg underline underline-offset-8">Enviar otro mensaje</button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-text-main">Envíanos un mensaje</h3>
                {status === 'error' && (
                  <span className="text-red-500 text-xs font-bold animate-pulse">Ocurrió un error. Inténtalo de nuevo.</span>
                )}
              </div>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-text-muted ml-4 tracking-widest">Nombre</label>
                    <input required name="nombre" type="text" placeholder="Tu nombre" className="w-full bg-background-light border-none rounded-[1.5rem] px-8 py-5 focus:ring-4 focus:ring-primary/20 transition-all shadow-inner text-lg font-medium" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-text-muted ml-4 tracking-widest">Email</label>
                    <input required name="email" type="email" placeholder=" Escribe tu email ..." className="w-full bg-background-light border-none rounded-[1.5rem] px-8 py-5 focus:ring-4 focus:ring-primary/20 transition-all shadow-inner text-lg font-medium" />
                  </div>
                </div>
                <input type="hidden" name="_subject" value="Nuevo contacto desde Pico & Amor" />
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-text-muted ml-4 tracking-widest">Asunto</label>
                  <select name="motivo" className="w-full bg-background-light border-none rounded-[1.5rem] px-8 py-5 focus:ring-4 focus:ring-primary/20 transition-all shadow-inner text-lg font-medium appearance-none">
                    <option>Consulta sobre juguetes</option>
                    <option>Estado de mi pedido</option>
                    <option>Sugerencia de producto</option>
                    <option>Otros temas</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-text-muted ml-4 tracking-widest">Mensaje</label>
                  <textarea required name="mensaje" placeholder="¿En qué podemos ayudarte hoy?" rows={5} className="w-full bg-background-light border-none rounded-[1.5rem] px-8 py-5 focus:ring-4 focus:ring-primary/20 transition-all shadow-inner text-lg font-medium resize-none" />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white font-black text-xl px-16 py-6 rounded-[2rem] transition-all shadow-2xl shadow-primary/30 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      Enviando...
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      Enviar Mensaje
                      <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">send</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="lg:col-span-5 space-y-10">
          <div className="bg-white rounded-[2.5rem] p-8 border border-background-light shadow-soft">
            <h3 className="text-xl font-black text-text-main mb-6">Atención al cliente</h3>
            <div className="flex gap-4 items-center">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">alternate_email</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-text-muted mb-1 tracking-widest">Escríbenos</p>
                <p className="font-bold text-xl tracking-tight text-text-main">infopicoyamor@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] aspect-[4/5]">
            <img
              src={IMG_CONTACT_MAIN}
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
              alt="Contacto Agapornis"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
              <p className="text-3xl font-black mb-2">Amor Natural</p>
              <p className="text-lg font-bold opacity-90 italic">Nuestra misión es su felicidad.</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        img { image-rendering: high-quality; }
      `}</style>
    </div>
  );
};

export default Contact;
