# Plan · Heroican Entry MVP

Landing mobile-first en TanStack Start + React + Tailwind (stack del proyecto) con modal chatbot, recomendador determinístico, captura de leads y CTA WhatsApp. Sin backend real: todo en localStorage, con capa de servicios lista para Supabase/CRM/webhook posterior.

## Alcance

Incluido:
- Landing con secciones Hero, Cómo funciona, Beneficios, Visualización educativa 3D/AR (placeholder), Productos, Footer.
- Modal conversacional "Asistente Heroican" (8 pasos).
- Recomendador por reglas (etapa × tamaño).
- Captura de lead con consentimiento WhatsApp obligatorio y geolocalización opcional.
- CTA WhatsApp a +51 942 799 091 con mensaje precargado y variables del flujo.
- Tracking de eventos en localStorage + panel oculto "Métricas del piloto" con export JSON.
- Lectura de query params QR (`qr_id`, `producto`, `lote`, `campaña`, `ciudad`).
- Diseño premium cálido (crema, canela, naranja, grafito) con tokens semánticos en `src/styles.css`.

Excluido (fase posterior): e-commerce, pago, CRM real, IA real, WebXR/AR real, Supabase.

## Estructura de archivos

```text
src/
  routes/
    index.tsx                  → landing completa
    metrics.tsx                → panel piloto (ruta discreta)
  components/
    Hero.tsx
    HowItWorks.tsx
    Benefits.tsx
    ARPreview.tsx              → placeholder 2D con detección WebXR
    ProductsMatrix.tsx
    Footer.tsx
    chatbot/
      ChatbotModal.tsx         → orquesta pasos
      steps/                   → un componente por paso (welcome, petName, lifeStage, breedSize, age, needs, result, lead, whatsapp)
  lib/
    products.ts                → data Product[] editable
    recommendation.ts          → reglas etapa×tamaño
    tracker.ts                 → EventTracker (localStorage)
    leads.ts                   → CRUD leads localStorage
    qrParams.ts                → parse query params
    whatsapp.ts                → builder de URL + plantilla
    validators.ts              → zod: phone PE/intl, lead schema
  types/
    domain.ts                  → Product, Lead, Event, QrParams, SessionState
  styles.css                   → tokens semánticos Heroican
```

## Diseño visual

Tokens en `src/styles.css` (oklch), mapeados en `@theme inline`:
- `--background` crema claro, `--foreground` grafito.
- `--primary` canela/marrón, `--primary-foreground` crema.
- `--accent` naranja cálido para CTAs.
- `--muted`, `--card`, `--border` suaves.
- Sombras y radios redondeados (xl/2xl).
- Tipografía: heading serif cálido + body sans (carga vía `<link>` en `__root.tsx`).
- Mobile-first; modal casi full-screen en móvil; CTA WhatsApp sticky al final del flujo.

## Flujo chatbot (estado local en `ChatbotModal`)

Pasos: welcome → petName → lifeStage → breedSize → ageRange (opcional) → needs (multi) → result → leadForm → whatsappCTA.
- Estado: `SessionState { sessionId, qrParams, answers, recommendedProduct, lead }`.
- Cada respuesta emite evento `question_answered`.
- `recommendation_generated` al entrar a result.
- Lead form: zod valida nombre, phone (regex PE `^(\+?51)?9\d{8}$` o intl `^\+\d{8,15}$`), ciudad, checkbox WhatsApp obligatorio (gate del CTA), checkbox ubicación opcional (dispara `navigator.geolocation` solo si marcado).
- Botón WhatsApp deshabilitado hasta `consentWhatsApp=true`; abre `https://wa.me/51942799091?text=...` con plantilla del prompt.

## Recomendación (determinística)

```text
Cachorro + Pequeña → Heroican Cachorro Raza Pequeña
Cachorro + Grande  → Heroican Cachorro Raza Grande
Adulto   + Pequeña → Heroican Adulto Raza Pequeña
Adulto   + Grande  → Heroican Adulto Raza Grande
```
Mostrar presentaciones 3/15/22 kg con guía de uso y disclaimer veterinario.

## Tracking

`tracker.ts` expone `track(eventName, metadata?)` que persiste en `localStorage["heroican.events"]` con `sessionId`, `timestamp`, `qrParams`, `metadata`. Eventos del prompt cubiertos uno a uno.

## Panel "Métricas del piloto"

Ruta `/metrics` (link discreto en footer): totales de sesiones, diagnósticos, leads, clicks WhatsApp, ubicaciones permitidas, producto top, botón "Exportar eventos JSON" (descarga `events.json` y `leads.json`).

## Validaciones y cumplimiento

- Zod en lead form; mensajes de error inline accesibles.
- Consentimiento guardado con `createdAt`.
- Sin frases médicas; disclaimer visible en hero, en result y en footer.
- Geolocalización nunca automática.
- AR: feature-detect `navigator.xr` + cámara; siempre fallback 2D; sin descarga de modelos.

## Datos iniciales

`products.ts` con las 4 SKUs, presentaciones y precios del prompt; resumen de ingredientes según fuente. Marcados como editables vía constante exportada.

## Criterios de aceptación

1. `/?qr_id=demo&producto=adulto-grande&lote=L1&campaña=piloto&ciudad=Tacna` carga sin errores y registra `qr_landing_loaded` con esos params.
2. Flujo completo desde CTA hasta WhatsApp produce todos los eventos listados.
3. Recomendación cambia según etapa×tamaño.
4. Lead se guarda en `localStorage["heroican.leads"]`.
5. WhatsApp abre wa.me con mensaje interpolado.
6. Geolocalización solo tras checkbox.
7. `/metrics` muestra contadores correctos y exporta JSON.
8. Responsive verificado móvil y desktop.

## Fuera de alcance

E-commerce, pago, Supabase/CRM real, IA real, WebXR real, descarga de modelos 3D, login.
