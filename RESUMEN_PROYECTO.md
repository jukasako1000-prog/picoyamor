# 🦜 Pico & Amor - Resumen de Integración (Supabase + Gestión)

Este archivo sirve como guía para cualquier desarrollador o agente de IA que continúe este proyecto.

## 🚀 Estado Actual
La aplicación ha evolucionado de un catálogo estático a una plataforma de e-commerce dinámica conectada a **Supabase**.

### 1. Infraestructura Supabase
- **Base de Datos**: 
    - `reviews`: Almacena reseñas de clientes con nombre, pájaro, texto y URL de imagen.
    - `products`: Gestiona el inventario en tiempo real (`stock_quantity`).
    - `orders`: Guarda detalles de transacciones (cliente, dirección, artículos, total).
- **Storage**: Bucket `reviews` configurado para fotos comprimidas de las reseñas.
- **Auth**: Sistema de autenticación habilitado para el panel de administración.

### 2. Funcionalidades Clave Implementadas

#### **Muro de Reseñas (Club Pico)**
- Componente `ClubPico.tsx`: Muestra reseñas en tiempo real y permite subidas con **compresión automática de imagen** en el cliente para ahorrar espacio.

#### **Control de Stock Profesional**
- **Sincronización Automática**: Al iniciar la app (`App.tsx`), los productos definidos en `constants.tsx` se registran automáticamente en la base de datos si no existen.
- **Frontend Dinámico**: Las tarjetas de producto muestran:
    - Botón "Agotado" y desactivado si el stock es 0.
    - Badge de "Solo X unidades" si el stock es ≤ 5.
- **Descuento de Inventario**: Al finalizar una compra en `Checkout.tsx`, el stock se resta automáticamente en Supabase.

#### **Panel de Administración Seguro**
- **Acceso Discreto**: Enlace "Gestión" en el pie de página (Footer).
- **Ruta**: `#/admin` protegida por `Admin.tsx`.
- **Seguridad**: Solo el email `infopicoyamor@gmail.com` tiene permisos. Requiere configuración previa en Supabase Auth.
- **Capacidades**:
    - Edición de stock (manual o con botones).
    - Visualización de pedidos con datos completos de envío.
    - Borrado de pedidos para limpieza.

## 📂 Archivos Críticos
- `src/lib/supabase.ts`: Configuración del cliente Supabase.
- `src/lib/db.ts`: Lógica centralizada de interacción con base de datos (sync, updateStock, saveOrder).
- `src/pages/Admin.tsx`: El cerebro de la gestión de la tienda.
- `src/pages/Checkout.tsx`: Proceso de persistencia de pedidos.

## 🛠️ Instrucciones para el Próximo Agente
1. **Credenciales**: Actualmente están en `lib/supabase.ts`. Se recomienda moverlas a `.env` en producción.
2. **Políticas RLS**: Las tablas `reviews`, `products` y `orders` tienen políticas activas. Para pedidos y reseñas se permite `anon insert`.
3. **Escalabilidad**: Si se añaden nuevos productos a `constants.tsx`, la base de datos se actualizará sola gracias a `syncProducts()` en `App.tsx`.

---
*Documento generado por Antigravity el 27 de enero de 2026.* 🦜✨
