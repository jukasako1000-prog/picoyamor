import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2022-11-15",
    httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { items, customer_email, order_id } = await req.json();

        const line_items = items.map((item: any) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100), // Stripe usa céntimos
            },
            quantity: item.quantity,
        }));

        // Añadir envío si es necesario (puedes pasarlo como un item más o usar shipping_options)
        // Para simplificar, lo pasamos como un concepto más de línea si viene en el total

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: customer_email,
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
