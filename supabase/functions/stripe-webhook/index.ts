import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.2";

// Esta función la llama Stripe directamente (no el navegador), por eso debe
// desplegarse con `supabase functions deploy stripe-webhook --no-verify-jwt`.

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2022-11-15",
    httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event;
    try {
        if (!signature || !webhookSecret) throw new Error("Falta firma o STRIPE_WEBHOOK_SECRET");
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
        console.error("Firma de webhook de Stripe inválida:", err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        const relevantEvents = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];

        if (relevantEvents.includes(event.type)) {
            const session = event.data.object as any;

            if (session.payment_status === "paid") {
                const orderId = session.metadata?.order_id;

                if (orderId) {
                    // Idempotente: solo actualiza (y descuenta stock) si el pedido no estaba ya marcado como pagado.
                    // Esto es lo único que confirma un pago real: nunca el navegador del cliente.
                    const { data: updatedOrders, error } = await supabaseAdmin
                        .from("orders")
                        .update({ status: "pagado" })
                        .eq("id", orderId)
                        .neq("status", "pagado")
                        .select();

                    if (error) throw error;

                    if (updatedOrders && updatedOrders.length > 0) {
                        const order = updatedOrders[0];
                        const itemsToUpdate = (order.items || [])
                            .filter((i: any) => i?.id)
                            .map((i: any) => ({ id: i.id, quantity: i.quantity }));

                        if (itemsToUpdate.length > 0) {
                            const { error: stockError } = await supabaseAdmin.rpc("decrement_stock", {
                                items_to_update: itemsToUpdate,
                            });
                            if (stockError) console.error("Error descontando stock:", stockError.message);
                        }
                    }
                }
            }
        }

        return new Response(JSON.stringify({ received: true }), { status: 200 });
    } catch (error) {
        console.error("Error procesando webhook de Stripe:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
