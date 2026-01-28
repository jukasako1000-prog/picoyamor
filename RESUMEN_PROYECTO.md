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
        - `orders`: Inserción para clientes. Control total para el Admin.
        - `reviews`: Lectura pública filtrada (`is_approved = true`). Inserción pública. **Borrado y Actualización restringido al Admin** (vía email JWT).

### 2. Panel de Administración (`/admin`)
Protegido para el email: `infopicoyamor@gmail.com`.

- **Moderación de Reseñas (NUEVO)**:
    - Pestaña dedicada para gestionar testimonios.
    - Visualización de fotos completas (sin recortar).
    - Botones de **Publicar** (cambia `is_approved` a true) y **Borrar**.
- **Control de Pedidos**:
    - Estado **"ENTREGADO"** destacado con fondo verde oscuro y texto blanco.
    - **Automatización de Emails (NUEVO)**: 
        - En el momento de la compra: Email de confirmación al **Cliente** y aviso de alerta al **Admin** (`infopicoyamor@gmail.com`).
        - Cambio a estado **"ENVIADO"**: Email automático de aviso de transporte al **Cliente**.

### 3. Experiencia del Cliente y Catálogo
- **Navegación Optimizada**: Menú más limpio ("Nosotros" en vez de "Sobre Nosotros", icono 📧 para contacto). Botón animado "Club Pico".
- **Catálogo Dinámico**:
    - **Nuevos**: `Columpio Mini Torre` (p24), `Columpio Diversión Rattan` (p25), `Combo Forrajeo Rafia y Olivo` (p26).
    - **Etiquetas Inteligentes**: Aviso de "Quedan X unidades" y badge verde de "En Stock".
- **Políticas Actualizadas**:
    - **Devoluciones**: Plazo estricto de **24/48 horas** (no se admiten devoluciones fuera de plazo). Condición de **producto intacto** por seguridad aviar.

### 4. Mantenimiento y UI Estática
- **index.html**: Pantalla de "Preparando el nido" compactada y pulida. El icono del loro está ahora visualmente pegado al título.

## 📂 Estructura de Archivos Clave
- `lib/db.ts`: Capa de servicios (Supabase).
- `constants.tsx`: Definición de productos, imágenes y precios. **Cambiar escalas aquí si las fotos se cortan**.
- `pages/Admin.tsx`: Centro de mando (Pedidos, Clientes, Reseñas).
- `pages/ClubPico.tsx`: Galería pública de reseñas (solo aprobadas).

## ⚠️ Notas Críticas para el Siguiente Agente
1. **Moderación de Reseñas**: Si el admin aprueba pero no se guarda, verifica las RLS `Admin Update Reviews` en Supabase.
2. **Nuevos Productos**: Cada vez que se añade un ID nuevo en `constants.tsx`, se debe añadir también en la tabla `products` de Supabase para que el stock funcione.
3. **Escalas de Imagen**: En `constants.tsx`, el campo `scale` controla el zoom de la foto en la tarjeta. Si una cuerda se corta, bajar el valor (ej. de 1.25 a 1.1).

---
*Documento actualizado para asegurar la continuidad del proyecto.* 🦜✨
