
import React, { useEffect } from 'react';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    if (imageUrl) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'unset';
      };
    }
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" />
      
      <div 
        className="relative max-w-5xl w-full h-full flex items-center justify-center animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-12 text-white hover:text-primary transition-colors p-2"
        >
          <span className="material-symbols-outlined text-4xl">close</span>
        </button>
        
        <img 
          src={imageUrl} 
          alt="Vista ampliada" 
          className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ImageModal;
