# Blueprint Interno · Modo Cámara + Badges

Transformar la sección "Blueprint Interno" para que el cliente capture (o suba) una foto de su mascota y la vea dentro de un modal HUD con 4 badges fijos anclados sobre la imagen, al estilo de la referencia de Heroican (líneas conectoras + tarjetas laterales).

## Flujo de usuario

1. En la sección Blueprint Interno el CTA cambia de "Iniciar previsualización" a **"Escanear a mi mascota"**.
2. Al pulsar:
   - **Mobile**: abre la cámara trasera vía `<input type="file" accept="image/*" capture="environment">` (no requiere permisos especiales, funciona en iOS/Android).
   - **Desktop**: el mismo input abre el selector de archivos.
3. La imagen se lee como `dataURL` y se muestra dentro de un modal HUD a pantalla casi completa.
4. Sobre la imagen aparecen **4 badges fijos** posicionados en porcentajes (no detección real) con línea conectora hacia un hotspot animado:
   - **F01 · Confort digestivo** — canela funcional, efecto carminativo.
   - **F02 · Vitalidad** — 20% mín. proteína, energía diaria.
   - **F03 · Piel y pelaje** — aceites + vitaminas.
   - **F04 · Palatabilidad** — hidrolizados de hígado.
   El contenido de los badges se adapta al producto recomendado por el chatbot si ya existe sesión (lee `heroican.session` de localStorage); si no, usa textos por defecto de Heroican.
5. Botones inferiores: **Volver a tomar**, **Descargar imagen con badges** (canvas → PNG) y **Compartir por WhatsApp** (reusa `buildWhatsappUrl`).
6. Tracking de eventos: `blueprint_camera_opened`, `blueprint_photo_captured`, `blueprint_photo_downloaded`, `blueprint_share_whatsapp`.

## Aclaración importante

No es AR real ni detección por IA. Son badges posicionados con coordenadas porcentuales fijas sobre la foto capturada, manteniendo la estética HUD/gaming de la landing. Esto es coherente con la fase **Entry** del MVP y la marca **Heroican** (no Royal Canin, asumo que fue un lapsus en el mensaje). Si querés detección real de partes del cuerpo del perro, sería trabajo de fase Immersive.

## Cambios técnicos

```text
src/components/ARPreview.tsx              → refactor: CTA "Escanear" + ocultar modal previo
src/components/blueprint/BlueprintCamera.tsx  → NUEVO: modal con foto + badges
src/components/blueprint/BlueprintBadges.ts   → NUEVO: definición de los 4 badges (code, title, body, x%, y%)
src/lib/tracker.ts                        → nuevos nombres de evento (sin cambio de API)
```

### `BlueprintCamera.tsx` (resumen)

- Usa `Dialog` de shadcn con `max-w-[min(560px,95vw)]` y estética `hud-panel scanline corner-frame`.
- Estado: `photo: string | null`.
- Input oculto + botón "Tomar foto"; al elegir archivo → `FileReader.readAsDataURL`.
- Render: `<div className="relative aspect-[3/4]">` con `<img>` de fondo y los 4 badges en posición absoluta (`style={{ left: x+"%", top: y+"%" }}`), cada uno con un punto pulsante (`pulse-glow`) y una tarjeta lateral con `hud-chip` + título + descripción + línea SVG conectora.
- En mobile las tarjetas colapsan a sheet inferior expandible para no tapar la foto.
- Descarga: render off-screen en `<canvas>` (foto + badges dibujados) → `toBlob` → link de descarga.

### Badges (data)

```ts
export const BLUEPRINT_BADGES = [
  { code: "F01", title: "Confort digestivo", body: "Canela funcional, efecto carminativo.", x: 35, y: 55 },
  { code: "F02", title: "Vitalidad",        body: "Mín. 20% proteína para energía diaria.", x: 65, y: 40 },
  { code: "F03", title: "Piel y pelaje",    body: "Aceites y vitaminas clave.",             x: 50, y: 25 },
  { code: "F04", title: "Palatabilidad",    body: "Hidrolizado de hígado de pollo.",        x: 45, y: 75 },
];
```

## Fuera de alcance

- Detección real de mascota / segmentación / AR.
- Subida de la foto al backend (todo queda en el cliente).
- Edición de la posición de los badges desde admin.

## Criterios de aceptación

- En mobile, pulsar el CTA abre la cámara trasera del dispositivo.
- Tras tomar/elegir foto, aparece dentro del modal con 4 badges visibles superpuestos.
- Los badges mantienen la estética HUD del resto de la landing (mono, neon amber, corner frames, scanline).
- "Volver a tomar" reinicia el estado; "Descargar" produce un PNG con foto + badges; "WhatsApp" abre el chat con mensaje precargado.
- El panel persistente del chatbot sigue visible y funcional durante todo el flujo.
- Tracking local registra los eventos sin romper el dashboard `/metrics`.
