
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Destructibles' | 'Forrajeo' | 'Acromáticos' | 'Columpios' | 'Packs';
  badge?: string;
  level?: string;
  isOffer?: boolean;
  oldPrice?: number;
  scale?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  text: string;
  rating: number;
  birdName: string;
}

export interface UserProfile {
  name: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  isGuest?: boolean;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Entregado' | 'En camino' | 'Procesando';
  items: string[];
}
