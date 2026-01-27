
import React, { useEffect } from 'react';

const ShippingReturns: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-black text-text-main uppercase tracking-tighter mb-12">Envíos y Devoluciones</h1>

            <div className="prose prose-slate max-w-none space-y-8 text-text-main/80 leading-relaxed font-medium">
                <section className="bg-white rounded-[2rem] p-8 shadow-soft border border-background-light">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">local_shipping</span>
                        Política de Envíos
                    </h2>
                    <p>En Pico & Amor preparamos cada paquete con el mismo cariño con el que fabricamos nuestros juguetes.</p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background-light p-5 rounded-2xl">
                            <h4 className="font-black text-xs uppercase tracking-widest text-text-muted mb-2">Península</h4>
                            <p className="font-bold text-text-main">4,00€ tarifa plana</p>
                            <p className="text-sm text-primary font-black uppercase mt-1 italic">Gratis en pedidos +15€</p>
                        </div>
                        <div className="bg-background-light p-5 rounded-2xl">
                            <h4 className="font-black text-xs uppercase tracking-widest text-text-muted mb-2">Otros Destinos</h4>
                            <p className="font-bold text-text-main">7,00€ tarifa plana</p>
                            <p className="text-sm text-primary font-black uppercase mt-1 italic">Gratis en pedidos +25€</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">1. Plazos de Entrega</h2>
                    <p>Los pedidos se procesan en un plazo de 24-48 horas laborables. Una vez enviado, el tiempo de entrega suele ser de 24-72 horas adicionales, dependiendo del destino.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">2. Devoluciones</h2>
                    <p>Tiene un plazo de 14 días naturales para devolver un producto si no está satisfecho. Por motivos de higiene y seguridad de las aves, solo se aceptarán devoluciones de productos en su embalaje original y sin haber sido utilizados o estar en contacto con aves.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">3. Productos Defectuosos</h2>
                    <p>Si recibe un juguete con algún defecto de fabricación evidente, nos haremos cargo de la sustitución o reembolso íntegro, incluyendo los gastos de envío de la devolución.</p>
                </section>
            </div>
        </div>
    );
};

export default ShippingReturns;
