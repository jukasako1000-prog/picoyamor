
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Destructibles' | 'Forrajeo/Colgantes' | 'Acromáticos' | 'Columpios' | 'Packs';
  badge?: string;
  level?: string;
  isOffer?: boolean;
  oldPrice?: number;
  scale?: number;
  translateY?: number;
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
  id?: string;
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
  date?: string;
  created_at?: string;
  total: number;
  shipping_cost?: number;
  status: string;
  items: any[];
}
