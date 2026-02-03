# 🦜 Pico & Amor - Resumen de Integración (Supabase + Gestión)

Este archivo sirve como guía maestra para cualquier desarrollador o agente de IA que continúe este proyecto.

## 🚀 Estado Actual (Actualizado: 3 de Febrero, 2026)
La aplicación se encuentra en un estado de alta estabilidad con flujos de comunicación y venta optimizados.

### 💎 Hitos de Estabilización y Mejoras
1. **Seguridad Blindada (RLS Completado)**: 🔐
    - Políticas de **Row Level Security** activas en todas las tablas.
    - Administrador (`infopicoyamor@gmail.com`) con control total.
2. **Flujo de Pago Blindado**:
    - Sistema de recuperación de ID de pedido post-Stripe mediante `localStorage`.
    - Eliminación de bucles infinitos en el carrito con `useCallback`.
3. **Comunicación Optimizada (NUEVO)**: 📩
    - **Doble Email en Contacto**: Al enviar un mensaje desde la web, se dispara automáticamente un aviso a la tienda y un email premium de confirmación al cliente.
    - **Emails de Pedidos**: Sincronización completa con avisos de "Pedido Recibido" y "Pedido Enviado".
4. **Actualización de Catálogo**:
    - Categoría **"Forrajeo/Colgantes"** integrada.
    - Nuevos productos añadidos y sincronizados con la base de datos.

### 🛠️ Infraestructura de Datos (Supabase)
- **Tablas Clave**:
    - `products`: Referencia de stock.
    - `orders`: Transacciones y estados del pedido.
    - `contact_messages`: Registro de consultas desde el formulario.
    - `profiles`: Datos de usuario.
- **Lógica de Servidor**: Triggers en PL/pgSQL gestionan el envío de emails vía API de Resend.

### 💰 Pasarela de Pago (Stripe)
- **Flujo**: Checkout -> Stripe -> OrderSuccess.
- Registro automático del pedido en Supabase tras el pago.

### 📂 Archivos Clave y su Función
- `constants.tsx`: Catálogo maestro y rutas de imágenes/videos.
- `App.tsx`: Estado global y rutas.
- `lib/supabase.ts`: Configuración del cliente Supabase.
- `supabase_contact_table.sql`: Lógica de emails de contacto.
- `supabase_emails_config_full.sql`: Lógica de emails de pedidos.

## ⚠️ Notas para el Siguiente Agente
1. **Claves de API**: Los archivos `.sql` contienen marcadores de posición para la clave de Resend por seguridad. Asegurarse de pegarla en la consola de Supabase al ejecutar cambios.
2. **Scroll Lock**: El `Navbar` gestiona el body overflow; vigilar al añadir nuevas rutas.
3. **Sincronización de Stock**: El sistema sincroniza productos automáticamente desde `constants.tsx`, pero el stock inicial debe ajustarse desde el Panel Admin.

---
*¡Proyecto restaurado, optimizado y con comunicación 360º activada!* 🦜✨🚀
