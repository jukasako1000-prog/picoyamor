
import React, { useEffect } from 'react';

const Terms: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-black text-text-main uppercase tracking-tighter mb-12">Condiciones de Compra</h1>

            <div className="prose prose-slate max-w-none space-y-8 text-text-main/80 leading-relaxed font-medium">
                <section className="bg-white rounded-[2rem] p-8 shadow-soft border border-background-light">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">shopping_basket</span>
                        Ámbito del Contrato
                    </h2>
                    <p>Las presentes condiciones regulan la venta de productos ofrecidos en el sitio web Pico & Amor por parte de Eva Maria Casanova Coll.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">1. Precios e Impuestos</h2>
                    <p>Todos los precios mostrados en la web incluyen el IVA aplicable en España. Los gastos de envío no están incluidos en el precio del producto y se detallarán antes de finalizar la compra.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">2. Formas de Pago</h2>
                    <p>Pico & Amor utiliza Stripe como pasarela de pago segura. Aceptamos las principales tarjetas de crédito y débito. Sus datos financieros son procesados directamente por Stripe de forma encriptada, nunca se almacenan en nuestros servidores.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">3. Proceso de Pedido</h2>
                    <p>Tras completar la compra, recibirá un email automático con el resumen de su pedido. Si detecta algún error, por favor, póngase en contacto con nosotros lo antes posible.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">4. Garantía</h2>
                    <p>Nuestros juguetes y accesorios están fabricados con materiales naturales y seguros para aves. No obstante, el desgaste por el uso propio del ave no se considera defecto de fabricación.</p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
