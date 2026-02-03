-- 1. Crear la tabla para guardar los mensajes de contacto (si no existe)
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nombre text not null,
  email text not null,
  motivo text,
  mensaje text not null
);

-- 2. Habilitar que cualquiera pueda enviar mensajes (RLS)
alter table public.contact_messages enable row level security;
create policy "Cualquiera puede enviar mensajes de contacto"
  on public.contact_messages for insert
  with check (true);

-- 3. Crear la función que envía DOBLE email (Aviso a Tienda + Confirmación a Cliente)
create or replace function public.handle_contact_notification()
returns trigger language plpgsql security definer as $$
declare
  resend_key text := 're_PEGAR_AQUI_TU_CLAVE'; -- <--- TU CLAVE DE RESEND AQUÍ
begin
  -- A. EMAIL PARA LA TIENDA (Aviso de nuevo mensaje)
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Contacto Pico & Amor <hola@picoyamor.com>',
      'to', ARRAY['infopicoyamor@gmail.com'],
      'reply_to', new.email,
      'subject', '📩 Nuevo Mensaje: ' || coalesce(new.motivo, 'Consulta de ' || new.nombre),
      'html', 
        '<div style="font-family:sans-serif; max-width:600px; margin:0 auto; border:1px solid #f0f0f0; border-radius:20px; overflow:hidden;">' ||
        '<div style="background-color:#6c9371; padding:30px; text-align:center;"><h2 style="color:white; margin:0;">¡Nuevo mensaje de contacto! 🦜</h2></div>' ||
        '<div style="padding:30px; color:#3f3d3c; line-height:1.6;">' ||
        '<p><strong>De:</strong> ' || new.nombre || ' (' || new.email || ')</p>' ||
        '<p><strong>Asunto:</strong> ' || coalesce(new.motivo, 'Sin asunto') || '</p>' ||
        '<hr style="border:0; border-top:1px solid #eee; margin:20px 0;">' ||
        '<p style="white-space:pre-wrap;"><strong>Mensaje:</strong><br>' || new.mensaje || '</p>' ||
        '<div style="text-align:center; margin-top:20px;"><a href="https://picoyamor.com/#/admin" style="background-color:#6c9371; color:white; padding:12px 20px; text-decoration:none; border-radius:10px; display:inline-block;">Ir al Panel Admin</a></div></div>' ||
        '<div style="background-color:#f2ede4; padding:20px; text-align:center; color:#6c7a6e; font-size:12px;"><p>Enviado desde picoyamor.com</p></div></div>'
    )
  );

  -- B. EMAIL PARA EL CLIENTE (Confirmación de recibido)
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Pico & Amor <hola@picoyamor.com>',
      'to', ARRAY[new.email],
      'reply_to', 'infopicoyamor@gmail.com',
      'subject', '¡Hemos recibido tu consulta! 🦜✨',
      'html', 
        '<div style="font-family:sans-serif; max-width:600px; margin:0 auto; border:1px solid #f0f0f0; border-radius:20px; overflow:hidden;">' ||
        '<div style="background-color:#6c9371; padding:30px; text-align:center;"><h2 style="color:white; margin:0;">¡Hola ' || new.nombre || '!</h2></div>' ||
        '<div style="padding:40px; color:#3f3d3c; line-height:1.6; text-align:center;">' ||
        '<p style="font-size:18px;">Muchas gracias por contactar con <strong>Pico & Amor</strong>.</p>' ||
        '<p>Hemos recibido tu consulta sobre <strong>"' || coalesce(new.motivo, 'nuestros productos') || '"</strong> y nuestro equipo te responderá lo antes posible (normalmente en menos de 24h).</p>' ||
        '<div style="margin:30px 0; padding:20px; background-color:#f9f9f7; border-radius:15px; border:1px dashed #6c9371;">' ||
        '<p style="margin:0; font-style:italic;">"Nuestra misión es la felicidad de tu agapornis."</p></div>' ||
        '<p style="color:#6c7a6e; font-size:14px;">Si necesitas añadir algo más, simplemente responde a este correo.</p></div>' ||
        '<div style="background-color:#f2ede4; padding:20px; text-align:center; color:#6c7a6e; font-size:12px;"><p>Pico & Amor - Juguetes naturales para aves felices</p></div></div>'
    )
  );

  return new;
end; $$;

-- 4. Crear el trigger para esta tabla
drop trigger if exists on_contact_message on public.contact_messages;
create trigger on_contact_message
after insert on public.contact_messages
for each row execute function public.handle_contact_notification();
