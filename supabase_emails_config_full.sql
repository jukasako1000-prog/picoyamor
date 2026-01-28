-- ACTUALIZACIÓN DEL SISTEMA DE EMAILS (PICO & AMOR)
-- Este código añade el aviso automático de "Pedido Enviado"

create or replace function public.handle_order_notifications()
returns trigger language plpgsql security definer as $$
declare
  resend_key text := 're_PEGAR_AQUI_TU_CLAVE'; -- <--- PON TU CLAVE AQUÍ
  item_row record;
  items_html text := '';
  order_id_short text;
begin
  order_id_short := upper(substring(new.id::text from 1 for 8));

  -- 1. CASO: PEDIDO NUEVO (INSERT)
  if (TG_OP = 'INSERT') then
    -- Generar lista de productos
    for item_row in select * from jsonb_to_recordset(new.items) as x(name text, quantity int, price numeric) loop
      items_html := items_html || '<tr><td style="padding:10px 0; border-bottom:1px solid #f2ede4;">' || item_row.name || ' (x' || item_row.quantity || ')</td><td style="padding:10px 0; border-bottom:1px solid #f2ede4; text-align:right; font-weight:bold;">' || to_char(item_row.price, 'FM999,990.00') || '€</td></tr>';
    end loop;

    -- Email Cliente (Confirmación)
    perform net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object('Authorization', 'Bearer ' || resend_key, 'Content-Type', 'application/json'),
      body := jsonb_build_object(      'from', 'Pico & Amor <hola@picoyamor.com>',
      'to', ARRAY[new.customer_email],
      'reply_to', 'infopicoyamor@gmail.com',
      'subject', '¡Gracias por tu pedido! (#' || order_id_short || ')',
        'html', '<div style="font-family:sans-serif; max-width:600px; margin:0 auto; border:1px solid #f0f0f0; border-radius:20px; overflow:hidden;"><div style="background-color:#6c9371; padding:40px; text-align:center;"><h1 style="color:white; margin:0; font-size:28px;">¡Hola ' || new.customer_name || '! 🦜</h1><p style="color:#e8f5e9; font-size:18px;">Tu pedido ha sido recibido correctamente.</p></div>' ||
        '<div style="padding:40px; color:#3f3d3c;">' ||
        '<h2 style="border-bottom:2px solid #f2ede4; padding-bottom:10px; font-size:20px;">Pedido #' || order_id_short || '</h2>' ||
        '<table style="width:100%; border-collapse:collapse; margin-top:20px;">' ||
        items_html ||
        '<tr><td style="padding:10px 0; border-bottom:1px solid #f2ede4; color:#6c7a6e; font-size:14px;">Gastos de envío</td><td style="padding:10px 0; border-bottom:1px solid #f2ede4; text-align:right; font-weight:bold; color:#6c7a6e; font-size:14px;">' || (case when new.shipping_cost = 0 then 'GRATIS' else to_char(new.shipping_cost, 'FM999,990.00') || '€' end) || '</td></tr>' ||
        '<tr style="border-top:2px solid #f2ede4;">' ||
        '<td style="padding:20px 0; font-weight:bold; font-size:18px;">TOTAL</td>' ||
        '<td style="padding:20px 0; text-align:right; font-weight:bold; font-size:24px; color:#6c9371;">' || to_char(new.total, 'FM999,990.00') || '€</td></tr></table>' ||
        '<div style="margin-top:30px; padding:20px; background-color:#f9f9f7; border-radius:15px; border:1px dashed #d1d1d1;"><p style="margin:0; font-size:14px;"><strong>Próximos pasos:</strong> En cuanto tu paquete salga de nuestras manos, el estado cambiará a "Enviado" y recibirás otro aviso.</p></div></div><div style="background-color:#f2ede4; padding:30px; text-align:center; color:#6c7a6e; font-size:12px;"><p>Pico & Amor - Juguetes naturales para aves felices</p></div></div>'
      )
    );

    -- Email Admin (Aviso)
    perform net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object('Authorization', 'Bearer ' || resend_key, 'Content-Type', 'application/json'),
      body := jsonb_build_object('from', 'Sistema Pico & Amor <hola@picoyamor.com>', 'to', ARRAY['infopicoyamor@gmail.com'], 'subject', '🚨 NUEVO PEDIDO: #' || order_id_short, 'html', '<h1>¡Nuevo pedido de ' || new.customer_name || '!</h1><p>Valor: <strong>' || to_char(new.total, 'FM999,990.00') || '€</strong>.</p><a href="https://picoyamor.com/#/admin" style="background-color:#6c9371; color:white; padding:15px 25px; text-decoration:none; border-radius:10px; display:inline-block;">Ir al Panel Admin</a>')
    );

  -- 2. CASO: CAMBIO A ENVIADO (UPDATE)
  elsif (TG_OP = 'UPDATE' and old.status != 'enviado' and new.status = 'enviado') then
    -- Email Cliente (Aviso de Envío)
    perform net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object('Authorization', 'Bearer ' || resend_key, 'Content-Type', 'application/json'),
      body := jsonb_build_object(      'from', 'Pico & Amor <hola@picoyamor.com>',
      'to', ARRAY[new.customer_email],
      'reply_to', 'infopicoyamor@gmail.com',
      'subject', '¡Tu pedido de Pico & Amor está en camino! 🚚🚀',
        'html', '<div style="font-family:sans-serif; max-width:600px; margin:0 auto; border:1px solid #f0f0f0; border-radius:20px; overflow:hidden;"><div style="background-color:#6c9371; padding:40px; text-align:center;"><h1 style="color:white; margin:0; font-size:28px;">¡Grandes noticias, ' || new.customer_name || '! 🦜✨</h1><p style="color:#e8f5e9; font-size:18px;">Tu paquete acaba de salir de nuestro nido.</p></div><div style="padding:40px; color:#3f3d3c;"><p style="font-size:16px;">Estamos muy felices de confirmarte que tu pedido <strong>#' || order_id_short || '</strong> ya ha sido enviado.</p><div style="margin:20px 0; padding:25px; background-color:#f9f9f7; border-radius:15px; border:1px solid #f2ede4; text-align:center;"><p style="margin:0 0 10px 0; font-weight:bold; color:#6c9371;">¿Cuándo llegará?</p><p style="margin:0; font-size:14px;">Dependiendo de tu zona, deberías recibirlo en las próximas 24-72h laborables.</p></div><p style="font-size:14px; color:#6c7a6e;">Si tienes cualquier duda, recuerda que puedes contactarnos respondiendo a este email.</p></div><div style="background-color:#f2ede4; padding:30px; text-align:center; color:#6c7a6e; font-size:12px;"><p>¡Gracias por confiar en Pico & Amor! 💚</p></div></div>'
      )
    );
  end if;

  return new;
end; $$;

-- Eliminar triggers antiguos y crear el nuevo universal (Insert y Update)
drop trigger if exists on_new_order_email on public.orders;
drop trigger if exists on_order_notification on public.orders;

create trigger on_order_notification 
after insert or update on public.orders 
for each row execute function public.handle_order_notifications();
