# 🦜 Pico & Amor - Resumen de Integración (Supabase + Gestión)

Este archivo sirve como guía maestra para cualquier desarrollador o agente de IA que continúe este proyecto.

## 🚀 Estado Actual (Actualizado: 29 de Enero, 2026)
La aplicación es un e-commerce robusto con sincronización bidireccional en tiempo real mediante **Supabase**.

### 1. Infraestructura de Datos (Supabase)
- **Tablas Clave**:
    - `products`: Referencia de stock (`id`, `name`, `stock_quantity`).
    - `orders`: Transacciones (`id`, `customer_email`, `total`, `shipping_cost`, `items` como JSONB, `status`).
    - `profiles`: Datos de usuario extendidos (`id`, `name`, `email`, `address`, `city`, `province`, `postal_code`, `phone`).
    - `reviews`: Valoraciones de clientes (`id`, `name`, `bird_name`, `text`, `rating`, `image_url`, `is_approved`, `created_at`).
- **Seguridad y Lógica (RLS)**:
    - **Compra para Invitados (SOLUCIONADO)**: Cualquier persona puede comprar sin cuenta. Las políticas permiten a `anon` insertar en `orders` y leer su propio pedido para la pantalla de éxito.
    - **Moderación de Reseñas**: Las nuevas reseñas entran como `is_approved = false` y requieren activación manual en el Admin.
    - **Control de Acceso**: El Admin (`infopicoyamor@gmail.com`) tiene control total (`ALL`) sobre todas las tablas.

### 2. Panel de Administración (`/admin`)
Acceso mediante **HashRouter** (`https://picoyamor.com/#/admin`).
- **Autosincronización de Stock**: El panel usa `upsert`. Si añades un producto nuevo al código (`constants.tsx`) y le pones stock en el panel, se crea automáticamente en la base de datos.
- **Gestión de Reseñas**: Sistema de aprobación/borrado con visualización de fotos optimizada.
- **Sistema Resend**: Emails profesionales con desglose de envío y avisos de estado automáticos.

### 3. Diseño y UX (Mejoras Recientes)
- **Muro Masonry**: Las reseñas usan un diseño tipo Pinterest. Si una reseña no tiene foto, el diseño se ajusta verticalmente sin dejar huecos vacíos.
- **Video Restaurado**: La sección "Nuestra Pasión con Alas" vuelve a tener su video en bucle cargando desde local (`/public/VIDEO.mp4`).
- **Escalado de Imagen**: Parámetro `scale` en `constants.tsx` para ajustar el zoom de las fotos de productos individualmente.

### 4. Contacto y Soporte
- **Edge Functions**: El formulario usa una función segura en Supabase con la API de Resend para evitar spam y asegurar la entrega.

## 📂 Estructura de Archivos Clave
- `constants.tsx`: Catálogo maestro de productos y configuración visual (zoom, etc).
- `pages/Admin.tsx`: Centro de gestión de pedidos, stock y reseñas.
- `pages/ClubPico.tsx`: Muro de experiencias de clientes con Masonry layout.
- `lib/db.ts`: Servicios de interacción con la base de datos.

## ⚠️ Notas para el Siguiente Agente
1. **Nuevos Productos**: Añadir el ID en `constants.tsx` y el Admin hará el resto al guardar stock.
2. **Escalas**: Si una foto de producto se ve lejos o cortada, ajusta su `scale` en `constants.tsx`.
3. **Storage**: Las fotos de reseñas se guardan en el bucket `reviews` de Supabase Storage.

---
*¡Proyecto listo y documentado al detalle!* 🦜✨🌻
