Ajustes visuales en el modal de escaneo previo a la cámara (`PetScannerOverlay`):

1. Fondo negro — reemplazar el gradiente actual (`--gradient-hero`) por negro puro en el contenedor del modal para darle look de scanner/visor.
2. Línea de escaneo vertical — convertir la línea animada actual (horizontal) en una barra que recorre el marco de arriba hacia abajo, similar al escaneo de un código QR. Se requiere:
   - Cambiar orientación del elemento de línea (ancho fijo, altura animada o translateY sobre eje vertical).
   - Actualizar o reemplazar la animación CSS `scan-line` en `styles.css` para que el movimiento sea top-to-bottom sobre el eje Y dentro del marco rectangular.

Archivos afectados:
- `src/components/blueprint/PetScannerOverlay.tsx`
- `src/styles.css`

Sin cambios en backend, persistencia ni lógica de captura/análisis.