
import React, { useState, useRef, useEffect } from 'react';
import { getToyRecommendation } from '../geminiService';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface AIAssistantProps {
  onAddToCart: (p: Product) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onAddToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string; recommendedId?: string | null }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  useEffect(() => {
    if (isOpen && chat.length === 0) {
      setLoading(true);
      setTimeout(() => {
        setChat([{ 
          role: 'bot', 
          text: '¡Hola! Soy Pico Bot. 🦜 ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre cuidados, alimentación o pedirme que te recomiende el mejor juguete para tu ave.' 
        }]);
        setLoading(false);
      }, 500);
    }
  }, [isOpen]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // getToyRecommendation ahora maneja sus propios errores y siempre devuelve un objeto
      const result = await getToyRecommendation(userMsg);
      setChat(prev => [...prev, { 
        role: 'bot', 
        text: result.text, 
        recommendedId: result.recommendedProductId 
      }]);
    } catch (err) {
      // Este bloque es solo para errores catastróficos de JS/Red
      console.error("UI Chat Error:", err);
      setChat(prev => [...prev, { 
        role: 'bot', 
        text: "¡Uy! Parece que hay una tormenta en el nido y he perdido la conexión. ¿Lo intentamos de nuevo?" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderRecommendedProduct = (id: string) => {
    if (!id || id === "null") return null;
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return null;

    return (
      <div className="mt-3 bg-background-light p-3 rounded-2xl border border-primary/10 flex items-center gap-3 animate-fade-in shadow-sm">
        <img src={product.image} alt={product.name} className="size-12 rounded-lg object-cover border border-white" />
        <div className="flex-1 overflow-hidden">
          <p className="text-[10px] font-black uppercase text-primary leading-none mb-1">Recomendación</p>
          <p className="text-xs font-bold text-text-main truncate">{product.name}</p>
          <p className="text-[10px] font-bold text-text-muted">{product.price.toFixed(2)}€</p>
        </div>
        <button 
          onClick={() => onAddToCart(product)}
          className="bg-primary text-white size-8 rounded-full flex items-center justify-center hover:bg-primary-hover transition-colors shadow-md active:scale-90 shrink-0"
        >
          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
        </button>
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      {isOpen ? (
        <div className="w-85 md:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up border border-[#ebe8dd] max-h-[500px]">
          <div className="bg-primary p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined filled-icon">psychology</span>
              </div>
              <div>
                <p className="font-bold text-sm leading-none">Pico Bot Experto</p>
                <div className="flex items-center gap-1">
                  <span className="size-1.5 bg-accent rounded-full animate-pulse"></span>
                  <p className="text-[10px] opacity-70">En línea</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-full p-1 transition-colors">
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6] hide-scrollbar">
            {chat.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' 
                    : 'bg-white text-text-main rounded-tl-none border border-background-light shadow-sm'
                }`}>
                  {msg.text}
                  {msg.recommendedId && renderRecommendedProduct(msg.recommendedId)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="bg-white border text-text-main self-start p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center px-4">
                <p className="text-[10px] font-bold text-text-muted italic mr-2">Consultando...</p>
                <div className="size-1 bg-primary/30 rounded-full animate-bounce" />
                <div className="size-1 bg-primary/50 rounded-full animate-bounce delay-75" />
                <div className="size-1 bg-primary/70 rounded-full animate-bounce delay-150" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleAsk} className="p-4 bg-white border-t flex gap-2 shrink-0">
            <input 
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ej: ¿Qué frutas pueden comer?"
              className="flex-1 bg-background-light border-none rounded-xl text-xs focus:ring-2 focus:ring-primary h-11 px-4 font-medium"
            />
            <button disabled={loading} className="size-11 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-primary-hover shadow-lg shadow-primary/10 active:scale-95 transition-all">
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white size-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        >
          <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">smart_toy</span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-accent border-2 border-white"></span>
          </span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
