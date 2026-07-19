import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2022-11-15",
    httpClient: Stripe.createFetchHttpClient(),
});

// Cliente con permisos de servicio: puede leer/corregir el pedido sin depender del navegador del cliente.
const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// FUENTE DE VERDAD DE PRECIOS. Debe reflejar siempre constants.tsx.
// IMPORTANTE: si añades/cambias un precio en constants.tsx, actualiza también este mapa
// y vuelve a desplegar esta función (`supabase functions deploy create-checkout-session`).
// Nunca se confía en el precio que manda el navegador: así nadie puede pagar menos
// manipulando el carrito desde las herramientas de desarrollador.
const PRODUCT_PRICES: Record<string, number> = {
    p42: 12.85, p36: 5.85, p32: 8.75, p1: 9.50, p16: 13.90, p17: 12.90,
    p19: 7.50, p20: 9.85, p21: 13.50, p40: 10.50, p18: 8.75, p22: 4.75,
    p23: 8.00, p24: 7.50, p26: 11.70, p27: 7.50, p28: 11.90, p30: 5.60,
    p29: 3.50, p31: 12.75, p37: 8.50, p38: 5.80, p39: 8.50, p33: 5.80,
    p34: 5.75, p35: 13.85, p41: 4.20, p43: 12.50, p44: 7.50, p45: 4.50,
    p46: 3.20, p47: 14.75, p48: 4.75, p49: 6.00,
};

const ADMIN_EMAIL = "infopicoyamor@gmail.com";
const SHIPPING_PENINSULA = 4;
const SHIPPING_EXTRA = 8;
const FREE_SHIPPING_PENINSULA = 18;
const FREE_SHIPPING_EXTRA = 30;
const EXTRA_PENINSULAR_PROVINCES = [
    "LAS PALMAS", "SANTA CRUZ DE TENERIFE", "CEUTA", "MELILLA",
    "ILLES BALEARS", "BALEARES", "CANARIAS", "TENERIFE", "GRAN CANARIA",
];
const EXTRA_PENINSULAR_POSTAL_PREFIXES = ["35", "38", "51", "52", "07"];

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { items, customer_email, order_id } = await req.json();

        if (!order_id) throw new Error("Falta order_id");

        // 1. Recuperamos el pedido real guardado en la base de datos (para conocer la dirección de envío)
        const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("id", order_id)
            .single();

        if (orderError || !order) throw new Error("Pedido no encontrado");

        // 2. Recalculamos el precio de cada artículo a partir de PRODUCT_PRICES.
        //    Ignoramos por completo el precio que venga del navegador.
        const trustedItems = (items || [])
            .filter((item: any) => item?.id && PRODUCT_PRICES[item.id] !== undefined)
            .map((item: any) => ({
                id: item.id,
                name: item.name || item.id,
                image: item.image,
                quantity: Math.max(1, Math.floor(Number(item.quantity)) || 1),
                price: PRODUCT_PRICES[item.id],
            }));

        if (trustedItems.length === 0) throw new Error("No hay artículos válidos en el pedido");

        const subtotal = trustedItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

        // 3. Recalculamos el envío en el servidor usando la dirección guardada del pedido (no lo que mande el cliente).
        const isAdmin = order.customer_email === ADMIN_EMAIL;
        const province = String(order.customer_province || "").toUpperCase();
        const postalCode = String(order.customer_postal_code || "");
        const isExtraPeninsular =
            EXTRA_PENINSULAR_PROVINCES.some((p) => province.includes(p)) ||
            EXTRA_PENINSULAR_POSTAL_PREFIXES.some((prefix) => postalCode.startsWith(prefix));

        const shippingFee = isAdmin
            ? 0
            : isExtraPeninsular
                ? (subtotal >= FREE_SHIPPING_EXTRA ? 0 : SHIPPING_EXTRA)
                : (subtotal >= FREE_SHIPPING_PENINSULA ? 0 : SHIPPING_PENINSULA);

        const total = Math.round((subtotal + shippingFee) * 100) / 100;

        // 4. Corregimos el pedido en base de datos con los importes de confianza,
        //    por si el navegador había guardado otros distintos.
        await supabaseAdmin
            .from("orders")
            .update({
                items: trustedItems.map(({ id, name, quantity, price }: any) => ({ id, name, quantity, price })),
                shipping_cost: shippingFee,
                total,
            })
            .eq("id", order_id);

        // 5. Construimos los line items de Stripe con los precios de confianza.
        const line_items: any[] = trustedItems.map((item: any) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        if (shippingFee > 0) {
            line_items.push({
                price_data: {
                    currency: "eur",
                    product_data: { name: `Envío (${order.shipping_method || "Estándar"})` },
                    unit_amount: Math.round(shippingFee * 100),
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: order.customer_email || customer_email,
            line_items,
            mode: "payment",
            success_url: `${req.headers.get("origin")}/#/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/#/checkout`,
            metadata: {
                order_id: order_id,
            },
        });

        return new Response(JSON.stringify({ id: session.id, url: session.url }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
