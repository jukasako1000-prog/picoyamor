
import React, { useEffect } from 'react';

const ShippingReturns: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">local_shipping</span> Logística y Confianza
                </div>
                <h1 className="text-5xl font-black text-text-main uppercase tracking-tighter">Envíos y Devoluciones</h1>
                <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto italic">
                    Nos encargamos de que cada paquete llegue seguro a su destino, como si fuera para nuestras propias aves. 📦🦜
                </p>
            </div>

            <div className="prose prose-slate max-w-none space-y-12 text-text-main/80 leading-relaxed font-medium">
                {/* Sección Envíos */}
                <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-soft border border-background-light">
                    <h2 className="text-2xl font-black text-text-main uppercase tracking-tight mb-6 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">package_2</span>
                        Gestión de tu Pedido
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-background-light/50 p-6 rounded-2xl border border-background-light">
                            <h4 className="font-black text-sm uppercase tracking-widest text-text-main mb-2">Preparación con minto</h4>
                            <p>Cada juguete se revisa individualmente antes de ser empaquetado. El tiempo de procesamiento suele ser de **24 a 48 horas laborables** tras la confirmación del pago.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="space-y-2">
                                <h4 className="font-black text-xs uppercase tracking-widest text-primary mb-2">Destino Península</h4>
                                <ul className="list-none p-0 space-y-1">
                                    <li className="flex items-center gap-2 font-bold"><span className="size-1.5 rounded-full bg-primary" /> Tarifa Plana: 4,00€</li>
                                    <li className="flex items-center gap-2 text-primary font-black"><span className="size-1.5 rounded-full bg-primary" /> Gratis desde 20€</li>
                                    <li className="flex items-center gap-2 opacity-70"><span className="size-1.5 rounded-full bg-text-muted" /> Entrega: 24-72h</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black text-xs uppercase tracking-widest text-accent mb-2">Otros Destinos</h4>
                                <ul className="list-none p-0 space-y-1">
                                    <li className="flex items-center gap-2 font-bold"><span className="size-1.5 rounded-full bg-accent" /> Tarifa Plana: 8,00€</li>
                                    <li className="flex items-center gap-2 text-accent font-black"><span className="size-1.5 rounded-full bg-accent" /> Gratis desde 30€</li>
                                    <li className="flex items-center gap-2 opacity-70"><span className="size-1.5 rounded-full bg-text-muted" /> Entrega: 3-5 días</li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-background-light">
                            <p className="text-sm italic">El estado de tu pedido cambiará a **"Enviado"** y recibirás un aviso por correo electrónico en cuanto tu paquete salga de nuestras manos.</p>
                        </div>
                    </div>
                </section>

                {/* Sección Devoluciones */}
                <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-soft border border-background-light">
                    <h2 className="text-2xl font-black text-text-main uppercase tracking-tight mb-6 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">assignment_return</span>
                        Devoluciones y Cambios
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-text-main uppercase mb-4">Plazo de Devolución</h3>
                            <p>Para asegurar la máxima higiene, dispones de un plazo de **24/48 horas** tras la recepción del pedido para comunicarnos cualquier intención de devolución. **Pasado este plazo, no se admitirá ninguna devolución.**</p>
                        </div>

                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                            <h3 className="text-lg font-black text-red-900 uppercase mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">verified</span>
                                Estado del Producto
                            </h3>
                            <p className="text-red-800">Se realizará el reembolso **únicamente si el producto se encuentra intacto**, en su embalaje original y sin signos de haber sido manipulado o extraído. Dada la naturaleza de nuestros productos artesanales, la higiene es nuestra prioridad absoluta.</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-text-main uppercase mb-4">¿Cómo realizar una devolución?</h3>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>Escríbenos a <span className="text-primary font-bold">infopicoyamor@gmail.com</span> con tu número de pedido.</li>
                                <li>Empaqueta el producto de forma segura en su embalaje original.</li>
                                <li>Envía el paquete a la dirección que te indicaremos (los gastos de envío en devoluciones voluntarias corren a cargo del cliente).</li>
                                <li>Tras inspeccionar el producto, emitiremos el reembolso en un plazo de 7 días.</li>
                            </ol>
                        </div>

                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                            <h3 className="text-lg font-black text-text-main uppercase mb-4">Productos Defectuosos</h3>
                            <p>Si recibes un producto incorrecto o con algún defecto de fabricación, Pico & Amor se hará cargo de todos los gastos de recogida y sustitución sin coste alguno para ti.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ShippingReturns;
