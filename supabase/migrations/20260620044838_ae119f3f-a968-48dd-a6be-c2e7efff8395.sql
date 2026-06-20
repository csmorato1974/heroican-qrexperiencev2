-- Allow anon + authenticated to INSERT analytics events; no SELECT/UPDATE/DELETE for them.
-- service_role retains full access (already implicit, bypasses RLS).
CREATE POLICY "Anyone can insert pet analysis events"
ON public.pet_analysis_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
