import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const payload = await req.json();
        const { record } = payload; // Supabase Webhook payload format

        if (!record) throw new Error("No record found in payload");

        const { customer_name, customer_email, total, items, id } = record;
        const orderIdShort = id.slice(0, 8).toUpperCase();

        // 1. Email para el Cliente (Confirmación)
        const clientEmail = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Pico & Amor <hola@picoyamor.com>",
                to: [customer_email],
                subject: `¡Gracias por tu pedido en Pico & Amor! (#${orderIdShort})`,
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 20px; overflow: hidden;">
            <div style="background-color: #6c9371; padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">¡Hola ${customer_name}! 🦜</h1>
              <p style="color: #e8f5e9; font-size: 18px;">Tu pedido ha sido recibido correctamente.</p>
            </div>
            <div style="padding: 40px; color: #3f3d3c;">
              <h2 style="border-bottom: 2px solid #f2ede4; padding-bottom: 10px; font-size: 20px;">Resumen del Pedido #${orderIdShort}</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                ${items.map((item: any) => `
                  <tr>
                    <td style="padding: 10px 0;">${item.name} (x${item.quantity})</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${item.price.toFixed(2)}€</td>
                  </tr>
                `).join('')}
                <tr style="border-top: 2px solid #f2ede4;">
                  <td style="padding: 20px 0; font-weight: bold; font-size: 18px;">TOTAL</td>
                  <td style="padding: 20px 0; text-align: right; font-weight: bold; font-size: 24px; color: #6c9371;">${total.toFixed(2)}€</td>
                </tr>
              </table>
              <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f7; border-radius: 15px; border: 1px dashed #d1d1d1;">
                <p style="margin: 0; font-size: 14px;"><strong>Próximos pasos:</strong> En cuanto tu paquete salga de nuestras manos, el estado de tu pedido cambiará a "Enviado" y recibirás un nuevo aviso por aquí.</p>
              </div>
            </div>
            <div style="background-color: #f2ede4; padding: 30px; text-align: center; color: #6c7a6e; font-size: 12px;">
              <p>Pico & Amor - Juguetes naturales para aves felices</p>
              <p>picoyamor.com</p>
            </div>
          </div>
        `,
            }),
        });

        // 2. Email para el Administrador (Aviso)
        const adminEmail = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Sistema Pico & Amor <hola@picoyamor.com>",
                to: ["infopicoyamor@gmail.com"],
                subject: `🚨 NUEVO PEDIDO RECIBIDO: #${orderIdShort}`,
                html: `
          <h1>¡Nuevo pedido de ${customer_name}!</h1>
          <p>Se ha registrado un nuevo pedido por valor de <strong>${total.toFixed(2)}€</strong>.</p>
          <p>Entra en el panel de administración para ver los detalles y gestionar el envío.</p>
          <a href="https://picoyamor.com/admin" style="background-color: #6c9371; color: white; padding: 15px 25px; text-decoration: none; border-radius: 10px; display: inline-block;">Ir al Panel Admin</a>
        `,
            }),
        });

        return new Response(JSON.stringify({ success: true }), {
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
