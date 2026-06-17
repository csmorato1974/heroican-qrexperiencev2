## Objetivo

Cuando el usuario comparta su mascota por WhatsApp desde el modal "Mira cómo cuidamos a tu engreído", primero descargamos la foto (con los badges anatómicos sobre la imagen) a su dispositivo, y luego abrimos WhatsApp con un mensaje que le indica al asesor que se está adjuntando la foto y al usuario que la adjunte manualmente.

## Cambios

### `src/components/blueprint/BlueprintCamera.tsx`

1. Renombrar el botón "WhatsApp" a algo más claro: **"Enviar por WhatsApp"** (mantiene el ícono `MessageCircle`).
2. Reemplazar la función `shareWhatsapp()` por un nuevo flujo `sendPhotoViaWhatsapp()`:
   - Ejecuta primero la misma lógica de `download()` (canvas con badges → blob PNG) y dispara la descarga automática del archivo `heroican-mi-mascota.png`.
   - Espera ~600 ms para que el navegador procese la descarga.
   - Muestra un `toast` (usar `sonner` ya disponible en el proyecto) con el mensaje: **"Foto descargada 📸 — adjúntala en el chat de WhatsApp que se acaba de abrir"**.
   - Abre `https://wa.me/59164280437` con un mensaje actualizado:
     > "Hola Heroican 👋 Te comparto la foto de mi mascota (adjunta en este chat) para que me ayudes a identificar su raza y darme una recomendación personalizada. ¡Gracias!"
   - Trackea `blueprint_share_whatsapp` con metadata `{ withPhoto: true }`.
3. Refactor pequeño: extraer la generación del blob a una función interna `buildAnnotatedBlob(): Promise<Blob>` reutilizada por `download()` y por el nuevo flujo, para no duplicar el código del canvas.
4. El botón "WhatsApp" solo aparece cuando hay `photo`, igual que ahora. Si por alguna razón no hay foto, no se ofrece el flujo.

### Estados visuales

- Mientras se genera la imagen y se prepara la descarga, deshabilitar momentáneamente el botón con un spinner pequeño (`Loader2` de `lucide-react`) para evitar doble click.

## Lo que NO cambia

- Número de WhatsApp (`+591 64280437`), badges, posiciones, layout del modal, ni la lógica de la cámara.
- No se agrega backend, ni Lovable Cloud, ni subida a la nube.
- No se modifica el botón "Descargar" existente (sigue funcionando independientemente).

## Limitación a comunicar en el toast

WhatsApp Web/App no permite que un enlace adjunte la foto automáticamente; el usuario debe pulsar el clip 📎 en WhatsApp y elegir la imagen recién descargada (queda visible en su galería/descargas).
