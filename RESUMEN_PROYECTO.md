# 🦜 Pico & Amor - Resumen de Integración (Supabase + Gestión)

Este archivo sirve como guía maestra para cualquier desarrollador o agente de IA que continúe este proyecto.

## 🚀 Estado Actual (27 de Enero, 2026)
La aplicación es un e-commerce funcional con persistencia en tiempo real mediante **Supabase**.

### 1. Infraestructura Supabase
- **Tablas**:
    - `products`: Referencia de stock (`id`, `name`, `stock_quantity`).
    - `orders`: Registro de transacciones con detalles de cliente y artículos.
    - `reviews`: Reseñas del "Club Pico" con soporte para imágenes.
- **Políticas de Seguridad (RLS)**:
    - `products`: **Lectura pública** habilitada (para que la tienda vea el stock). **Actualización restringida** al email del administrador.
    - `orders`: **Inserción pública** (para clientes) y **Control total** para el administrador.
    - `reviews`: **Lectura e Inserción pública**.

### 2. Funcionalidades de Administración (Rediseñadas)

#### **Gestión de Stock Robusta**
- **Modelo de Guardado por Lotes**: Ya no se sincroniza cada cambio al instante (para evitar bloqueos o errores de red).
- **Flujo de Trabajo**:
    1. El admin modifica las cantidades localmente.
    2. Los productos cambiados se marcan visualmente como "Modificados".
    3. Aparece un **botón flotante naranja ("Guardar todos los cambios")** que persiste todo de una vez.
- **Acceso**: Ruta `#/admin` protegida para `infopicoyamor@gmail.com`.

#### **Visualización de Pedidos**
- Lista completa de pedidos ordenados por fecha.
- Desglose de artículos, datos de contacto del cliente y dirección de envío.
- Opción de borrar pedidos antiguos o de prueba.

### 3. Frontend y Tienda
- **Stock en Tiempo Real**: Los componentes `Packs.tsx` y `Home.tsx` solicitan el stock a Supabase en cada carga.
- **Lógica de Bloqueo**: Si el stock es 0, el producto se marca automáticamente como "Agotado" y el botón de compra se desactiva.
- **Alertas**: Badge de "Solo X unidades" automático cuando el stock baja de 5.

## 📂 Estructura de Archivos Clave
- `lib/supabase.ts`: Cliente de conexión.
- `lib/db.ts`: Servicios de sincronización y guardado.
- `pages/Admin.tsx`: Panel de control (Stock + Pedidos).
- `constants.tsx`: Catálogo maestro y rutas de recursos.

## ⚠️ Notas Críticas para el Siguiente Agente
1. **Error de "Agotado"**: Si la tienda muestra todo agotado a pesar de haber stock, revisa que la tabla `products` en Supabase no esté vacía y que la política de `SELECT` para usuarios `anon` esté activa.
2. **Sincronización Inicial**: El script SQL de inserción manual es necesario si se borra la base de datos, ya que el código de `syncProducts` puede fallar si el RLS está muy restringido.
3. **Credenciales**: Los tokens están en `lib/supabase.ts`. Sería ideal moverlos a variables de entorno si el proyecto escala.

---
*Documento actualizado para asegurar la continuidad del proyecto.* 🦜✨
