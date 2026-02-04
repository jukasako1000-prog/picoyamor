# 🦜 Pico & Amor - Resumen de Integración (Supabase + Gestión)

Este archivo sirve como guía maestra para cualquier desarrollador o agente de IA que continúe este proyecto.

## 🚀- **Estado Actual**: Activo (En mantenimiento)
- **Última Actualización**: 4 de febrero, 2026 - 16:10h
- **Hitos Recientes**: 
  - ✅ **Transformación Artesanal**: Rediseño de la sección "Novedades" a **"En el Taller"**, integrando fotos reales del proceso y narrativa de marca enfocada en la calidad hecha a mano.
  - ✅ **Ampliación de Catálogo**: Añadidos nuevos productos (Columpio Tricolor, Columpio Forrajeo Natural) y actualización estratégica de precios y descripciones.
  - ✅ **Refinamiento Visual**: Implementada la capacidad de ajuste vertical (`translateY`) para imágenes de productos, logrando una maquetación "hilar fino" perfecta.
  - ✅ **Logística Inteligente**: Implementado sistema de estados de pedido (Pendiente de Pago 🔴, Pagado 🟢, Enviado 🔵).
  - ✅ **Checkout Robusto**: Sincronización automática de estados tras el pago en Stripe (OrderSuccess 🔄 Supabase).
  - ✅ **Refinamiento Mobile**: Barra de scroll interactiva sincronizada con el movimiento del usuario y limpieza estética de navegación.
  - ✅ **Seguridad**: Interceptor de recuperación de claves y RLS optimizado.
  - ✅ Añadidos nuevos productos al catálogo (Columpio Globo, Colgante Aromas).

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
