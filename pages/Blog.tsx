
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';

const Blog: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const categories = ['Todos', 'Cuidados', 'Salud', 'Juegos'];

  const filteredPosts = filter === 'Todos' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === filter);

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        {/* El badge "Blog de Cuidados" ha sido eliminado por petición del usuario */}
        <h1 className="text-6xl md:text-7xl font-black text-text-main tracking-tighter leading-[0.9]">Bitácora de Vuelo</h1>
        <p className="text-xl text-text-muted leading-relaxed font-medium">
          Aprende a entender a tu agapornis y descubre cómo mejorar su calidad de vida con consejos de expertos y guías de salud.
        </p>
      </div>

      <div className="flex justify-center gap-3 overflow-x-auto hide-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`whitespace-nowrap px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              filter === cat 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                : 'bg-white hover:bg-background-light text-text-main border border-background-light shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
        {filteredPosts.map((post) => (
          <article key={post.id} className="group bg-white rounded-[3rem] overflow-hidden shadow-soft hover:shadow-hover transition-all duration-500 flex flex-col h-full border border-background-light">
            <Link to={`/blog/${post.id}`} className="relative aspect-video overflow-hidden block">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                {post.category}
              </div>
            </Link>
            
            <div className="p-8 flex-1 flex flex-col space-y-4">
              <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <span>{post.date}</span>
                <span className="size-1 bg-primary/30 rounded-full"></span>
                <span>{post.readTime} lectura</span>
              </div>
              
              <Link to={`/blog/${post.id}`}>
                <h3 className="text-2xl font-black text-text-main leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </Link>
              
              <p className="text-text-muted leading-relaxed text-sm flex-1">
                {post.excerpt}
              </p>
              
              <Link to={`/blog/${post.id}`} className="pt-4 flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest group/btn">
                Continuar leyendo
                <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Blog;
