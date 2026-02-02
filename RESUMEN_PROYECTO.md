# 🦜 Pico & Amor - Resumen de Integración (Supabase + Gestión)

Este archivo sirve como guía maestra para cualquier desarrollador o agente de IA que continúe este proyecto.

## 🚀 Estado Actual (Actualizado: 2 de Febrero, 2026)
La aplicación ha sido estabilizada tras una sesión de depuración crítica. Se ha restaurado a un punto funcional y se han corregido errores graves en el flujo de compra.

### 💎 Hitos de Estabilización (2 de Febrero, 2026)
1. **Seguridad Blindada (RLS Completado)**: 🔐
    - Se han activado las políticas de **Row Level Security** en todas las tablas de Supabase.
    - La base de datos está protegida contra accesos no autorizados.
    - El administrador (`infopicoyamor@gmail.com`) tiene control total, mientras que los clientes solo pueden insertar pedidos y ver productos/reseñas.
2. **Flujo de Pago Blindado**:
    - **Corrección de ID**: El ID del pedido ya no muestra "#PAGADO" ni queda en blanco. Se implementó un sistema de "nota adhesiva" en `localStorage` que guarda el ID justo antes de ir a Stripe y lo recupera al volver.
    - **Fin del Bucle Infinito**: Se estabilizaron las funciones de `App.tsx` (`handleClearCart`, etc.) con `useCallback` para evitar que la web entrara en un bucle de refresco infinito al vaciar el carrito.
    - **Desbloqueo de Scroll**: Se eliminó un error en el `Navbar` que dejaba la pantalla "congelada" (bloqueo de scroll) al navegar hacia la pantalla de éxito.
2. **Actualización de Catálogo**:
    - **Nueva Categoría**: La sección "Forrajeo" ha sido renombrada a **"Forrajeo/Colgantes"** en el código (`types.ts`, `constants.tsx`, `Packs.tsx`).
    - **Nuevos Productos**: Añadidos con éxito `Colgante Pajarita`, `Colgante Ejercicio` y `Forrajeo Mini Parque`, vinculando sus archivos reales de la carpeta `/public`.
3. **Sincronización Supabase**:
    - El sistema detecta automáticamente nuevos productos en el código y los añade a la base de datos (con stock 0 inicial).

### 🛠️ Infraestructura de Datos (Supabase)
- **Tablas Clave**:
    - `products`: Referencia de stock (`id`, `name`, `stock_quantity`).
    - `orders`: Transacciones (`id`, `customer_email`, `total`, `items` como JSONB, `status`).
    - `profiles`: Datos de usuario extendidos.
- **Seguridad (RLS)**: Las políticas permiten compras anónimas (invitados) y que el Admin controle todo el catálogo.

### 💰 Pasarela de Pago (Stripe)
- **Flujo**: Checkout -> Stripe -> OrderSuccess.
- **Mejora**: `OrderSuccess.tsx` ahora es "paciente" y espera unos milisegundos a que los datos locales se asienten para mostrar el ID correcto.

### 📂 Archivos Clave y su Función
- `constants.tsx`: Catálogo maestro. **Es el origen de la verdad.** Si un producto está aquí, la web lo enseña y Supabase lo sincroniza.
- `types.ts`: Define las categorías permitidas.
- `App.tsx`: Gestiona el estado global (carrito, usuario, pedidos) de forma estable.
- `pages/OrderSuccess.tsx`: Pantalla de éxito blindada contra bloqueos.

## ⚠️ Notas para el Siguiente Agente
1. **Evitar bucles**: Cualquier función pasada desde `App.tsx` a hijos que se ejecute en un `useEffect` debe estar envuelta en `useCallback`.
2. **Scroll Lock**: El `Navbar` gestiona el bloqueo del body; siempre asegurarse de que `overflow = 'unset'` se ejecute al desmontar o cambiar de ruta.
3. **Nuevos Productos**: Añadirlos a `constants.tsx` con su respectiva constante de imagen. El sistema de tipos en `types.ts` debe admitir la categoría elegida.

---
*¡Proyecto restaurado, optimizado y listo para seguir volando!* 🦜✨🚀
