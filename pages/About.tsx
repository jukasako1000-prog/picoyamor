
import React from 'react';
import { IMG_ABOUT_MAIN, IMG_ABOUT_STORY } from '../constants';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-24">
      {/* Hero About */}
      <section className="grid md:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">

          <h1 className="text-5xl md:text-7xl font-black text-text-main leading-[0.9] tracking-tight">
            Nuestra <br /><span className="text-primary italic">Pasión</span> <br />con Alas.
          </h1>
          <p className="text-xl md:text-2xl text-text-muted leading-relaxed max-w-xl font-medium">
            Descubre cómo convertimos el amor por los agapornis en juguetes seguros, naturales y llenos de diversión con Pico & Amor.
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/15 blur-[100px] rounded-full transform scale-90 translate-y-10"></div>
          <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[12px] border-white group">
            <video
              src="/VIDEO.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s] ease-out"
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white rounded-[4rem] p-12 md:p-24 shadow-soft relative overflow-hidden border border-background-light">
        <div className="absolute top-0 right-0 p-16 opacity-[0.05] pointer-events-none rotate-12">
          <span className="material-symbols-outlined text-[400px] text-primary">emoji_nature</span>
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-20 items-center">
          <div className="aspect-square rounded-[3rem] overflow-hidden bg-background-light shadow-inner group">
            <img
              src={IMG_ABOUT_STORY}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              alt="Proceso artesanal"
            />
          </div>
          <div className="space-y-10">
            <div>
              <h3 className="text-primary font-black text-sm uppercase tracking-[0.3em] mb-6">Nuestra Historia</h3>
              <h2 className="text-4xl font-black text-text-main mb-8 leading-tight tracking-tight">Un Comienzo Lleno de Plumas</h2>
            </div>
            <div className="space-y-8 text-text-muted text-lg leading-relaxed font-medium">
              <p>Todo comenzó con nuestra propia bandada de agapornis y una búsqueda frustrante de juguetes verdaderamente seguros. Convivir con ellos a diario nos enseñó que todo se pica, sin excepción, y que no cualquier material vale cuando hay picos curiosos de por medio. Así nos dimos cuenta de lo importante que era ofrecerles opciones naturales y fiables, y de que el mercado estaba saturado de plásticos y materiales dudosos.</p>
              <p>Al no encontrar lo que buscábamos, decidimos crearlo nosotros mismos utilizando materiales 100 % naturales, seleccionados con cuidado y, siempre que es posible, de origen español. No hacemos juguetes pensados solo para ser bonitos, sino para que a ellos les resulten divertidos, entretenidos y duraderos, porque al final son ellos quienes deciden si algo merece la pena… y normalmente lo hacen a base de picotazos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="text-center space-y-20 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">Nuestros Valores</h2>
          <p className="text-lg text-text-muted font-medium">Creemos firmemente en tres pilares para asegurar la felicidad y salud de tu ave.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: 'forest', title: 'Amor Natural', desc: 'Solo materiales naturales y maderas sostenibles. Nada de tóxicos.' },
            { icon: 'handyman', title: 'Artesanía Segura', desc: 'Cada juguete es lijado a mano y probado contra picos curiosos.' },
            { icon: 'diversity_1', title: 'Comunidad', desc: 'No somos solo una tienda, somos una bandada que comparte conocimiento.' }
          ].map((v, i) => (
            <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-background-light shadow-soft transition-all duration-500 hover:-translate-y-4 hover:shadow-hover flex flex-col items-center gap-8 group">
              <div className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-5xl">{v.icon}</span>
              </div>
              <h3 className="text-3xl font-black text-text-main">{v.title}</h3>
              <p className="text-text-muted text-lg leading-relaxed font-medium">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
