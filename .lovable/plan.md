## Cambio

Agregar el video vertical subido (`video_vertical.mp4`) al componente `src/components/Hero.tsx` y mostrarlo de forma responsive junto al texto principal.

## Pasos

1. Subir `video_vertical.mp4` al CDN de Lovable Assets y crear el pointer `src/assets/hero-video-vertical.mp4.asset.json`.
2. Editar `src/components/Hero.tsx`:
   - Restaurar el layout en 2 columnas: `grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center`.
   - Columna izquierda: el contenido actual (título, párrafo, botón).
   - Columna derecha: un contenedor con el video vertical.
3. Reintroducir el `videoRef` y el `useEffect` que ajusta `playbackRate` (opcional, lo dejamos en 1x ya que es vertical real).
4. Estructura del video:
   - Wrapper `relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[420px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl`.
   - `<video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover">`.
   - Halo `bg-primary/10 blur-3xl` detrás como antes.
5. Mantener el parallax sutil con `scrollY` en la columna del video.

## Responsive

- Móvil (`<lg`): el video aparece debajo del texto, centrado, ancho máximo ~320px para no dominar la pantalla.
- Desktop (`lg+`): el video aparece a la derecha del texto, ancho máximo ~420px, manteniendo aspect 9:16.

## Archivos

- Nuevo: `src/assets/hero-video-vertical.mp4.asset.json`
- Editado: `src/components/Hero.tsx`
