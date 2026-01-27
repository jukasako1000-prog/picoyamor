
import React, { useEffect } from 'react';

const LegalNotice: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-black text-text-main uppercase tracking-tighter mb-12">Aviso Legal</h1>

            <div className="prose prose-slate max-w-none space-y-8 text-text-main/80 leading-relaxed font-medium">
                <section className="bg-white rounded-[2rem] p-8 shadow-soft border border-background-light">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span>
                        Identificación del Responsable
                    </h2>
                    <p>En cumplimiento con el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico, se exponen los siguientes datos identificativos del titular de esta página web:</p>
                    <ul className="mt-4 space-y-2 list-none p-0">
                        <li><strong className="text-text-main uppercase text-xs tracking-widest">Titular:</strong> Eva Maria Casanova Coll</li>
                        <li><strong className="text-text-main uppercase text-xs tracking-widest">NIF:</strong> 48484517B</li>
                        <li><strong className="text-text-main uppercase text-xs tracking-widest">Domicilio:</strong> RNDA. Hist. Lluis Duart Alabarta 1, P02-11. Almussafes (Valencia)</li>
                        <li><strong className="text-text-main uppercase text-xs tracking-widest">Nombre Comercial:</strong> Pico & Amor</li>
                        <li><strong className="text-text-main uppercase text-xs tracking-widest">Email:</strong> hola@picoyamor.com</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">1. Propiedad Intelectual</h2>
                    <p>El código fuente, los diseños gráficos, las imágenes, las fotografías, los sonidos, las animaciones, el software, los textos, así como la información y los contenidos que se recogen en el presente sitio web están protegidos por la legislación española sobre los derechos de propiedad intelectual e industrial a favor de la titular.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">2. Condiciones de Uso</h2>
                    <p>El usuario se compromete a utilizar la página web de conformidad con la ley y el presente Aviso Legal. A tal efecto, el usuario se abstendrá de utilizar la página con fines ilícitos o prohibidos, que de cualquier forma puedan dañar, inutilizar, sobrecargar, deteriorar o impedir la normal utilización del sitio web.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">3. Limitación de Responsabilidad</h2>
                    <p>La titular no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran derivarse de la disponibilidad y continuidad técnica del funcionamiento del sitio web.</p>
                </section>
            </div>
        </div>
    );
};

export default LegalNotice;
