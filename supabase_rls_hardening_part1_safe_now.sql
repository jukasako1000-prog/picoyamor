-- ============================================================================
-- ENDURECIMIENTO DE POLÍTICAS RLS — Pico & Amor — PARTE 1 (segura ahora mismo)
-- ============================================================================
-- No toca la tabla `orders` a propósito: esa parte (supabase_rls_hardening_
-- part2_orders_pending_webhook.sql) se deja para cuando el webhook de Stripe
-- esté configurado, porque la web actualmente en producción todavía depende
-- de poder actualizar `orders` desde el navegador del cliente.
--
-- Este archivo SÍ es seguro de ejecutar ya, sin esperar a nada: no cambia el
-- comportamiento de ninguna parte de la web que esté en producción ahora
-- mismo (revisado contra App.tsx, Admin.tsx, ClubPico.tsx, lib/db.ts).
-- No borra ningún dato, solo reglas de acceso (políticas RLS) y un permiso
-- de una función.
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

-- ============================================================================
-- 1. PRODUCTS
-- ============================================================================
alter table public.products enable row level security;
select public._drop_all_policies('products');

create policy "products_select_public"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "products_insert_public_sync"
  on public.products for insert
  to anon, authenticated
  with check (true);

create policy "products_update_admin_only"
  on public.products for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com')
  with check (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com');

create policy "products_delete_admin_only"
  on public.products for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com');

-- ============================================================================
-- 2. PROFILES
-- ============================================================================
alter table public.profiles enable row level security;
select public._drop_all_policies('profiles');

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (
    auth.uid() = id
    or auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com'
  );

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  to authenticated
  using (
    auth.uid() = id
    or auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com'
  )
  with check (
    auth.uid() = id
    or auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com'
  );

create policy "profiles_delete_admin_only"
  on public.profiles for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com');

-- ============================================================================
-- 3. REVIEWS
-- ============================================================================
alter table public.reviews enable row level security;
select public._drop_all_policies('reviews');

create policy "reviews_select_approved_or_admin"
  on public.reviews for select
  to anon, authenticated
  using (
    is_approved = true
    or auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com'
  );

create policy "reviews_insert_public_unapproved"
  on public.reviews for insert
  to anon, authenticated
  with check (coalesce(is_approved, false) = false);

create policy "reviews_update_admin_only"
  on public.reviews for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com')
  with check (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com');

create policy "reviews_delete_admin_only"
  on public.reviews for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com');

-- ============================================================================
-- 4. CONTACT_MESSAGES
-- ============================================================================
alter table public.contact_messages enable row level security;
select public._drop_all_policies('contact_messages');

create policy "contact_messages_insert_public"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "contact_messages_select_admin_only"
  on public.contact_messages for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com');

create policy "contact_messages_delete_admin_only"
  on public.contact_messages for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'infopicoyamor@gmail.com');

-- ============================================================================
-- 5. FUNCIÓN decrement_stock: que solo la use el sistema (service role),
--    nunca directamente un visitante.
-- ============================================================================
-- OJO: revocar solo de anon/authenticated NO basta, porque Postgres concede
-- EXECUTE a PUBLIC (todos los roles) por defecto al crear la función, y
-- anon/authenticated heredan de PUBLIC. Hay que revocárselo también a PUBLIC.
revoke execute on function public.decrement_stock(jsonb) from public;
revoke execute on function public.decrement_stock(jsonb) from anon, authenticated;

drop function if exists public._drop_all_policies(text);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- select tablename, policyname, cmd, roles
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in ('products', 'profiles', 'reviews', 'contact_messages')
-- order by tablename, cmd;
