# Plan

Voy a reemplazar la imagen fija del hero por una animación frame-by-frame con tus 10 imágenes, manteniendo el layout actual del hero y su efecto de parallax suave.

## Qué voy a hacer

1. Crear los assets de tus 10 imágenes para poder usarlas dentro del proyecto.
2. Reemplazar la imagen actual del bloque derecho del hero por un componente/sección animada que superponga los 10 frames.
3. Aplicar una animación CSS por pasos para que la secuencia cambie imagen por imagen, sin video ni canvas.
4. Mantener el tamaño, proporción y composición del hero para que no se rompa el diseño actual.
5. Ajustar el comportamiento responsive para que la animación se vea bien en desktop y mobile.

## Resultado esperado

- La imagen del hero ya no será la actual estática.
- En su lugar se verá una secuencia visual con tus 10 imágenes.
- La transición será tipo frame-by-frame, como una animación de imágenes consecutivas.
- El resto del hero (texto, CTA y fondo) quedará intacto.

## Detalles técnicos

- Se tocará principalmente `src/components/Hero.tsx`.
- Agregaré los 10 assets de imagen al proyecto.
- La animación se resolverá con `@keyframes` en `src/styles.css` o con clases utilitarias según convenga.
- Usaré capas absolutas u opacidad por frame para lograr el efecto de “trasposición” imagen por imagen.
- No cambiaré lógica del CTA ni otras secciones fuera del hero.