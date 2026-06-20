
create type public.pet_event_type as enum ('started', 'success', 'failed', 'whatsapp_clicked');

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

create index pet_analysis_events_created_at_idx on public.pet_analysis_events (created_at desc);

grant all on public.pet_analysis_events to service_role;

alter table public.pet_analysis_events enable row level security;
-- No policies: writes only via server route with service role; no client reads.
