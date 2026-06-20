# Plan: métricas mínimas del trial de cámara

## 1. Activar Lovable Cloud
El proyecto aún no tiene base de datos. Activo **Lovable Cloud** (PostgreSQL gestionado) para soportar la persistencia. Sin cuentas externas.

## 2. Migración SQL — tabla `pet_analysis_events`

```sql
create type public.pet_event_type as enum
  ('started', 'success', 'failed', 'whatsapp_clicked');

create table public.pet_analysis_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  event_type public.pet_event_type not null,
  detected_animal text,
  size_guess text,
  recommended_focus text,
  fallback_used boolean,
  error_type text,
  source text,
  campaign text
);

create index on public.pet_analysis_events (created_at desc);

-- Sin GRANT a anon/authenticated: solo el server route (service role) escribe.
grant all on public.pet_analysis_events to service_role;

alter table public.pet_analysis_events enable row level security;
-- Sin policies: ningún acceso desde el cliente.
```

Sin fotos, sin base64, sin URLs, sin `short_comment`, sin `visual_tags`, sin `user_agent`. Solo los 11 campos aprobados.

## 3. Server route `/api/public/pet-event` (POST)
- `src/routes/api/public/pet-event.ts`
- Valida payload con Zod (whitelist estricta a los 9 campos aceptados desde cliente: `session_id`, `event_type`, `detected_animal`, `size_guess`, `recommended_focus`, `fallback_used`, `error_type`, `source`, `campaign`).
- Inserta con `supabaseAdmin` cargado dentro del handler.
- Responde siempre `204` rápido; errores se loguean server-side y nunca se propagan.

## 4. Cliente: `src/lib/petEvents.ts`
- `getSessionId()`: UUID anónimo en `sessionStorage` (clave `heroican_pet_session`).
- `getSourceCampaign()`: lee `source` / `utm_campaign` de la URL.
- `trackPetEvent(event_type, payload?)`: `fetch` con `keepalive: true`, envuelto en `try/catch` que silencia errores. Nunca lanza.

## 5. Integración (sin cambiar UX)
- `BlueprintCamera.tsx`:
  - Al iniciar análisis → `trackPetEvent('started')`.
  - Respuesta OK → `trackPetEvent('success', { detected_animal, size_guess, recommended_focus, fallback_used })`.
  - Catch / fallback → `trackPetEvent('failed', { error_type, fallback_used: true })`.
- `PetInsightCard.tsx`:
  - `onClick` WhatsApp → `trackPetEvent('whatsapp_clicked', { detected_animal, size_guess, recommended_focus })`.

## 6. Garantías
- Si la DB falla: `fetch` falla en silencio, la UI sigue intacta (foto, insight card, descarga, WhatsApp, badges).
- Sin PII, sin contenido, sin imagen. `session_id` aleatorio y efímero (solo durante la sesión del navegador).

## 7. Cierre
Al terminar te explicaré: qué base de datos usa el proyecto, la tabla `pet_analysis_events` con sus 11 campos, y qué eventos (`started`, `success`, `failed`, `whatsapp_clicked`) se registran y con qué campos cada uno.

## Fuera de alcance
- Dashboard de métricas.
- Persistencia de fotos o de la respuesta de OpenAI.
- Cambios en badges, descarga, copy o footer.
