# Heroican — Rediseño "gaming-figital" + modal persistente

Adecuar la landing a la estética de la presentación (PPT_HEROICAN_V2) y convertir el diagnóstico en una experiencia siempre visible, sin CTA de apertura.

## 1. Estética: de "editorial cálido" a "gaming figital"

Inspirado en la portada del PPT: lado **terracota/cinnamon orgánico** + lado **navy blueprint técnico**. Lo llevamos a un registro gaming-HUD (no infantil, no cartoon): paneles oscuros, glow neón, esquinas biseladas, líneas de blueprint, tipografía técnica monoespaciada para datos.

**Tokens nuevos en `src/styles.css`:**
- `--background`: navy profundo `oklch(0.18 0.03 250)` (lado blueprint del PPT)
- `--surface`: panel HUD `oklch(0.22 0.04 250)`
- `--primary`: cinnamon/ember `oklch(0.66 0.18 45)` (heredado del PPT)
- `--accent`: neón ámbar `oklch(0.82 0.19 75)` para glows/CTAs
- `--accent-cyan`: cian eléctrico `oklch(0.78 0.15 210)` para acentos HUD
- `--grid-line`: línea blueprint `oklch(0.55 0.05 220 / 0.25)`
- `--gradient-hero`: split terracota → navy del PPT
- `--shadow-glow`: `0 0 40px color-mix(in oklab, var(--accent) 35%, transparent)`
- `--shadow-hud`: `inset 0 1px 0 oklch(1 0 0 / 0.08), 0 8px 32px oklch(0 0 0 / 0.5)`

**Tipografía:**
- Mantener Fraunces para títulos hero (coherencia con PPT)
- Body: Inter
- Añadir **JetBrains Mono** para chips de datos, métricas, "SYS / QR_ID / LOTE" estilo HUD

**Patrones visuales reutilizables:**
- Fondo con grid blueprint sutil (SVG repeat) + scanline
- Esquinas "corner brackets" `⌐ ¬ ⌙ ⌎` en paneles
- Badges tipo `[ STATUS: ONLINE ]` monoespaciados
- Animación `pulse-glow` en CTA accent
- Transición tipográfica con `animate-fade-in` ya disponible

## 2. Modal persistente "siempre abierto"

Eliminar el botón "Iniciar diagnóstico rápido" y el flujo de apertura. El asistente vive **embebido en la landing** como un panel HUD fijo, no como Dialog modal.

**Cambios estructurales:**
- Renombrar `ChatbotModal` → `ChatbotPanel` (sin `<Dialog>`).
- Render directo en `routes/index.tsx`, sin `useState(open)`.
- Comportamiento responsive:
  - **Mobile**: panel ocupa la parte inferior fija (`fixed bottom-0`, ~75svh), arrastrable a fullscreen, no se puede cerrar — siempre presente. El hero queda detrás como contexto.
  - **Desktop**: panel anclado a la derecha (`fixed right-6 bottom-6 top-24 w-[420px]`) tipo "console", siempre visible mientras el usuario hace scroll por las secciones (HowItWorks, Benefits, AR, ProductsMatrix).
- El "X" se reemplaza por botón **minimizar** (colapsa a una barra HUD de 56px con el avatar pulsante y un "REANUDAR ▸"), nunca cierra.
- Estado del progreso del quiz persistido en `localStorage` (`heroican.session`) para que sobreviva refresh — refuerza el "siempre presente".

**Hero rediseñado:**
- Sin CTA primario de iniciar. El hero pasa a ser tipo "title card" de videojuego: título grande, badge `[ MISIÓN 01 — DIAGNÓSTICO ]`, indicador "↘ Panel activo" apuntando al chat.
- CTA secundario de WhatsApp se mantiene como link discreto.

## 3. Rediseño de secciones (mismo contenido, look HUD)

- **Hero**: split-screen del PPT (terracota | blueprint) con el empaque al centro y stats animadas a la derecha tipo dashboard.
- **HowItWorks**: 4 pasos como "missions" numeradas `01 / 02 / 03 / 04` con corner brackets y línea de progreso neón.
- **Benefits**: cards HUD con border glow y chips monoespaciados.
- **ARPreview**: pantalla tipo "scanner en proceso", overlay blueprint sobre la bolsa.
- **ProductsMatrix**: tabla del PPT pasada a grid HUD; cada celda es un "loadout" (etapa × tamaño) con kg/precio en mono.
- **Footer**: barra de status `[ SYS ONLINE · TACNA · v0.1-ENTRY ]`.

## 4. Archivos a tocar

- `src/styles.css` — nuevos tokens, fondo grid, fuente JetBrains Mono, keyframe `pulse-glow`, utilidades `.hud-panel`, `.corner-brackets`, `.scanline`.
- `src/routes/__root.tsx` — añadir JetBrains Mono al `<link>` de fonts.
- `src/components/Hero.tsx` — eliminar botón "Iniciar diagnóstico"; rediseñar split + stats.
- `src/components/HowItWorks.tsx`, `Benefits.tsx`, `ARPreview.tsx`, `ProductsMatrix.tsx`, `Footer.tsx` — reskin HUD/gaming.
- `src/components/chatbot/ChatbotModal.tsx` → renombrar a `ChatbotPanel.tsx`; quitar `Dialog`, añadir minimizar, layout fixed mobile/desktop, persistencia en localStorage.
- `src/routes/index.tsx` — quitar `useState(open)`, renderizar `<ChatbotPanel>` siempre; ajustar padding para no chocar con el panel.
- `src/lib/tracker.ts` — añadir evento `panel_minimized` / `panel_restored`; remover dependencia de `modal_opened` (o mantener como `landing_panel_mounted`).

## 5. Fuera de alcance

- No cambia la lógica de recomendación, productos, validación de leads, WhatsApp ni métricas.
- No se introducen sonidos, 3D real ni assets pesados.
- No se cambia el roadmap (sigue siendo fase Entry).

## Criterios de aceptación

- La landing carga con el panel del asistente visible sin clic alguno.
- En mobile el panel ocupa la parte inferior y no se puede cerrar (solo minimizar a barra).
- En desktop el panel queda anclado a la derecha mientras se hace scroll.
- El estado del quiz persiste tras recargar.
- Paleta y tipografía coinciden con la portada del PPT (terracota + navy blueprint + acento neón).
- Todas las secciones tienen tratamiento HUD coherente (corner brackets, chips mono, glow).
