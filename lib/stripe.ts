import { loadStripe } from '@stripe/stripe-js';

// TODO: Reemplazar con tu propia clave pública de Stripe (Modo Test)
// La clave pública suele empezar por pk_test_...
export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51StsJY1JhDL1TMxw8nzPhchF75GrWvIuDDsMHg2EqSyb5dpLX6HOkfq5JYqVNZGIHa28rDLCf5T34tL3nlwlKdhv00Rbn6S8De';

export const getStripe = () => {
  return loadStripe(STRIPE_PUBLISHABLE_KEY);
};
