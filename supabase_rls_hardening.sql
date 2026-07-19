-- ============================================================================
-- ENDURECIMIENTO DE POLÍTICAS RLS — Pico & Amor
-- ============================================================================
-- ⚠️ REVISAR ANTES DE EJECUTAR. No lo ejecutes a ciegas.
--
-- Qué hace este script:
--   1. Activa Row Level Security en las 5 tablas de la tienda (si no lo estaba).
--   2. BORRA todas las políticas que existan actualmente en esas tablas
--      (sean cuales sean sus nombres) para partir de un estado limpio y conocido.
--   3. Crea un conjunto nuevo de políticas basado en lo que el código de la web
--      necesita realmente (revisado línea a línea en App.tsx, Admin.tsx,
--      Checkout.tsx, ClubPico.tsx, lib/db.ts).
--
-- Por qué hace falta:
--   Las políticas RLS son ADITIVAS: si queda una política antigua demasiado
--   permisiva conviviendo con una nueva más estricta, la antigua sigue
--   ganando. Por eso el paso 2 (borrar todo primero) es imprescindible para
--   que esto sirva de algo.
--
-- Cómo probarlo con seguridad:
--   Ejecuta esto primero en un proyecto/rama de Supabase de pruebas si tienes
--   uno, o si no, hazlo en un momento de poco tráfico y ten a mano el Panel
--   Admin abierto para comprobar en caliente que:
--     - La tienda pública sigue mostrando productos y permite comprar.
--     - Un pedido de invitado (sin iniciar sesión) se puede crear.
--     - El Panel Admin sigue pudiendo ver/editar todo tras iniciar sesión
--       con infopicoyamor@gmail.com.
--     - Un cliente normal (o la consola del navegador) NO puede borrar,
--       actualizar ni leer datos de otros clientes ni pedidos ajenos.
--
-- Cómo revertir si algo se rompe:
--   Cada bloque de abajo es independiente por tabla. Puedes desactivar RLS
--   de una tabla concreta temporalmente con:
--     ALTER TABLE public.<tabla> DISABLE ROW LEVEL SECURITY;
--   (esto la deja abierta de nuevo, úsalo solo como parche de emergencia).
-- ============================================================================

-- Función auxiliar: borra TODAS las políticas existentes de una tabla dada.
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
--    - Lectura pública (la tienda necesita mostrar stock a cualquiera).
--    - Cualquiera puede INSERTAR productos que falten (lo hace syncProducts()
--      en cada visita, es el comportamiento documentado en RESUMEN_PROYECTO.md).
--    - Solo el admin puede ACTUALIZAR (por ejemplo, cambiar el stock) o BORRAR.
--      Antes, si el UPDATE estaba abierto a cualquiera, cualquier visitante
--      podía poner el stock de un producto a 0 (o a 9999) desde la consola
--      del navegador sin ser admin.
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
-- 2. ORDERS
--    - Cualquiera (incluso invitados sin sesión) puede CREAR un pedido
--      pendiente — es como funciona el checkout de invitado.
--    - Un cliente logueado solo puede LEER sus propios pedidos (comparando
--      el email). El admin puede leer todos.
--    - Solo el admin puede ACTUALIZAR (cambiar estado a enviado/entregado) o
--      BORRAR pedidos. IMPORTANTE: antes la propia web marcaba el pedido como
--      "pagado" desde el navegador del cliente al volver de Stripe (ya se ha
--      corregido en el código: ahora lo hace la función stripe-webhook con
--      la clave de servicio, que se salta RLS). Por eso ya no hace falta que
--      ningún cliente pueda actualizar pedidos directamente.
-- ============================================================================
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

-- ============================================================================
-- 3. PROFILES
--    - Un usuario solo puede crear/editar/leer SU PROPIO perfil (auth.uid() = id).
--    - El admin puede leer y borrar cualquier perfil (Gestión de Clientes).
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
-- 4. REVIEWS
--    - Cualquiera puede leer las reseñas ya aprobadas (is_approved = true).
--      El admin puede leer también las pendientes.
--    - Cualquiera puede ENVIAR una reseña nueva, pero SIEMPRE como no
--      aprobada (is_approved debe ser false o null al crearla) — así nadie
--      puede auto-publicarse una reseña saltándose la revisión del admin.
--    - Solo el admin puede aprobar/ocultar (update) o borrar reseñas.
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
-- 5. CONTACT_MESSAGES
--    - Cualquiera puede enviar un mensaje de contacto (ya existía esta
--      política en supabase_contact_table.sql, se mantiene igual).
--    - Solo el admin puede leer/borrar los mensajes recibidos.
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

-- Limpieza de la función auxiliar (ya no hace falta una vez aplicado el script)
drop function if exists public._drop_all_policies(text);

-- ============================================================================
-- VERIFICACIÓN: ejecuta esto después para ver el resultado final
-- ============================================================================
-- select tablename, policyname, cmd, roles
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in ('products', 'orders', 'profiles', 'reviews', 'contact_messages')
-- order by tablename, cmd;
