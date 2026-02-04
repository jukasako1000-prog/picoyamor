
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NewArrivals: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const workshopSteps = [
        {
            id: 'step-1',
            name: 'CORTE NATURAL',
            description: 'Seleccionamos y preparamos a mano cada pieza de madera natural. Sin procesos industriales, respetando la textura y la esencia de la madera para un limado de pico y uñas perfecto.',
            status: 'Paso 1',
            image: '/cortepalo.png'
        },
        {
            id: 'step-2',
            name: 'MANOS QUE CREAN',
            description: 'El corazón de Pico & Amor. Con paciencia y dedicación, damos forma a cada juguete, trenzando fibras naturales y ensamblando piezas seguras pensadas para la felicidad de tu ave.',
            status: 'Paso 2',
            image: '/manosquecrean.png'
        },
        {
            id: 'step-3',
            name: 'HILANDO FINO',
            description: 'El último paso es el más importante. Revisamos cada nudo, cada acabado y cada detalle para asegurar que cada pieza sea pura magia y 100% segura para tu bandada.',
            status: 'Paso 3',
            image: '/hilandofino.png'
        }
    ];

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="text-center mb-24 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-black text-xs uppercase tracking-[0.2em]">
                    <span className="material-symbols-outlined text-sm filled-icon animate-spin-slow">settings</span> Proceso Artesanal
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-text-main uppercase tracking-tighter leading-[0.9]">
                    Cuidando cada detalle <br />
                    <span className="text-primary italic">desde nuestro taller</span> <br />
                    artesanal 🦜✨
                </h1>
                <p className="text-lg text-text-muted font-medium max-w-3xl mx-auto leading-relaxed italic">
                    "Cada pieza que sale de nuestras manos es fruto de un proceso lento y respetuoso." Trabajamos con materiales que la naturaleza nos regala para asegurar que tu ave reciba lo mejor. Así es como nace la magia en Pico & Amor.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {workshopSteps.map((step) => (
                    <div key={step.id} className="group bg-white rounded-[4rem] overflow-hidden border border-background-light shadow-soft hover:shadow-2xl transition-all duration-700">
                        <div className="aspect-[4/5] overflow-hidden relative">
                            <img
                                src={step.image}
                                alt={step.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700" />

                            <div className="absolute top-8 left-8">
                                <div className="bg-accent text-white px-5 py-3 rounded-2xl shadow-xl">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{step.status}</p>
                                </div>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 text-white drop-shadow-lg">
                                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{step.name}</h3>
                            </div>
                        </div>
                        <div className="p-10 space-y-6">
                            <p className="text-lg text-text-muted font-medium leading-relaxed">
                                {step.description}
                            </p>
                            <div className="flex items-center gap-4 text-primary font-black uppercase text-[10px] tracking-[0.2em]">
                                <div className="h-px flex-1 bg-background-light" />
                                <span>Calidad Pico & Amor</span>
                                <div className="h-px flex-1 bg-background-light" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-32 relative">
                <div className="bg-primary rounded-[5rem] p-16 md:p-32 text-center text-white overflow-hidden shadow-[0_50px_100px_-20px_rgba(var(--color-primary-rgb),0.4)]">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }} />
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            ¿Tienes una <br />
                            <span className="text-text-main italic">idea genial?</span>
                        </h2>
                        <p className="text-2xl text-white/80 font-medium max-w-2xl mx-auto">
                            Muchos de nuestros mejores diseños nacen de vuestras sugerencias. Cuéntanos qué juguete le encantaría a tu ave y podríamos hacerlo realidad.
                        </p>
                        <Link to="/contact" className="inline-flex items-center gap-4 bg-white text-primary px-12 py-6 rounded-3xl font-black uppercase text-lg tracking-widest hover:bg-text-main hover:text-white transition-all shadow-2xl active:scale-95">
                            Enviar Sugerencia
                            <span className="material-symbols-outlined">lightbulb</span>
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                .filled-icon { font-variation-settings: 'FILL' 1; }
                .animate-spin-slow { animation: spin 8s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default NewArrivals;
