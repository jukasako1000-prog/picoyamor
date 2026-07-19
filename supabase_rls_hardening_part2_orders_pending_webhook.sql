-- ============================================================================
-- ENDURECIMIENTO DE POLÍTICAS RLS — Pico & Amor — PARTE 2 (tabla `orders`)
-- ============================================================================
-- ⚠️ NO EJECUTAR TODAVÍA.
--
-- Solo ejecutar esto cuando se cumplan AMBAS condiciones:
--   1. El webhook de Stripe (función stripe-webhook) está configurado y
--      probado (Stripe → Developers → Webhooks, con STRIPE_WEBHOOK_SECRET
--      guardado en Supabase).
--   2. La rama seo-mejoras (con el OrderSuccess.tsx nuevo, que ya no marca
--      el pedido como pagado desde el navegador) está fusionada y
--      desplegada en producción.
--
-- Por qué esperar: la web ACTUALMENTE en producción todavía marca el pedido
-- como "pagado" desde el navegador del cliente al volver de Stripe. Esta
-- parte del script le quita ese permiso a los clientes normales. Si se
-- ejecuta antes de que el webhook esté listo, cualquier pedido real que se
-- pague durante ese hueco se quedaría "pendiente" para siempre, sin email
-- de confirmación ni aviso a la tienda.
-- ============================================================================

create or replace function public._drop_all_policies(target_table text)
returns void language plpgsql as $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = target_table
  loop
    execute format('drop policy if exists %I on public.%I', pol.policyname, target_table);
  end loop;
end;
$$;

alter table public.orders enable row level security;
select public._drop_all_policies('orders');

create policy "orders_insert_public"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "orders_select_own_or_admin"
  on public.orders for select
  to authenticated
  using (
    auth.jwt() ->> 'email' = customer_email
    or auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com'
  );

create policy "orders_update_admin_only"
  on public.orders for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com')
  with check (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com');

create policy "orders_delete_admin_only"
  on public.orders for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com');

drop function if exists public._drop_all_policies(text);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- select tablename, policyname, cmd, roles
-- from pg_policies
-- where schemaname = 'public' and tablename = 'orders'
-- order by cmd;
