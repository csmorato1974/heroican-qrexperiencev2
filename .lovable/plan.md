## Cambio

Agregar un mensaje breve y discreto dentro del modal "Toma una foto de tu mascota" (componente `src/components/blueprint/BlueprintCamera.tsx`), visible después de que el usuario tome la foto, que recomiende descargar la imagen con los badges y compartirla por WhatsApp para recibir más información personalizada sobre el cuidado de su mascota.

## Ubicación

En la vista posterior a la captura (rama `photo` ya cargada), justo encima o debajo de la fila de botones `Repetir / Descargar / WhatsApp`, agregar un pequeño texto tipo "hint":

- Tipografía: `text-xs text-muted-foreground`
- Ícono pequeño (`Sparkles` o `MessageCircle` ya importado) a la izquierda
- Centrado, con un poco de margen superior

## Texto propuesto

> ✨ Descarga la foto y compártela por WhatsApp para recibir consejos personalizados sobre tu mascota.

(Ajustable si prefieres otro copy.)

## Detalles técnicos

- Único archivo modificado: `src/components/blueprint/BlueprintCamera.tsx`
- Se inserta un `<p>` dentro del bloque `{photo && ...}`, antes del `<div className="flex flex-wrap gap-2">` con los botones.
- Sin cambios en lógica, tracking, ni estilos globales.
