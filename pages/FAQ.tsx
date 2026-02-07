
import React, { useState, useEffect } from 'react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-background-light last:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <h3 className={`text-lg font-black uppercase tracking-tight transition-colors ${isOpen ? 'text-primary' : 'text-text-main group-hover:text-primary'}`}>
                    {question}
                </h3>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-text-muted'}`}>
                    expand_more
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                <p className="text-text-muted font-medium leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQ: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            question: "¿Son los materiales seguros para mi ave?",
            answer: "¡Absolutamente! En Pico & Amor solo utilizamos maderas naturales sin tratar, tintes alimentarios no tóxicos y fibras vegetales seguras (yute, algodón, palma). Cada juguete es revisado para evitar piezas pequeñas peligrosas o cuerdas que puedan causar enredos."
        },
        {
            question: "¿Cuánto tardará en llegar mi pedido?",
            answer: "Preparamos los paquetes con mucho mimo en 24-48 horas laborables. Una vez enviado, la empresa de transporte suele entregar en 24-72 horas adicionales dentro de la península."
        },
        {
            question: "¿Cómo puedo limpiar los juguetes?",
            answer: "Al ser materiales naturales, recomendamos no sumergirlos en agua. Puedes limpiar las partes de madera con un paño ligeramente humedecido y dejarlos secar al aire libre (evitando el sol directo para que no pierdan color rápidamente)."
        },
        {
            question: "¿Hacéis envíos a Canarias, Baleares, Ceuta y Melilla?",
            answer: "Sí, realizamos envíos a todo el territorio nacional. Los gastos de envío son de 8€ (Gratis en pedidos de más de 30€) para fuera de la península."
        },
        {
            question: "¿Puedo devolver un producto si no le gusta a mi ave?",
            answer: "Por seguridad e higiene aviar, solo aceptamos devoluciones de productos que se encuentren intactos y en su embalaje original. Dispones de un plazo de 24/48 horas tras la recepción del pedido para comunicarnos la devolución; pasado este plazo no se admitirán devoluciones."
        },
        {
            question: "¿Cómo sé qué tamaño de juguete es mejor para mi pájaro?",
            answer: "En cada ficha de producto indicamos para qué tipo de ave es más adecuado (agapornis, ninfas, loros más grandes, etc.). Si tienes dudas, puedes escribirnos por WhatsApp y te asesoramos encantados."
        }
    ];

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">help_center</span> Centro de Ayuda
                </div>
                <h1 className="text-5xl font-black text-text-main uppercase tracking-tighter">Preguntas Frecuentes</h1>
                <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto italic">
                    Todo lo que necesitas saber para que tu experiencia en Pico & Amor sea perfecta. 🦜✨
                </p>
            </div>

            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-soft border border-background-light">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>

            <div className="mt-12 text-center bg-primary/5 rounded-[2.5rem] p-10 border border-primary/10">
                <h3 className="text-2xl font-black text-text-main mb-4 uppercase tracking-tight">¿Aún tienes dudas?</h3>
                <p className="text-text-muted font-bold mb-8">Estamos al otro lado para ayudarte con lo que necesites.</p>
                <a
                    href="/contact"
                    className="inline-flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 active:scale-95"
                >
                    Contactar Ahora
                    <span className="material-symbols-outlined">arrow_forward</span>
                </a>
            </div>
        </div>
    );
};

export default FAQ;
