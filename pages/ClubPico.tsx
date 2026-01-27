
import React, { useState, useEffect } from 'react';

const ClubPico: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const reviews = [
        {
            id: 1,
            user: "Marta G.",
            bird: "Coco (Agapornis)",
            stars: 5,
            comment: "Increíble la calidad de los materiales. Mi Coco suele destrozar todo en minutos, pero estos juguetes le duran y le mantienen entretenido. ¡Repetiré!",
            date: "Hace 2 días"
        },
        {
            id: 2,
            user: "Javier R.",
            stars: 4,
            bird: "Luna (Ninfa)",
            comment: "Me encanta que sean naturales. Se nota que están hechos con cariño. El envío a Valencia fue rapidísimo.",
            date: "Hace 1 semana"
        },
        {
            id: 3,
            user: "Elena S.",
            stars: 5,
            bird: "Pipo y Pepa",
            comment: "El pack aventura es lo mejor que he comprado. Mis peques no paran de explorar. Muy seguro y visualmente precioso.",
            date: "Hace 3 días"
        }
    ];

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in relative">
            {/* Hero Section */}
            <div className="text-center mb-24 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-[0.2em] mb-6">
                    <span className="material-symbols-outlined text-sm filled-icon">stars</span> Comunidad Pico & Amor
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-text-main uppercase tracking-tighter leading-none mb-8">
                    Club <span className="text-primary italic">Pico</span> ⭐
                </h1>
                <p className="text-2xl text-text-muted font-medium max-w-3xl mx-auto leading-relaxed">
                    Donde la felicidad de nuestras aves es la protagonista. Comparte, inspírate y descubre por qué somos la tienda favorita de los más aventureros.
                </p>
            </div>

            {/* Stats / Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                    { label: "Clientes Felices", value: "500+", icon: "sentiment_very_satisfied" },
                    { label: "Puntuación Media", value: "4.9/5", icon: "grade" },
                    { label: "Juguetes Seguros", value: "100%", icon: "verified" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-background-light shadow-soft text-center group hover:border-primary/30 transition-all">
                        <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">{stat.icon}</span>
                        <p className="text-4xl font-black text-text-main mb-2">{stat.value}</p>
                        <p className="text-sm font-black uppercase tracking-widest text-text-muted">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Reviews Wall */}
            <div className="space-y-12 mb-24">
                <div className="flex justify-between items-end">
                    <h2 className="text-4xl font-black text-text-main uppercase tracking-tight">Experiencias Reales</h2>
                    <button className="bg-text-main text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-text-main/20">
                        Escribir Reseña
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-[3rem] p-10 border border-background-light shadow-soft relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <span className="material-symbols-outlined text-8xl font-black lowercase italic">format_quote</span>
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(review.stars)].map((_, i) => (
                                    <span key={i} className="material-symbols-outlined text-primary text-xl filled-icon">grade</span>
                                ))}
                            </div>

                            <p className="text-xl font-bold text-text-main leading-relaxed mb-8 italic">
                                "{review.comment}"
                            </p>

                            <div className="flex items-center gap-4 border-t border-background-light pt-6">
                                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary">
                                    {review.user[0]}
                                </div>
                                <div>
                                    <p className="font-black text-text-main leading-none mb-1">{review.user}</p>
                                    <p className="text-xs font-bold text-primary">{review.bird}</p>
                                </div>
                                <p className="ml-auto text-[10px] font-black uppercase text-text-muted tracking-widest">{review.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Photo Gallery (Preview) */}
            <div className="bg-text-main rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-0" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-5xl font-black uppercase tracking-tighter leading-tight">
                            Tus aves, <br />
                            nuestra <span className="text-primary italic">Inspiración</span>
                        </h2>
                        <p className="text-xl text-white/70 font-medium leading-relaxed">
                            Nos encanta ver cómo disfrutan vuestros pequeños. Sube una foto a Instagram con el hashtag <span className="text-white font-black">#ClubPico</span> para aparecer en nuestro muro de la fama.
                        </p>
                        <div className="flex gap-4">
                            <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group cursor-pointer hover:bg-white/20 transition-all">
                                <span className="material-symbols-outlined text-3xl">photo_camera</span>
                            </div>
                            <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group cursor-pointer hover:bg-white/20 transition-all">
                                <span className="material-symbols-outlined text-3xl">play_circle</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="aspect-square bg-white/10 rounded-[2rem] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1552728089-57bdde30fc3b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Bird" />
                            </div>
                            <div className="aspect-[4/5] bg-white/10 rounded-[2rem] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1522850935410-b97f079416f4?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Bird" />
                            </div>
                        </div>
                        <div className="space-y-4 pt-12">
                            <div className="aspect-[4/5] bg-white/10 rounded-[2rem] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Bird" />
                            </div>
                            <div className="aspect-square bg-white/10 rounded-[2rem] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1520808663317-647b476a81b9?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Bird" />
                            </div>
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

export default ClubPico;
