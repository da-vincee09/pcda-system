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

-- Naming bridge:
-- product_lines is the current table used by the app as Workspaces.
-- generated_tasks.product_line_id is the current task-to-workspace link.
-- workspace_id makes that relationship explicit while keeping existing app code
-- and existing data compatible.
alter table public.product_lines
add column if not exists pdca_stage text default 'plan',
add column if not exists assigned_person_id uuid,
add column if not exists target_date date,
add column if not exists updated_at timestamptz;

alter table public.generated_tasks
add column if not exists workspace_id uuid;

update public.generated_tasks
set workspace_id = product_line_id
where workspace_id is null
  and product_line_id is not null;

update public.generated_tasks
set workspace_id = null
where workspace_id is not null
  and not exists (
    select 1
    from public.product_lines
    where product_lines.id = generated_tasks.workspace_id
  );

update public.generated_tasks
set product_line_id = null
where product_line_id is not null
  and not exists (
    select 1
    from public.product_lines
    where product_lines.id = generated_tasks.product_line_id
  );

alter table public.generated_tasks
drop constraint if exists generated_tasks_workspace_id_fkey;

alter table public.generated_tasks
add constraint generated_tasks_workspace_id_fkey
foreign key (workspace_id)
references public.product_lines(id)
on delete cascade;

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    join pg_attribute att
      on att.attrelid = con.conrelid
     and att.attnum = any(con.conkey)
    where con.conrelid = 'public.generated_tasks'::regclass
      and con.confrelid = 'public.product_lines'::regclass
      and con.contype = 'f'
      and att.attname = 'product_line_id'
  loop
    execute format('alter table public.generated_tasks drop constraint if exists %I', constraint_name);
  end loop;
end $$;

alter table public.generated_tasks
add constraint generated_tasks_product_line_id_fkey
foreign key (product_line_id)
references public.product_lines(id)
on delete cascade;

create index if not exists generated_tasks_workspace_id_idx
on public.generated_tasks(workspace_id);

create or replace function public.sync_generated_task_workspace_ids()
returns trigger
language plpgsql
as $$
begin
  if new.workspace_id is null and new.product_line_id is not null then
    new.workspace_id := new.product_line_id;
  end if;

  if new.product_line_id is null and new.workspace_id is not null then
    new.product_line_id := new.workspace_id;
  end if;

  if new.workspace_id is not null
     and new.product_line_id is not null
     and new.workspace_id <> new.product_line_id then
    new.product_line_id := new.workspace_id;
  end if;

  return new;
end;
$$;

drop trigger if exists sync_generated_task_workspace_ids
on public.generated_tasks;

create trigger sync_generated_task_workspace_ids
before insert or update of workspace_id, product_line_id
on public.generated_tasks
for each row
execute function public.sync_generated_task_workspace_ids();

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

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people_profiles(id) on delete cascade,
  attendance_date date not null,
  time_in time,
  time_out time,
  status text not null default 'present',
  notes text,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint attendance_status_check check (status = any (array[
    'present'::text,
    'late'::text,
    'absent'::text,
    'on_leave'::text
  ])),
  constraint attendance_person_date_key unique (person_id, attendance_date)
);

create index if not exists idx_attendance_person_id
on public.attendance(person_id);

create index if not exists idx_attendance_date
on public.attendance(attendance_date);

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
  ('administrator', 'planning', true, true, true, true, true, true),
  ('owner', 'planning', true, true, true, true, true, true),
  ('general_manager', 'planning', true, true, true, false, true, true),
  ('production_manager', 'planning', true, true, true, false, true, true),
  ('production_supervisor', 'planning', true, true, true, false, false, true),
  ('supervisor', 'planning', true, true, true, false, false, true),
  ('team_lead', 'planning', true, true, false, false, false, true),
  ('hr_manager', 'planning', true, true, true, false, false, true),
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
alter table public.product_lines enable row level security;
alter table public.action_taken enable row level security;
alter table public.attendance enable row level security;

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

drop policy if exists "Authenticated users can read workspaces" on public.product_lines;
drop policy if exists "Authorized roles can insert workspaces" on public.product_lines;
drop policy if exists "Authorized roles can update workspaces" on public.product_lines;
drop policy if exists "Authorized roles can delete workspaces" on public.product_lines;

create policy "Authenticated users can read workspaces"
on public.product_lines for select
to authenticated
using (true);

create policy "Authorized roles can insert workspaces"
on public.product_lines for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in (
        'administrator',
        'owner',
        'president',
        'general_manager',
        'production_manager',
        'production_supervisor',
        'supervisor',
        'hr_manager'
      )
  )
);

create policy "Authorized roles can update workspaces"
on public.product_lines for update
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in (
        'administrator',
        'owner',
        'president',
        'general_manager',
        'production_manager',
        'production_supervisor',
        'supervisor',
        'hr_manager'
      )
  )
)
with check (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in (
        'administrator',
        'owner',
        'president',
        'general_manager',
        'production_manager',
        'production_supervisor',
        'supervisor',
        'hr_manager'
      )
  )
);

create policy "Authorized roles can delete workspaces"
on public.product_lines for delete
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('administrator', 'owner', 'president')
  )
);

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

drop policy if exists "HR roles and owners can read attendance" on public.attendance;
drop policy if exists "HR roles can insert attendance" on public.attendance;
drop policy if exists "HR roles can update attendance" on public.attendance;
drop policy if exists "HR roles can delete attendance" on public.attendance;

create policy "HR roles and owners can read attendance"
on public.attendance for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('administrator', 'owner', 'general_manager', 'hr_manager', 'hr_staff')
  )
  or exists (
    select 1
    from public.people_profiles pp
    where pp.id = attendance.person_id
      and pp.user_id = auth.uid()
  )
);

create policy "HR roles can insert attendance"
on public.attendance for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('administrator', 'owner', 'general_manager', 'hr_manager', 'hr_staff')
  )
);

create policy "HR roles can update attendance"
on public.attendance for update
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('administrator', 'owner', 'general_manager', 'hr_manager', 'hr_staff')
  )
)
with check (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('administrator', 'owner', 'general_manager', 'hr_manager', 'hr_staff')
  )
);

create policy "HR roles can delete attendance"
on public.attendance for delete
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('administrator', 'owner', 'general_manager', 'hr_manager', 'hr_staff')
  )
);
