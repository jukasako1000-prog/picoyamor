
import React, { useEffect } from 'react';

const NewArrivals: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const upcomingProducts = [
        {
            id: 'up-1',
            name: 'Piruleta Gourmet',
            description: 'Un juguete interactivo con semillas y frutas deshidratadas para horas de diversión.',
            image: 'https://images.unsplash.com/photo-1620694563886-c3a80ec55f41?auto=format&fit=crop&q=80&w=400',
            date: 'Febrero 2026'
        },
        {
            id: 'up-2',
            name: 'Columpio Trenzado XL',
            description: 'Diseño extra resistente para loros grandes y medianos con cuerdas de palma natural.',
            image: 'https://images.unsplash.com/photo-1601610815313-178f564be656?auto=format&fit=crop&q=80&w=400',
            date: 'Marzo 2026'
        },
        {
            id: 'up-3',
            name: 'Cesta Sorpresa Natural',
            description: 'Una selección de materiales para que tu ave fabrique su propio nido y se mantenga ocupada.',
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
            date: 'Abril 2026'
        }
    ];

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

            <div className="text-center mb-20 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-black text-xs uppercase tracking-[0.2em] animate-pulse">
                    <span className="material-symbols-outlined text-sm filled-icon">celebration</span> Próximamente
                </div>
                <h1 className="text-6xl md:text-7xl font-black text-text-main uppercase tracking-tighter leading-none">
                    Nuevas <span className="text-primary italic">Aventuras</span> <br />
                    en camino 🦜
                </h1>
                <p className="text-2xl text-text-muted font-medium max-w-2xl mx-auto leading-relaxed">
                    Estamos diseñando nuevos juguetes para llevar la felicidad de tus aves al siguiente nivel. ¡Muy pronto disponibles en la tienda!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {upcomingProducts.map((product) => (
                    <div key={product.id} className="group bg-white rounded-[3rem] overflow-hidden border border-background-light shadow-soft hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="aspect-[4/3] overflow-hidden relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-text-main/60 to-transparent" />
                            <div className="absolute top-6 right-6">
                                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                                    <p className="text-[10px] font-black uppercase text-accent tracking-widest">{product.date}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 space-y-4">
                            <h3 className="text-2xl font-black text-text-main uppercase tracking-tight">{product.name}</h3>
                            <p className="text-text-muted font-medium leading-relaxed">{product.description}</p>
                            <div className="pt-4 flex items-center gap-2 text-primary">
                                <span className="size-2 rounded-full bg-primary animate-ping" />
                                <span className="font-black text-xs uppercase tracking-widest italic">En fase de diseño</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-24 text-center">
                <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-background-light max-w-4xl mx-auto relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl font-black text-text-main uppercase tracking-tighter">¿Quieres ser el primero en saberlo?</h2>
                        <p className="text-xl text-text-muted font-bold max-w-xl mx-auto italic">
                            Síguenos en nuestras redes sociales para ver los procesos de fabricación y los adelantos exclusivos.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="#" className="bg-text-main text-white px-8 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-text-main/20">Instagram</a>
                            <a href="#" className="bg-primary text-white px-8 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-primary-hover transition-all active:scale-95 shadow-xl shadow-primary/20">Facebook</a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .filled-icon { font-variation-settings: 'FILL' 1; }
            `}</style>
        </div>
    );
};

export default NewArrivals;
