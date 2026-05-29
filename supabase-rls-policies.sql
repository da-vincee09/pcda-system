-- Run this in Supabase Dashboard > SQL Editor.
-- It allows signed-in users of this PDCA frontend to manage the four app tables.

-- Universal workflow platform settings. These columns let the dashboard adapt
-- by business type, industry, and enabled workflow preferences.
alter table public.company_settings
add column if not exists business_type text default 'food_manufacturing',
add column if not exists custom_business_type text,
add column if not exists industry text,
add column if not exists workflow_preferences text,
add column if not exists timezone text default 'Asia/Manila',
add column if not exists branches jsonb default '[]'::jsonb;

-- HR / People module profile fields. These are nullable so existing employee
-- records continue to work while the richer personnel file is phased in.
alter table public.people_profiles
add column if not exists employee_id text,
add column if not exists first_name text,
add column if not exists middle_name text,
add column if not exists last_name text,
add column if not exists suffix text,
add column if not exists gender text,
add column if not exists civil_status text,
add column if not exists nationality text,
add column if not exists emergency_contact_number text,
add column if not exists department text,
add column if not exists employment_type text,
add column if not exists date_hired date,
add column if not exists supervisor_id uuid,
add column if not exists assigned_team text,
add column if not exists work_location text,
add column if not exists shift_schedule text,
add column if not exists education_background text,
add column if not exists skills_competencies text,
add column if not exists document_notes text,
add column if not exists compliance_notes text;

alter table public.people_profiles
alter column operational_role set default 'employee';

alter table public.people_profiles
drop constraint if exists people_profiles_employment_status_check;

alter table public.people_profiles
add constraint people_profiles_employment_status_check
check (employment_status = any (array[
  'active'::text,
  'inactive'::text,
  'suspended'::text,
  'probationary'::text,
  'resigned'::text,
  'terminated'::text
]));

alter table public.user_profiles
drop constraint if exists user_profiles_role_check;

alter table public.user_profiles
add constraint user_profiles_role_check
check (role = any (array[
  'administrator'::text,
  'owner'::text,
  'president'::text,
  'general_manager'::text,
  'hr_manager'::text,
  'hr_staff'::text,
  'production_manager'::text,
  'production_supervisor'::text,
  'supervisor'::text,
  'team_lead'::text,
  'employee'::text,
  'staff'::text,
  'viewer'::text
]));

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'role_permissions_role_module_key_key'
      and conrelid = 'public.role_permissions'::regclass
  ) then
    alter table public.role_permissions
    add constraint role_permissions_role_module_key_key unique (role, module_key);
  end if;
end $$;

insert into public.role_permissions
  (role, module_key, can_view, can_create, can_edit, can_delete, can_approve, can_export)
values
  ('hr_manager', 'hr', true, true, true, true, false, true),
  ('hr_manager', 'do', true, true, false, false, false, false),
  ('hr_manager', 'approvals', true, false, false, false, false, false),
  ('hr_staff', 'hr', true, true, true, false, false, true),
  ('hr_staff', 'do', true, true, false, false, false, false),
  ('employee', 'hr', true, false, false, false, false, false),
  ('employee', 'do', true, true, false, false, false, false)
on conflict (role, module_key) do update set
  can_view = excluded.can_view,
  can_create = excluded.can_create,
  can_edit = excluded.can_edit,
  can_delete = excluded.can_delete,
  can_approve = excluded.can_approve,
  can_export = excluded.can_export,
  updated_at = now();

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
