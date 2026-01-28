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
        const { nombre, email, motivo, mensaje } = await req.json();

        if (!nombre || !email || !mensaje) {
            throw new Error("Faltan campos obligatorios");
        }

        // Enviar email al administrador (Eva)
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Contacto Pico & Amor <hola@picoyamor.com>",
                to: ["infopicoyamor@gmail.com"],
                reply_to: email,
                subject: `📩 Nuevo Mensaje: ${motivo || 'Consulta General'}`,
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 20px; overflow: hidden;">
            <div style="background-color: #6c9371; padding: 30px; text-align: center;">
              <h2 style="color: white; margin: 0;">¡Nuevo mensaje de contacto! 🦜</h2>
            </div>
            <div style="padding: 30px; color: #3f3d3c; line-height: 1.6;">
              <p><strong>De:</strong> ${nombre} (${email})</p>
              <p><strong>Asunto:</strong> ${motivo || 'Sin asunto'}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="white-space: pre-wrap;"><strong>Mensaje:</strong><br>${mensaje}</p>
            </div>
            <div style="background-color: #f2ede4; padding: 20px; text-align: center; color: #6c7a6e; font-size: 12px;">
              <p>Este mensaje fue enviado desde el formulario de contacto de picoyamor.com</p>
            </div>
          </div>
        `,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al enviar el email");
        }

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
