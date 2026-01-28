-- 1. Crear la tabla para guardar los mensajes de contacto
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

-- 3. Crear la función que envía el email al insertar en esta tabla
create or replace function public.handle_contact_notification()
returns trigger language plpgsql security definer as $$
declare
  resend_key text := 're_PEGAR_AQUI_TU_CLAVE'; -- <--- TU CLAVE AQUÍ
begin
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
      'subject', '📩 Nuevo Mensaje: ' || coalesce(new.motivo, 'Consulta'),
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
  return new;
end; $$;

-- 4. Crear el trigger para esta tabla
drop trigger if exists on_contact_message on public.contact_messages;
create trigger on_contact_message
after insert on public.contact_messages
for each row execute function public.handle_contact_notification();
