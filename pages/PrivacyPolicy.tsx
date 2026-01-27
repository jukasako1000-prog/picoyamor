
import React, { useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-black text-text-main uppercase tracking-tighter mb-12">Política de Privacidad</h1>

            <div className="prose prose-slate max-w-none space-y-8 text-text-main/80 leading-relaxed font-medium">
                <section className="bg-white rounded-[2rem] p-8 shadow-soft border border-background-light">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">security</span>
                        Protección de Datos
                    </h2>
                    <p>De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), le informamos que sus datos personales serán tratados por Eva Maria Casanova Coll para gestionar su pedido y la relación comercial.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">1. ¿Qué datos recogemos?</h2>
                    <p>Para la realización de pedidos en Pico & Amor, recogemos datos identificativos obligatorios: nombre completo, dirección de envío, localidad, provincia, código postal, teléfono y correo electrónico.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">2. Finalidad del Tratamiento</h2>
                    <p>La finalidad principal es la gestión, envío y facturación de sus compras. Si se registra como usuario, sus datos se almacenarán para facilitar futuras compras y permitirle el acceso a su historial.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">3. Conservación de los Datos</h2>
                    <p>Sus datos se conservarán durante el tiempo necesario para cumplir con las obligaciones legales (fiscales y mercantiles) derivadas de la compra.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">4. Sus Derechos</h2>
                    <p>Como usuario, tiene derecho a acceder a sus datos personales, solicitar la rectificación de los datos inexactos o, en su caso, solicitar su supresión. Puede ejercer estos derechos enviando un correo electrónico a hola@picoyamor.com indicando su número de DNI.</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
