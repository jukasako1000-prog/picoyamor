# 🦜 Pico & Amor - Resumen de Integración (Supabase + Gestión)

Este archivo sirve como guía maestra para cualquier desarrollador o agente de IA que continúe este proyecto.

## 🚀- **Estado Actual**: ¡Listo para Lanzamiento! 🚀
- **Última Actualización**: 6 de febrero, 2026 - 16:00h
- **Hitos Recientes**: 
  - ✅ **Blindaje de Activos (Inmortalidad Visual)**: Migración masiva de imágenes críticas (Logo, Productos, Blog, Nosotros, Contacto) de servidores externos (Postimages) a archivos locales en la carpeta `public`. La web es ahora mucho más rápida y 100% independiente de caídas externas.
  - ✅ **Seguridad Admin Reforzada**: Blindaje del acceso a privilegios de administrador. Ahora, el envío gratis y el modo test solo se activan para el email oficial si el usuario está **autenticado con contraseña** (`!isGuest`), eliminando la vulnerabilidad del campo de email en el modo invitado.
  - ✅ **Nueva Política de Envíos**: Actualizado el umbral de envío gratuito para la Península de **15€ a 18€**. Para **Otros Destinos** (Islas, Ceuta y Melilla), la tarifa plana sube de **7€ a 8€** y el envío gratuito de **25€ a 30€**, unificando la lógica en Checkout, Carrito y documentación.
  - ✅ **Optimización del Blog**: Reordenación estratégica de categorías (Todos, Juegos, Salud, Cuidados) y restauración visual completa con activos locales.
  - ✅ **Verificación Stripe LIVE (ÉXITO)**: Primera transacción real de 1€ completada con éxito. El sistema está 100% operativo tanto en frontend como en el backend de Supabase.
  - ✅ **Flujo de Trabajo Profesional**: Implementado sistema de ramas (branches). Se ha creado la rama `feature/actualizaciones` como laboratorio de pruebas, manteniendo `main` como la versión estable de producción.
  - ✅ **Actualización de Catálogo y Precios (15 Feb 2026)**: 
    - 🏷️ **Ajuste de Precios**: Reducción estratégica del precio de la *Tarta de Corcho* (9.85€) y el *Columpio Naturaleza* (10.50€).
    - 🧹 **Optimización de Inventario**: Eliminados los productos *Columpio Diversión Rattan* y *Columpio más cuerda* para evitar duplicidades con las nuevas piezas del catálogo.
    - ✨ **Nuevo Lanzamiento**: Añadido el *Colgante de colores* a la sección de Forrajeo/Colgantes, optimizando su escala visual (1.25).
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
