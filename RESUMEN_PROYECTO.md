# 🦜 Pico & Amor - Resumen de Integración (Supabase + Gestión)

Este archivo sirve como guía maestra para cualquier desarrollador o agente de IA que continúe este proyecto.

## 🚀 Estado Actual (28 de Enero, 2026)
La aplicación es un e-commerce robusto con sincronización bidireccional en tiempo real mediante **Supabase**.

### 1. Infraestructura de Datos (Supabase)
- **Tablas Clave**:
    - `products`: Referencia de stock (`id`, `name`, `stock_quantity`).
    - `orders`: Transacciones (`id`, `customer_email`, `total`, `shipping_cost`, `items` como JSONB, `status`).
    - `profiles`: Datos de usuario extendidos (`id`, `name`, `email`, `address`, `city`, `province`, `postal_code`, `phone`).
- **Seguridad y Lógica de Negocio**:
    - **RPC `decrement_stock`**: Función del lado del servidor que descuenta stock de forma atómica al finalizar un pedido. Soluciona las restricciones RLS para clientes.
    - **Políticas (RLS)**:
        - `products`: Lectura pública. Actualización solo para el Admin.
        - `orders`: Inserción para clientes. Lectura filtrada (`email` del JWT = `customer_email`). Control total para el Admin.
        - `profiles`: Lectura/Escritura propia para el usuario. Control total para el Admin.

### 2. Panel de Administración (`/admin`)
Protegido para el email: `infopicoyamor@gmail.com`.

- **Control de Stock**:
    - Sistema de edición por lotes con guardado mediante botón flotante.
    - Indicadores visuales de productos modificados.
- **Pedidos Realizados (Optimizado)**:
    - **Gestión de Estados**: Selector dinámico para cambiar entre `Pagado (Procesando)`, `Enviado` y `Entregado`.
    - **Transparencia**: Desglose claro de *Subtotal + Gastos de Envío = Total Final*.
    - **Compacto**: Tarjetas de pedido rediseñadas para ver más información en menos espacio.
    - **Orden**: Los pedidos más recientes aparecen siempre arriba.
- **Gestión de Clientes**:
    - Buscador por nombre/email.
    - Contador de pedidos por cliente (Fidelidad).
    - Acciones: Ver dirección completa y Borrar cliente.

### 3. Experiencia del Cliente
- **Perfil de Usuario (`/profile`)**:
    - **Modo Edición**: Doble estado (Lectura/Edición) para evitar cambios accidentales.
    - **Sincronización de Pedidos**: Los pedidos ya no se guardan solo en local, se descargan de Supabase en cada inicio de sesión, permitiendo ver cambios de estado (ej. "Enviado") en tiempo real.
    - **IDs Humanizados**: Los IDs de pedido se muestran acortados (8 caracteres) para mayor elegancia.
- **Checkout**:
    - Prioriza el guardado de la orden. Si el stock falla por RLS, el pedido se procesa y se avisa internamente al admin.
    - Soporte completo para gastos de envío diferenciados (Península/Extra-peninsular).

## 📂 Estructura de Archivos Clave
- `lib/db.ts`: Capa de servicios. Incluye `getUserOrders`, `saveOrder`, `updateStock` (RPC) y `saveProfile`.
- `pages/Admin.tsx`: Lógica compleja de gestión de pedidos y clientes.
- `pages/Profile.tsx`: Gestión de datos personales e historial de pedidos.
- `App.tsx`: Centraliza la carga inicial de datos y la sincronización del estado del usuario.

## ⚠️ Notas Críticas para el Siguiente Agente
1. **RPC decrement_stock**: Es Vital. Si el stock no baja solo, verifica que la función SQL esté definida en Supabase con `security definer`.
2. **UUIDs**: En el frontend usamos `.slice(0, 8)` para mostrar los IDs, pero para buscar en la DB o pasar props se debe usar el ID completo.
3. **Sincronización de Pedidos**: Al cambiar el estado de un pedido en Admin, el cliente lo verá la próxima vez que entre en su perfil (o refresque), gracias al `useEffect` en `App.tsx` que llama a `getUserOrders`.

---
*Documento actualizado para asegurar la continuidad del proyecto.* 🦜✨
