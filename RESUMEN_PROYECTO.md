# 🦜 Pico & Amor - Resumen de Integración (Supabase + Gestión)

Este archivo sirve como guía maestra para cualquier desarrollador o agente de IA que continúe este proyecto.

## 🚀 Estado Actual (Actualizado: 28 de Enero, 2026)
La aplicación es un e-commerce robusto con sincronización bidireccional en tiempo real mediante **Supabase**.

### 1. Infraestructura de Datos (Supabase)
- **Tablas Clave**:
    - `products`: Referencia de stock (`id`, `name`, `stock_quantity`).
    - `orders`: Transacciones (`id`, `customer_email`, `total`, `shipping_cost`, `items` como JSONB, `status`).
    - `profiles`: Datos de usuario extendidos (`id`, `name`, `email`, `address`, `city`, `province`, `postal_code`, `phone`).
    - `reviews`: Valoraciones de clientes (`id`, `name`, `bird_name`, `text`, `rating`, `image_url`, `is_approved`, `created_at`).
- **Seguridad y Lógica de Negocio**:
    - **Moderación de Reseñas**: Las reseñas nuevas entran como `is_approved = false` y NO se muestran en la web hasta que el admin las activa.
    - **Políticas (RLS)**:
        - `products`: Lectura pública. Actualización para el Admin.
        - `orders`: Inserción pública (incluye invitados). Lectura de confirmación para invitados. Control total para el Admin.
        - `reviews`: Lectura pública filtrada (`is_approved = true`). Inserción pública. **Borrado y Actualización restringido al Admin**.

### 2. Panel de Administración (`/admin`)
Protegido para el email: `infopicoyamor@gmail.com`. Admite navegación vía **HashRouter** (`https://picoyamor.com/#/admin`).

- **Moderación de Reseñas**:
    - Pestaña dedicada para gestionar testimonios. Visualización de fotos completas.
- **Sistema de Emails Profesional (NUEVO - Resend)**: 
    - **IDs Unificados**: Todos los pedidos usan un ID de 8 caracteres consistente en Web, Email y Base de Datos (ej. `#6A36CCD2`).
    - **Confirmación Automática**: Email con diseño profesional y **desglose de gastos de envío**.
    - **Aviso de Envío**: Email con aviso de transporte al cambiar estado a "Enviado".
    - **Alertas Admin**: Alerta instantánea con enlace directo al panel.

### 3. Contacto y Soporte
- **Formulario de Contacto (Mejorado)**:
    - Migrado a **Supabase Edge Functions + Resend**.
    - Mayor fiabilidad, diseño profesional y soporte para responder directamente desde el email.

### 4. Experiencia del Cliente y Catálogo
- **Catálogo Dinámico**: Gestión de stock en tiempo real con avisos de "Quedan X unidades".
- **Políticas**: Devoluciones en 24/48h por seguridad aviar (producto intacto).

## 📂 Estructura de Archivos Clave
- `lib/db.ts`: Servicios de base de datos.
- `constants.tsx`: Definición de productos e imágenes.
- `pages/Admin.tsx`: Centro de gestión.
- `pages/Contact.tsx`: Formulario profesional.
- `supabase/functions/send-contact-email/`: Lógica de envío segura.

## ⚠️ Notas Críticas para el Siguiente Agente
1. **Configuración Resend**: Requiere ejecutar el SQL de triggers y configurar la `API KEY` en el Editor SQL de Supabase.
2. **Nuevos Productos**: Asegurar que el ID en `constants.tsx` existe en la tabla `products`.
3. **Escalas de Imagen**: Ajustar `scale` en `constants.tsx` si las fotos se cortan en la galería.

---
*Documento actualizado tras la migración a Resend y unificación de IDs (28/01/2026).* 🦜✨
