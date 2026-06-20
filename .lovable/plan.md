# Plan: capa estética de escaneo previa al análisis

## Objetivo
Añadir una "vista previa" visual entre el clic en **Tomar foto** y la apertura del selector de cámara nativa. Sin backend, sin OpenAI, sin persistencia: solo UI.

## Flujo final
1. Usuario pulsa **Tomar foto a mi mascota** → se abre **`PetScannerOverlay`** (modal fullscreen).
2. El overlay muestra ~2.5 s de animación de "escaneo": marco con esquinas, línea horizontal que recorre el marco, micro-indicadores ("Detectando contorno…", "Preparando análisis visual…", "Listo para capturar").
3. Al terminar el ciclo (o si el usuario pulsa **Capturar ahora**), se cierra el overlay y se dispara `inputRef.current?.click()` exactamente como hoy → cámara nativa → flujo real intacto (captura, análisis con OpenAI, `PetInsightCard`, tracking).
4. Botón **Cancelar** (X) cierra el overlay sin abrir la cámara y vuelve al estado inicial.

## Componente nuevo: `src/components/blueprint/PetScannerOverlay.tsx`
- Props: `open: boolean`, `onCancel: () => void`, `onReady: () => void`.
- Render: `Dialog` shadcn fullscreen en móvil (`max-w-[100vw] h-[100svh]`), fondo oscuro con `backdrop-blur` reutilizando el patrón del overlay de análisis (`bg-background/70 backdrop-blur-sm`) sobre `var(--gradient-hero)`.
- Estructura:
  - Header con título corto ("Preparando escaneo") y botón X (cancelar).
  - Marco central con `aspect-ratio: 3/4`, esquinas en `primary` (estilo "scanner" — 4 L-corners con `border-primary`).
  - Línea horizontal animada (keyframe `scan-line` recorriendo top → bottom → top, 1.6s ease-in-out infinite).
  - Punto pulsante en `primary` con `pulse-glow` (ya existe en el proyecto).
  - Microcopy que rota cada ~800 ms entre 3 frases.
  - CTA **Capturar ahora** (primary, redondeado, mismo estilo que el botón actual) + texto secundario "Auto-captura en breve".
  - Pie con disclaimer reutilizado: `ShieldCheck` + "Procesamos la foto solo para este análisis. No la guardamos."
- Timer interno: `setTimeout(onReady, 2500)`; el botón **Capturar ahora** también llama a `onReady`. Limpieza en unmount.
- Animaciones: definir keyframes `scan-line` y `scan-corner-pulse` en `src/styles.css` (mismo estilo que `pulse-glow` ya presente). Tokens semánticos (`--primary`, `--background`, `--gradient-hero`) — sin colores hardcodeados.

## Cambios en `BlueprintCamera.tsx`
- Nuevo estado: `const [scanning, setScanning] = useState(false)`.
- El botón **Tomar foto** ya no llama directo a `inputRef.click()`; en su lugar: `setScanning(true)` + `track("blueprint_camera_opened", qrParams)` (igual que hoy).
- Renderiza `<PetScannerOverlay open={scanning} onCancel={() => setScanning(false)} onReady={() => { setScanning(false); inputRef.current?.click(); }} />`.
- El resto del flujo (`handleFile`, `runAnalysis`, `PetInsightCard`, badges, descarga, WhatsApp) queda **idéntico**.

## No se toca
- `petAnalysis.ts`, `petEvents.ts`, `/api/analyze-pet`, `/api/public/pet-event`.
- Tracking existente (`track` + `trackPetEvent`).
- `PetInsightCard`, badges, descarga, copy del CTA inicial ni del footer.
- Persistencia / base de datos.

## Estilo unificado
- Mismo `hud-panel`, mismas fuentes (`font-display`), mismos radios (`rounded-2xl`, `rounded-full`).
- Reutiliza `pulse-glow` y `var(--gradient-hero)` ya usados en la sección.
- Iconografía de `lucide-react` (`ScanLine`, `X`, `Camera`, `ShieldCheck`).

## Mobile-first
- Layout en columna, CTA grande (`h-12`), márgenes seguros con `pb-[env(safe-area-inset-bottom)]`. Funciona también en desktop centrando el marco.

## Entregable
Un solo componente nuevo + ~10 líneas modificadas en `BlueprintCamera.tsx` + 2 keyframes en `styles.css`. Sin cambios funcionales.
