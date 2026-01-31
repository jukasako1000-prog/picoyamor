import { loadStripe } from '@stripe/stripe-js';

// TODO: Reemplazar con tu propia clave pública de Stripe (Modo Test)
// La clave pública suele empezar por pk_test_...
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_placeholder_juan'; 

export const getStripe = () => {
  return loadStripe(STRIPE_PUBLISHABLE_KEY);
};
