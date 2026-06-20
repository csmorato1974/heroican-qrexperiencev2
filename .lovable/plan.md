## Problema

El modal de la opción "cámara" (`BlueprintCamera`) no se ve bien en móvil: el título se solapa con el botón de cerrar (X), los botones de acción se amontonan, las etiquetas de los hotspots se desbordan de la foto, y en viewports pequeños/landscape (ej. 730×553) el contenido queda apretado.

## Cambios propuestos (solo UI)

**Archivo:** `src/components/blueprint/BlueprintCamera.tsx`

1. **DialogContent**: ajustar para móvil
   - Cambiar `max-w-[min(560px,96vw)]` por `w-[calc(100vw-1rem)] max-w-[560px]`
   - Mantener `max-h-[95svh] overflow-y-auto`, añadir `rounded-2xl`
   - Reducir padding en móvil: `p-3 sm:p-6`

2. **DialogTitle**: evitar solape con la X
   - Añadir `pr-10` y `text-lg sm:text-xl` para que el emoji + texto no choquen con el botón close (que está `absolute right-4 top-4`)

3. **Prompt inicial (sin foto)**: reducir tamaños en móvil
   - Padding `p-4 sm:p-6`, texto principal `text-lg sm:text-xl`, botón `h-11 sm:h-12`

4. **Foto preview + Hotspots**: evitar overflow horizontal
   - Hotspot labels: limitar ancho con `max-w-[8rem] truncate` y cambiar `whitespace-nowrap` por `whitespace-normal leading-tight` para que respiren; tamaño `text-[9px] sm:text-[10px]`
   - Ocultar las etiquetas flotantes en móvil cuando no estén activas (mostrar solo el punto), porque el usuario ya las ve en el grid de badges debajo: `hidden sm:inline` cuando no `active`

5. **Grid de badges**: en pantallas muy pequeñas mantener `grid-cols-2` pero reducir padding `p-2 sm:p-3` y leading.

6. **Botonera de acciones**: layout responsive
   - Reemplazar `flex flex-wrap gap-2` + `ml-auto` por `grid grid-cols-2 gap-2 sm:flex sm:flex-wrap` con el botón WhatsApp ocupando `col-span-2 sm:col-span-1 sm:ml-auto`
   - Botones `w-full sm:w-auto` para que en móvil llenen su celda

7. **Insight card / texto auxiliar**: añadir `text-balance` y tamaños responsive donde aplique.

## Fuera de alcance

- No tocar lógica de análisis, captura, tracking, ni `PetScannerOverlay` (ya es responsive).
- No tocar `dialog.tsx` (componente compartido).
- Sin cambios de backend ni de copy.

## Validación

- Probar en viewport móvil (375×667 y 730×553) con Playwright: abrir el modal desde el CTA "cámara", verificar que el título no se solapa con la X, que la botonera no se desborda y que el contenido es scrolleable sin cortes laterales.
