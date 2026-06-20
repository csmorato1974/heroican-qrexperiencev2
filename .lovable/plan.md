## Objetivo
Agregar el video subido (`Heroican_Reel_MP4_compatible_v2.mp4`, 720x1280, 9s) al hero con layout de dos columnas en escritorio y apilado en móvil, manteniendo responsividad.

## Cambios

### 1. Subir video a CDN (Lovable Assets)
- Usar `lovable-assets create --file /mnt/user-uploads/Heroican_Reel_MP4_compatible_v2.mp4` para generar el puntero `.asset.json`
- Guardar en `src/assets/hero-video-reel.mp4.asset.json`

### 2. Actualizar `src/components/Hero.tsx`
- Restaurar el layout de dos columnas: `lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center`
- Agregar import del nuevo asset de video
- Insertar el elemento `<video>` en la segunda columna con:
  - `autoPlay`, `muted`, `loop`, `playsInline`, `preload="auto"`
  - Clases para responsividad: `w-full max-w-sm lg:max-w-md mx-auto rounded-3xl shadow-2xl`
  - Mantener la animación `hero-video` (respiración) si aplica, o ajustar según el nuevo contenido
- Asegurar que el contenedor del texto ocupe la primera columna y el video la segunda
- Mantener el `max-w-6xl` y padding del contenedor padre

### 3. Ajustes de accesibilidad y performance
- Video sin sonido (`muted`) para autoplay permitido en todos los navegadores
- `aria-hidden` en el contenedor del video si es decorativo, o `aria-label` descriptivo
- `poster` opcional: puede reusarse `heroSeq01` como frame estático mientras carga

## Archivos modificados
- `src/assets/hero-video-reel.mp4.asset.json` (nuevo)
- `src/components/Hero.tsx`

## Verificación
- Build exitoso (`bun run build`)
- Preview en viewport móvil (< 768px): video apilado debajo del texto, ancho completo
- Preview en escritorio (≥ 1024px): texto a la izquierda, video a la derecha, proporción 1.1fr/1fr