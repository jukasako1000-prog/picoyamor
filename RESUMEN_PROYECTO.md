# 🦜 Pico & Amor - Resumen de Integración (Supabase + Gestión)

Este archivo sirve como guía maestra para cualquier desarrollador o agente de IA que continúe este proyecto.

## 🔧 Auditoría y endurecimiento (rama `seo-mejoras`, 19 julio 2026)

Se hizo una auditoría completa (seguridad, rendimiento, SEO) y se aplicaron los arreglos en esta
rama. **Nada de esto está desplegado todavía en producción** — hace falta completar los pasos
manuales de despliegue antes de fusionar a `main`.

### ✅ Cambios ya hechos en el código de esta rama
1. **Precio del checkout blindado**: `create-checkout-session` ahora recalcula precio y envío en
   el servidor a partir de un mapa de precios de confianza (`PRODUCT_PRICES` dentro de la propia
   función) y de la dirección guardada del pedido, ignorando por completo lo que mande el
   navegador. **Importante**: si añades o cambias un precio en `constants.tsx`, tienes que
   actualizar también ese mapa en `supabase/functions/create-checkout-session/index.ts` y volver
   a desplegar la función.
2. **Confirmación de pago movida al servidor**: se ha creado la función `stripe-webhook`. Antes,
   `OrderSuccess.tsx` marcaba el pedido como "pagado" directamente desde el navegador del cliente
   al volver de Stripe, sin comprobar que el pago se hubiese completado de verdad — cualquiera
   podía marcar un pedido como pagado sin pagar. Ahora solo el webhook de Stripe (verificando la
   firma) marca el pedido como pagado, y de paso descuenta el stock automáticamente.
3. **Código muerto de "Pico Bot" eliminado**: `AIAssistant.tsx` y `geminiService.ts` no estaban
   enlazados a ningún sitio de la web (no se usaban). Se han borrado junto con la dependencia
   `@google/genai` y la `GEMINI_API_KEY` incrustada en `vite.config.ts`, que quedaba expuesta en
   el JavaScript público aunque el asistente no estuviera activo.
4. **Endurecimiento de RLS, dividido en dos partes**:
   - `supabase_rls_hardening_part1_safe_now.sql` — **YA EJECUTADO contra producción y verificado**
     (19 julio 2026): `products`, `profiles`, `reviews`, `contact_messages` y el permiso de
     `decrement_stock` (antes cualquiera podía llamarlo directamente y manipular el stock sin
     comprar). Comprobado con peticiones reales: la tienda pública sigue funcionando y un usuario
     anónimo ya NO puede cambiar el stock de un producto ni ejecutar `decrement_stock`.
   - `supabase_rls_hardening_part2_orders_pending_webhook.sql` — **pendiente**. Solo la tabla
     `orders`. Se deja aparte a propósito: la web en producción todavía marca el pedido como
     pagado desde el navegador del cliente, así que aplicar esto antes de tener el webhook de
     Stripe listo dejaría los pedidos reales sin poder confirmarse. Ejecutar solo cuando el
     webhook esté configurado y probado.
5. **Imágenes y vídeos comprimidos**: las ~49 imágenes de producto se han convertido de
   PNG/JPEG a WebP (de ~26 MB a ~2,9 MB) y los 7 vídeos de portada se han recomprimido quitando el
   audio silencioso (de ~8,5 MB a ~2,5 MB). Todas las referencias en el código se han actualizado.
6. **Tailwind compilado en vez de CDN**: se ha quitado el script `cdn.tailwindcss.com` (pensado
   solo para desarrollo) y se ha instalado Tailwind v3 de verdad (`tailwind.config.js`,
   `postcss.config.js`, `index.css` con `@tailwind` importado desde `index.tsx`). Misma paleta,
   tipografía y plugins (`forms`, `container-queries`) que antes, verificado que compilan igual.
7. **SEO básico**: meta description, Open Graph/Twitter Card (con imagen `og-image.jpg` generada
   a partir del logo), favicon y apple-touch-icon, y `sitemap.xml`. `robots.txt` ya existía y
   bloqueaba `/admin` correctamente.
8. Limpieza menor: quitado el `importmap` de `esm.sh` (vestigio del scaffold de AI Studio, ya no
   hace falta porque Vite empaqueta React localmente) e instalados `@types/react`/`@types/react-dom`
   que faltaban (el build funcionaba igual porque Vite no comprueba tipos, pero el editor marcaba
   toda la app en rojo).

### ⏳ Pasos manuales pendientes antes de fusionar a `main`
1. ✅ ~~Desplegar las funciones edge~~ — **HECHO** (19 julio 2026): `create-checkout-session` y
   `stripe-webhook` ya están desplegadas en el proyecto real (hubo que cambiar el import de
   `@supabase/supabase-js` de `esm.sh` a `npm:` porque el bundler remoto no resolvía esm.sh).
2. ✅ ~~Ejecutar la parte segura del RLS~~ — **HECHO y verificado** (ver punto 4 arriba).
3. **Configurar el webhook de Stripe** ← siguiente paso, bloqueado a la espera del acceso de la
   propietaria a la cuenta de Stripe. En el Dashboard de Stripe → Developers → Webhooks → Add
   endpoint, apuntando a:
   `https://xmxidbtrntbnykufucwi.supabase.co/functions/v1/stripe-webhook`, escuchando los eventos
   `checkout.session.completed` y `checkout.session.async_payment_succeeded`. Copiar el "Signing
   secret" (`whsec_...`) y guardarlo como secreto de la función:
   `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`.
4. **Ejecutar `supabase_rls_hardening_part2_orders_pending_webhook.sql`** — solo después del
   paso 3, para no dejar pedidos reales sin poder confirmarse durante la transición.
5. ✅ ~~Rotar la `GEMINI_API_KEY`~~ — **HECHO** (19 julio 2026): las dos claves antiguas del
   proyecto en Google AI Studio se borraron. No hace falta clave nueva porque Pico Bot ya no
   existe en el código.
6. **Analítica pendiente de credenciales**: no se ha instalado Google Analytics ni Meta Pixel
   porque hace falta que la propietaria cree la cuenta (o pase el ID si ya existe). En cuanto se
   tenga el ID de medición (GA4: `G-XXXXXXX`, o el Pixel ID de Meta), añadirlo es cuestión de
   pegar el script correspondiente en `index.html`.
7. Revisar visualmente la web en `npm run dev` tras el despliegue para confirmar que no hay
   regresiones visuales del cambio de Tailwind.
8. (Opcional, detectado por el auditor de seguridad de Supabase, no bloqueante): activar
   "Leaked Password Protection" en Authentication → Settings del Dashboard de Supabase, y revisar
   la política del bucket de Storage `reviews` (permite listar todos los ficheros subidos).

### 📝 Nota para el futuro sobre HashRouter
La web usa `HashRouter` (URLs tipo `/#/tienda`), lo que limita el posicionamiento en Google frente
a URLs normales. Migrar a `BrowserRouter` mejoraría el SEO pero requiere configurar reglas de
redirección en el hosting (Vercel/Netlify) para que cualquier ruta sirva `index.html`. No se ha
tocado en esta pasada por ser un cambio más grande; queda como mejora futura opcional.

## 🚀- **Estado Actual**: ¡Listo para Lanzamiento! 🚀
- **Última Actualización**: 23 de marzo, 2026 - 22:30h
- **Hitos Recientes**: 
  - ✅ **Blindaje de Activos (Inmortalidad Visual)**: Migración masiva de imágenes críticas (Logo, Productos, Blog, Nosotros, Contacto) de servidores externos (Postimages) a archivos locales en la carpeta `public`. La web es ahora mucho más rápida y 100% independiente de caídas externas.
  - ✅ **Seguridad Admin Reforzada**: Blindaje del acceso a privilegios de administrador. Ahora, el envío gratis y el modo test solo se activan para el email oficial si el usuario está **autenticado con contraseña** (`!isGuest`), eliminando la vulnerabilidad del campo de email en el modo invitado.
  - ✅ **Nueva Política de Envíos**: Actualizado el umbral de envío gratuito para la Península de **15€ a 18€**. Para **Otros Destinos** (Islas, Ceuta y Melilla), la tarifa plana sube de **7€ a 8€** y el envío gratuito de **25€ a 30€**, unificando la lógica en Checkout, Carrito y documentación.
  - ✅ **Optimización del Blog**: Reordenación estratégica de categorías (Todos, Juegos, Salud, Cuidados) y restauración visual completa con activos locales.
  - ✅ **Verificación Stripe LIVE (ÉXITO)**: Primera transacción real de 1€ completada con éxito. El sistema está 100% operativo tanto en frontend como en el backend de Supabase.
  - ✅ **Flujo de Trabajo Profesional**: Implementado sistema de ramas (branches). Se ha creado la rama `feature/actualizaciones` como laboratorio de pruebas, manteniendo `main` como la versión estable de producción.
  - ✅ **Actualización de Catálogo (23 Mar 2026)**:
    - ✨ **Nuevo Lanzamiento**: Añadido el *Espiral colgador* (Sisál 54cm) a la sección de Forrajeo/Colgantes, con escala visual optimizada (1.4).
  - ✅ **Actualización de Catálogo (22 Feb 2026)**:
    - ✨ **Nuevo Lanzamiento**: Añadido el *Colgante Piedra Mineral Mini* a la sección de Forrajeo/Colgantes.
  - ✅ **Ajustes de Catálogo (19 Feb 2026)**:
    - 🏷️ **Ajuste de Precios**: Actualizados los precios: *Columpio Globo* (11.50€), *Pack Aventura* (9.50€) y *Juguete Balanceo* (8.50€).
  - ✅ **Actualización de Catálogo (17 Feb 2026)**:
    - ✨ **Nuevo Lanzamiento**: Añadido el *Mini columpio* a la sección de Columpios.
    - 🏷️ **Cambio de Nombre**: El producto *Colgante Aromas* pasa a llamarse *Aro más colgante*.
  - ✅ **Expansión del Catálogo (16 Feb 2026)**:
    - ✨ **Nuevo Lanzamiento**: Añadido el *Parquecito para aves pequeñas* a la sección de Columpios, con escala visual optimizada (1.25) para resaltar su diseño artesanal.
  - ✅ **Actualización de Catálogo y Precios (15 Feb 2026)**: 
    - 🏷️ **Ajuste de Precios**: Reducción estratégica del precio de la *Tarta de Corcho* (9.85€) y el *Columpio Naturaleza* (10.50€).
    - 🧹 **Optimización de Inventario**: Eliminados los productos *Columpio Diversión Rattan* y *Columpio más cuerda* para evitar duplicidades con las nuevas piezas del catálogo.
    - ✨ **Nuevo Lanzamiento**: Añadido el *Colgante de colores* a la sección de Forrajeo/Colgantes, optimizando su escala visual (1.25) para una mejor presentación.
  - ✅ **Identidad Corporativa Protegida**: Logo de la marca (Pico & Amor) restaurado en local para cabecera, footer y página de contacto, asegurando que la marca siempre esté visible.

### 💎 Hitos de Estabilización y Mejoras Recientes
1. **Comunicación 360º Activada (ÉXITO)**: 📩
    - **Doble Aviso de Contacto**: Se ha implementado y verificado un sistema donde, al recibir una consulta, se envía un aviso inmediato a `infopicoyamor@gmail.com` y simultáneamente un email de confirmación con diseño premium al cliente.
    - **Emails de Pedidos**: Sincronización completa de los estados de pedido (Pagado -> Enviado) con notificaciones automáticas al cliente.
2. **Seguridad Blindada (RLS Completado)**: 🔐
    - Políticas de **Row Level Security** activas. La base de datos está protegida y solo el admin tiene acceso total.
3. **Flujo de Pago Robusto**:
    - Sistema de persistencia de ID de pedido en `localStorage` para evitar fallos al volver de Stripe.
    - Eliminado el bloqueo de scroll al finalizar la compra.
4. **Catálogo y Forrajeo**:
    - Categoría **"Forrajeo/Colgantes"** 100% operativa en código y base de datos.

### 🛠️ Infraestructura de Datos (Supabase)
- **Tablas**: `products` (stock), `orders` (ventas), `contact_messages` (consultas), `profiles` (usuarios), `reviews` (reseñas).
- **Lógica en Base de Datos**: 
    - El envío de emails se gestiona mediante triggers y funciones PL/pgSQL que llaman a la API de **Resend**.
    - **Importante**: La extensión `pg_net` debe estar habilitada en Supabase.

### 📂 Guía de Archivos Críticos
- `constants.tsx`: **Origen de la Verdad.** Modificar aquí para añadir productos o cambiar imágenes de la web.
- `supabase_contact_table.sql`: Contiene el código para los emails de contacto.
- `supabase_emails_config_full.sql`: Contiene el código para los emails de pedidos.
- `App.tsx`: Lógica principal y rutas.

## ⚠️ Manual de Mantenimiento para el Futuro
1. **Cambio de Claves**: Si la clave de Resend cambia, hay que actualizar las funciones `handle_contact_notification` (en `contact_messages`) y `handle_order_notifications` (en `orders`) a través del editor SQL de Supabase.
2. **Añadir Productos**: 
   1. Añadir a `constants.tsx`.
   2. La web lo detectará y lo creará en Supabase con stock 0.
   3. Entrar en el Panel Admin (`/admin`) para poner el stock real.
3. **Gestión de Reseñas**: Se gestionan y aprueban exclusivamente desde el Panel Admin para evitar spam.

---
*¡Proyecto fino, seguro y listo para vender!* 🦜✨🚀
