# Reposicionar badges anatómicos sobre la foto de la mascota

Actualizar las coordenadas `x/y` de cada badge en `src/components/blueprint/badges.ts` para que coincidan con la anatomía típica de una mascota fotografiada de frente/cuerpo entero (la foto se renderiza con `aspect-ratio: 3/4` y `object-cover`, por lo que la cabeza queda arriba-centro y las patas abajo).

## Cambios

`src/components/blueprint/badges.ts` — sólo reasignar `x`, `y` y `side`:

| Code | Título            | Zona anatómica   | x (%) | y (%) | side  |
|------|-------------------|------------------|-------|-------|-------|
| F01  | Confort digestivo | Estómago/vientre | 50    | 68    | right |
| F02  | Vitalidad         | Pecho/patas      | 50    | 82    | left  |
| F03  | Piel y pelaje     | Lomo/espalda     | 65    | 40    | right |
| F04  | Palatabilidad     | Boca/hocico      | 50    | 22    | left  |

No se tocan textos, lógica, ni el renderer (`BlueprintCamera.tsx`, `Hotspot`). Los hotspots siguen siendo posiciones relativas en porcentaje sobre la imagen, así que los nuevos valores aplican a cualquier foto cargada.

## Nota

Como cada foto de mascota es distinta (pose, encuadre, zoom), estos valores son una aproximación calibrada al centro del encuadre típico. Si quieres que el usuario pueda arrastrar los badges para ajustarlos a su foto específica, dímelo y lo añado como mejora aparte.
