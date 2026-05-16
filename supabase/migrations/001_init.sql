-- Initial Supabase schema for SYNCly
-- Enables UUID generation
create extension if not exists "pgcrypto";

-- Profiles table (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  username text,
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

-- Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo',
  priority text not null default 'medium',
  assignee text not null default 'You',
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_tasks_user_id on tasks(user_id);
create index if not exists idx_tasks_due_date on tasks(due_date);

-- Task comments
create table if not exists task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz default now()
);

create index if not exists idx_comments_task_id on task_comments(task_id);

-- Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null,
  payload jsonb,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_notifications_user_id on notifications(user_id);

-- Activity logs
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  meta jsonb,
  created_at timestamptz default now()
);

-- RLS: enable row level security and policies so users can only access their own rows
-- Profiles
alter table profiles enable row level security;
create policy "profiles_is_owner" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);

-- Tasks
alter table tasks enable row level security;
create policy "tasks_select_own" on tasks for select using (user_id = auth.uid());
create policy "tasks_insert" on tasks for insert with check (user_id = auth.uid());
create policy "tasks_update_own" on tasks for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tasks_delete_own" on tasks for delete using (user_id = auth.uid());

-- Task comments: users can insert comments (user_id = auth.uid()) and select comments for tasks they own or comments they've authored
alter table task_comments enable row level security;
create policy "comments_insert" on task_comments for insert with check (user_id = auth.uid());
create policy "comments_select" on task_comments for select using (
  exists (select 1 from tasks t where t.id = task_comments.task_id and t.user_id = auth.uid())
  or user_id = auth.uid()
);

-- Notifications
alter table notifications enable row level security;
create policy "notifications_select_own" on notifications for select using (user_id = auth.uid());
create policy "notifications_insert" on notifications for insert with check (user_id = auth.uid());
create policy "notifications_update_own" on notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications_delete_own" on notifications for delete using (user_id = auth.uid());

-- Activity logs
alter table activity_logs enable row level security;
create policy "activity_select" on activity_logs for select using (
  exists (select 1 from tasks t where t.id = activity_logs.task_id and t.user_id = auth.uid())
);

-- Trigger to update "updated_at" on tasks
create or replace function trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_timestamp before update on tasks for each row execute procedure trigger_set_timestamp();

-- Done
