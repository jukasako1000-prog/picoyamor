
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="pt-40 pb-20 text-center px-4 space-y-6">
        <h2 className="text-3xl font-black">Artículo no encontrado</h2>
        <p className="text-text-muted">Parece que este vuelo se ha desviado de su ruta.</p>
        <Link to="/blog" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold">Volver al Blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 animate-fade-in">
      {/* Hero del Artículo */}
      <header className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        {/* Degradado oscurecido para resaltar el texto blanco */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20">
          <div className="max-w-4xl mx-auto space-y-4">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Volver al Blog
            </Link>
            <div className="space-y-2">
               <span className="inline-block bg-accent text-text-main px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                 {post.category}
               </span>
               {/* Título cambiado a blanco con sombra para legibilidad máxima */}
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
                 {post.title}
               </h1>
            </div>
            <div className="flex items-center gap-6 text-sm font-bold text-white/80 uppercase tracking-widest">
               <span>{post.date}</span>
               <span className="size-1.5 bg-accent rounded-full"></span>
               <span>{post.readTime} de lectura</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cuerpo del Artículo */}
      <article className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        <div 
          className="prose prose-lg md:prose-xl max-w-none text-text-main font-medium leading-relaxed space-y-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Footer del Artículo */}
        <div className="mt-20 pt-10 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src="https://i.postimg.cc/Gpywxh9s/Whats-App-Image-2026-01-11-at-15-24-14.jpg" alt="Pico & Amor" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-widest">Escrito por</p>
              <p className="text-xl font-black text-text-main">Equipo Pico & Amor</p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <button className="flex items-center gap-2 bg-white border border-background-light px-6 py-3 rounded-2xl font-bold text-sm text-text-muted hover:text-primary transition-colors shadow-sm">
               <span className="material-symbols-outlined text-lg">share</span> Compartir
             </button>
             <Link to="/tienda" className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all">
               Ver productos relacionados
             </Link>
          </div>
        </div>
      </article>

      {/* Estilos para el contenido inyectado */}
      <style>{`
        .prose h3 { font-weight: 900; font-size: 2rem; color: #3F3D3C; margin-top: 2.5rem; letter-spacing: -0.02em; }
        .prose p { margin-bottom: 1.5rem; font-size: 1.25rem; color: #6c7a6e; }
        .prose ul { list-style: none; padding-left: 0; margin: 2rem 0; }
        .prose li { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; color: #3F3D3C; font-weight: 700; }
        .prose li::before { content: '•'; color: #6c9371; font-weight: 900; font-size: 1.5rem; line-height: 1; }
        .prose blockquote { border-left: 6px solid #a3cb2a; padding-left: 2rem; margin: 3rem 0; font-style: italic; font-size: 1.75rem; color: #6c9371; font-weight: 800; }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default BlogPostDetail;
