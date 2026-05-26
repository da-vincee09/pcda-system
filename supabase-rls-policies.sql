-- Run this in Supabase Dashboard > SQL Editor.
-- It allows signed-in users of this PDCA frontend to manage the four app tables.

alter table public.personnel enable row level security;
alter table public.plans enable row level security;
alter table public.plan_items enable row level security;
alter table public.action_taken enable row level security;

drop policy if exists "Authenticated users can read personnel" on public.personnel;
drop policy if exists "Authenticated users can insert personnel" on public.personnel;
drop policy if exists "Authenticated users can update personnel" on public.personnel;
drop policy if exists "Authenticated users can delete personnel" on public.personnel;

create policy "Authenticated users can read personnel"
on public.personnel for select
to authenticated
using (true);

create policy "Authenticated users can insert personnel"
on public.personnel for insert
to authenticated
with check (true);

create policy "Authenticated users can update personnel"
on public.personnel for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete personnel"
on public.personnel for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can read plans" on public.plans;
drop policy if exists "Authenticated users can insert plans" on public.plans;
drop policy if exists "Authenticated users can update plans" on public.plans;
drop policy if exists "Authenticated users can delete plans" on public.plans;

create policy "Authenticated users can read plans"
on public.plans for select
to authenticated
using (true);

create policy "Authenticated users can insert plans"
on public.plans for insert
to authenticated
with check (true);

create policy "Authenticated users can update plans"
on public.plans for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete plans"
on public.plans for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can read plan items" on public.plan_items;
drop policy if exists "Authenticated users can insert plan items" on public.plan_items;
drop policy if exists "Authenticated users can update plan items" on public.plan_items;
drop policy if exists "Authenticated users can delete plan items" on public.plan_items;

create policy "Authenticated users can read plan items"
on public.plan_items for select
to authenticated
using (true);

create policy "Authenticated users can insert plan items"
on public.plan_items for insert
to authenticated
with check (true);

create policy "Authenticated users can update plan items"
on public.plan_items for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete plan items"
on public.plan_items for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can read action taken" on public.action_taken;
drop policy if exists "Authenticated users can insert action taken" on public.action_taken;
drop policy if exists "Authenticated users can update action taken" on public.action_taken;
drop policy if exists "Authenticated users can delete action taken" on public.action_taken;

create policy "Authenticated users can read action taken"
on public.action_taken for select
to authenticated
using (true);

create policy "Authenticated users can insert action taken"
on public.action_taken for insert
to authenticated
with check (true);

create policy "Authenticated users can update action taken"
on public.action_taken for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete action taken"
on public.action_taken for delete
to authenticated
using (true);
