
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NewArrivals: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const upcomingProducts = [
        {
            id: 'up-1',
            name: 'Columpio "Nube Natural"',
            description: 'Estamos diseñando un columpio extra suave con base de corcho natural y fibras de coco. ¡Ideal para las siestas más cómodas!',
            image: 'https://images.unsplash.com/photo-1601610815313-178f564be656?auto=format&fit=crop&q=80&w=400',
            status: 'En fase de prototipo',
            date: 'Muy pronto'
        },
        {
            id: 'up-2',
            name: 'Piruleta Gourmet Gigante',
            description: 'Una explosión de texturas y sabores. Estamos probando nuevas mezclas de flores secas y semillas premium.',
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
            status: 'Pruebas de calidad',
            date: 'Próxima semana'
        },
        {
            id: 'up-3',
            name: 'Gimnasio "Aventura Total"',
            description: 'El proyecto más grande hasta la fecha. Un parque de juegos modular que podrás ampliar según las necesidades de tu ave.',
            image: 'https://images.unsplash.com/photo-1620694563886-c3a80ec55f41?auto=format&fit=crop&q=80&w=400',
            status: 'Diseño estructural',
            date: 'Marzo 2026'
        }
    ];

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="text-center mb-24 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-black text-xs uppercase tracking-[0.2em]">
                    <span className="material-symbols-outlined text-sm filled-icon animate-spin-slow">settings</span> En el Taller
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-text-main uppercase tracking-tighter leading-none">
                    Próximos <span className="text-primary italic">Lanzamientos</span> <br />
                    exclusivos 🦜✨
                </h1>
                <p className="text-2xl text-text-muted font-medium max-w-3xl mx-auto leading-relaxed italic">
                    "En nuestro taller no solo fabricamos juguetes, diseñamos momentos de felicidad." Echa un vistazo privado a lo que estamos creando ahora mismo.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {upcomingProducts.map((product) => (
                    <div key={product.id} className="group bg-white rounded-[4rem] overflow-hidden border border-background-light shadow-soft hover:shadow-2xl transition-all duration-700">
                        <div className="aspect-[4/5] overflow-hidden relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-125 sepia-[0.3] group-hover:sepia-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-text-main via-text-main/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                            {/* Blueprints overlay effect */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-10 transition-opacity"
                                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                            <div className="absolute top-8 left-8">
                                <div className="bg-accent text-white px-5 py-2 rounded-full shadow-xl">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{product.status}</p>
                                </div>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <p className="text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-70">Lanzamiento: {product.date}</p>
                                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">{product.name}</h3>
                            </div>
                        </div>
                        <div className="p-10 space-y-6">
                            <p className="text-xl text-text-muted font-medium leading-relaxed">
                                {product.description}
                            </p>
                            <div className="flex items-center gap-4 text-primary font-black uppercase text-xs tracking-widest">
                                <div className="h-px flex-1 bg-background-light" />
                                <span>I+D Pico & Amor</span>
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
