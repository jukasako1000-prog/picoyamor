-- 1. Habilitar la extensión para enviar peticiones HTTP desde la base de datos
create extension if not exists "pg_net";

-- 2. Crear la función que envía los correos
create or replace function public.handle_new_order_emails()
returns trigger
language plpgsql
security definer
as $$
declare
  resend_key text := 're_PEGAR_AQUI_TU_CLAVE'; -- ESCRIBE AQUÍ LA CLAVE DE RESEND
  item_row record;
  items_html text := '';
  order_id_short text;
begin
  -- Acortar el ID del pedido para el email
  order_id_short := upper(substring(new.id::text from 1 for 8));

  -- Generar la lista de productos en HTML
  for item_row in select * from jsonb_to_recordset(new.items) as x(name text, quantity int, price numeric)
  loop
    items_html := items_html || 
      '<tr><td style="padding:10px 0; border-bottom:1px solid #f2ede4;">' || item_row.name || ' (x' || item_row.quantity || ')</td>' ||
      '<td style="padding:10px 0; border-bottom:1px solid #f2ede4; text-align:right; font-weight:bold;">' || item_row.price || '€</td></tr>';
  end loop;

  -- ENVIAR EMAIL AL CLIENTE (Confirmación)
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Pico & Amor <hola@picoyamor.com>',
      'to', ARRAY[new.customer_email],
      'subject', '¡Gracias por tu pedido en Pico & Amor! (#' || order_id_short || ')',
      'html', 
        '<div style="font-family:sans-serif; max-width:600px; margin:0 auto; border:1px solid #f0f0f0; border-radius:20px; overflow:hidden;">' ||
        '<div style="background-color:#6c9371; padding:40px; text-align:center;">' ||
        '<h1 style="color:white; margin:0; font-size:28px;">¡Hola ' || new.customer_name || '! 🦜</h1>' ||
        '<p style="color:#e8f5e9; font-size:18px;">Tu pedido ha sido recibido correctamente.</p></div>' ||
        '<div style="padding:40px; color:#3f3d3c;">' ||
        '<h2 style="border-bottom:2px solid #f2ede4; padding-bottom:10px; font-size:20px;">Resumen del Pedido #' || order_id_short || '</h2>' ||
        '<table style="width:100%; border-collapse:collapse; margin-top:20px;">' ||
        items_html ||
        '<tr style="border-top:2px solid #f2ede4;">' ||
        '<td style="padding:20px 0; font-weight:bold; font-size:18px;">TOTAL</td>' ||
        '<td style="padding:20px 0; text-align:right; font-weight:bold; font-size:24px; color:#6c9371;">' || new.total || '€</td></tr></table>' ||
        '<div style="margin-top:30px; padding:20px; background-color:#f9f9f7; border-radius:15px; border:1px dashed #d1d1d1;">' ||
        '<p style="margin:0; font-size:14px;"><strong>Próximos pasos:</strong> En cuanto tu paquete salga de nuestras manos, el estado de tu pedido cambiará a "Enviado" y recibirás un nuevo aviso por aquí.</p></div></div>' ||
        '<div style="background-color:#f2ede4; padding:30px; text-align:center; color:#6c7a6e; font-size:12px;">' ||
        '<p>Pico & Amor - Juguetes naturales para aves felices</p><p>picoyamor.com</p></div></div>'
    )
  );

  -- ENVIAR EMAIL AL ADMIN (Aviso)
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Sistema Pico & Amor <hola@picoyamor.com>',
      'to', ARRAY['infopicoyamor@gmail.com'],
      'subject', '🚨 NUEVO PEDIDO: #' || order_id_short,
      'html', 
        '<h1>¡Nuevo pedido de ' || new.customer_name || '!</h1>' ||
        '<p>Se ha registrado un nuevo pedido por valor de <strong>' || new.total || '€</strong>.</p>' ||
        '<p>Entra en el panel de administración para ver los detalles.</p>' ||
        '<a href="https://picoyamor.com/admin" style="background-color:#6c9371; color:white; padding:15px 25px; text-decoration:none; border-radius:10px; display:inline-block;">Ir al Panel Admin</a>'
    )
  );

  return new;
end;
$$;

-- 3. Crear el trigger que activa la función al entrar un pedido
drop trigger if exists on_new_order_email on public.orders;
create trigger on_new_order_email
after insert on public.orders
for each row execute function public.handle_new_order_emails();
