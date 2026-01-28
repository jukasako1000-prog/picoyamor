
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';

interface Review {
    id: string;
    name: string;
    bird_name: string;
    avatar: string;
    text: string;
    rating: number;
    image_url?: string;
    created_at: string;
}

const ClubPico: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        bird_name: '',
        text: '',
        rating: 5,
        image: null as File | null
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let image_url = '';

            // Handle image upload if exists
            if (formData.image) {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(formData.image, options);

                const fileExt = formData.image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `review-photos/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('reviews')
                    .upload(filePath, compressedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('reviews')
                    .getPublicUrl(filePath);

                image_url = publicUrl;
            }

            const { error } = await supabase
                .from('reviews')
                .insert([{
                    name: formData.name,
                    bird_name: formData.bird_name,
                    text: formData.text,
                    rating: formData.rating,
                    image_url,
                    avatar: 'default'
                }]);

            if (error) throw error;

            // Reset and refresh
            setFormData({ name: '', bird_name: '', text: '', rating: 5, image: null });
            setShowForm(false);
            fetchReviews();
            alert('¡Gracias por tu reseña! 🦜✨');
        } catch (error: any) {
            console.error('Error submitting review:', error);
            alert(`Hubo un error al enviar tu reseña: ${error.message || 'Error desconocido'}. Asegúrate de que la tabla y el storage estén configurados en Supabase.`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in relative">
            {/* Hero Section */}
            <div className="text-center mb-24 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-[0.2em] mb-6">
                    <span className="material-symbols-outlined text-sm filled-icon">stars</span> Comunidad Pico & Amor
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-text-main uppercase tracking-tighter leading-none mb-8">
                    Club <span className="text-primary italic">Pico</span> ⭐
                </h1>
                <p className="text-2xl text-text-muted font-medium max-w-3xl mx-auto leading-relaxed">
                    Donde la felicidad de nuestras aves es la protagonista. Comparte, inspírate y descubre por qué somos la tienda favorita de los más aventureros.
                </p>
            </div>

            {/* Stats / Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                    { label: "Clientes Felices", value: "500+", icon: "sentiment_very_satisfied" },
                    { label: "Puntuación Media", value: "4.9/5", icon: "grade" },
                    { label: "Juguetes Seguros", value: "100%", icon: "verified" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-background-light shadow-soft text-center group hover:border-primary/30 transition-all">
                        <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">{stat.icon}</span>
                        <p className="text-4xl font-black text-text-main mb-2">{stat.value}</p>
                        <p className="text-sm font-black uppercase tracking-widest text-text-muted">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Reviews Wall */}
            <div className="space-y-12 mb-24">
                <div className="flex justify-between items-end">
                    <h2 className="text-4xl font-black text-text-main uppercase tracking-tight">Experiencias Reales</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-text-main text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-text-main/20"
                    >
                        {showForm ? 'Cancelar' : 'Escribir Reseña'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 border-2 border-primary/20 shadow-xl animate-scale-in">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2">Tu Nombre</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-background-light border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-bold"
                                        placeholder="Ej: Eva G."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2">Tu Ave (Especie)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.bird_name}
                                        onChange={(e) => setFormData({ ...formData, bird_name: e.target.value })}
                                        className="w-full bg-background-light border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-bold"
                                        placeholder="Ej: Kiko (Agapornis)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2">Puntuación</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: num })}
                                                className={`size-12 rounded-xl flex items-center justify-center transition-all ${formData.rating >= num ? 'bg-primary text-white' : 'bg-background-light text-text-muted'}`}
                                            >
                                                <span className="material-symbols-outlined filled-icon">grade</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2">Tu Experiencia</label>
                                    <textarea
                                        required
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        className="w-full bg-background-light border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-bold h-32 resize-none"
                                        placeholder="Cuéntanos qué tal le han parecido los juguetes..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2">Foto (Opcional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                                        className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    />
                                </div>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {submitting ? 'Enviando...' : 'Publicar mi Reseña'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center py-20">
                            <div className="inline-block animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                            <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Cargando experiencias...</p>
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-[3rem] p-10 border border-background-light shadow-soft relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <span className="material-symbols-outlined text-8xl font-black lowercase italic">format_quote</span>
                                </div>

                                <div className="flex gap-1 mb-6">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-primary text-xl filled-icon">grade</span>
                                    ))}
                                </div>

                                <p className="text-xl font-bold text-text-main leading-relaxed mb-8 italic">
                                    "{review.text}"
                                </p>

                                {review.image_url && (
                                    <div className="mb-6 rounded-2xl overflow-hidden border border-background-light bg-background-light/30">
                                        <img
                                            src={review.image_url}
                                            alt="Review"
                                            className="w-full h-auto max-h-[400px] object-contain block mx-auto"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center gap-4 border-t border-background-light pt-6">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary uppercase">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-black text-text-main leading-none mb-1">{review.name}</p>
                                        <p className="text-xs font-bold text-primary">{review.bird_name}</p>
                                    </div>
                                    <p className="ml-auto text-[10px] font-black uppercase text-text-muted tracking-widest">{formatDate(review.created_at)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-background-light">
                            <p className="text-text-muted font-bold uppercase tracking-widest text-sm mb-2">Aún no hay reseñas</p>
                            <p className="text-text-muted/60 text-xs">¡Sé el primero en compartir tu experiencia!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Photo Gallery (Preview) */}
            <div className="bg-text-main rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-0" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-5xl font-black uppercase tracking-tighter leading-tight">
                            Tus aves, <br />
                            nuestra <span className="text-primary italic">Inspiración</span>
                        </h2>
                        <p className="text-xl text-white/70 font-medium leading-relaxed">
                            Nos encanta ver cómo disfrutan vuestros pequeños. Sube una foto para aparecer en nuestro muro de la fama.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="aspect-square bg-white/10 rounded-[2rem] overflow-hidden">
                                <img src="/FAMA/FAMA1.jpg" className="w-full h-full object-cover" alt="Club Pico" />
                            </div>
                            <div className="aspect-[4/5] bg-white/10 rounded-[2rem] overflow-hidden">
                                <img src="/FAMA/FAMA2.jpg" className="w-full h-full object-cover" alt="Club Pico" />
                            </div>
                        </div>
                        <div className="space-y-4 pt-12">
                            <div className="aspect-[4/5] bg-white/10 rounded-[2rem] overflow-hidden">
                                <img src="/FAMA/FAMA3.jpg" className="w-full h-full object-cover" alt="Club Pico" />
                            </div>
                            <div className="aspect-square bg-white/10 rounded-[2rem] overflow-hidden">
                                <img src="/FAMA/FAMA4.jpg" className="w-full h-full object-cover" alt="Club Pico" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .filled-icon { font-variation-settings: 'FILL' 1; }
            `}</style>
        </div>
    );
};

export default ClubPico;
