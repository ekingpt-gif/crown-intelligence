-- Crown Intelligence Mission Control — Database Schema
-- Run this in your Supabase SQL editor or via Supabase CLI

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- CLIENTS
-- ============================================================
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  website_url text,
  industry text,
  contact_name text,
  contact_email text,
  phone text,
  notes text,
  brand_voice text,
  target_audience text,
  services text,
  competitors text,
  status text default 'lead' check (status in ('lead','active','paused','archived')),
  instagram text,
  facebook text,
  tiktok text,
  linkedin text,
  youtube text,
  twitter text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table clients enable row level security;

create policy "Users manage own clients"
  on clients for all using (auth.uid() = user_id);

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients on delete set null,
  name text not null,
  description text,
  status text default 'active',
  due_date date,
  created_at timestamptz default now()
);

alter table projects enable row level security;

create policy "Users manage own projects"
  on projects for all using (auth.uid() = user_id);

-- ============================================================
-- WEBSITE AUDITS
-- ============================================================
create table if not exists website_audits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients on delete set null,
  url text not null,
  performance_score int,
  seo_score int,
  mobile_score int,
  technical_score int,
  conversion_score int,
  performance_notes text,
  seo_notes text,
  mobile_notes text,
  technical_notes text,
  conversion_notes text,
  suggested_fixes text,
  created_at timestamptz default now()
);

alter table website_audits enable row level security;

create policy "Users manage own audits"
  on website_audits for all using (auth.uid() = user_id);

-- ============================================================
-- SEO REPORTS
-- ============================================================
create table if not exists seo_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients on delete set null,
  title text not null,
  page_title_review text,
  meta_description_review text,
  heading_structure text,
  keyword_opportunities text,
  local_seo text,
  content_gaps text,
  competitor_notes text,
  priority_actions text,
  status text default 'draft' check (status in ('draft','reviewed','sent')),
  created_at timestamptz default now()
);

alter table seo_reports enable row level security;

create policy "Users manage own seo reports"
  on seo_reports for all using (auth.uid() = user_id);

-- ============================================================
-- CONTENT ITEMS
-- ============================================================
create table if not exists content_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients on delete set null,
  type text not null check (type in ('blog_idea','blog_article','website_copy','email_campaign','landing_page','offer_positioning')),
  title text not null,
  body text,
  status text default 'draft',
  created_at timestamptz default now()
);

alter table content_items enable row level security;

create policy "Users manage own content"
  on content_items for all using (auth.uid() = user_id);

-- ============================================================
-- SOCIAL POSTS
-- ============================================================
create table if not exists social_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients on delete set null,
  platform text not null check (platform in ('instagram','linkedin','facebook','tiktok','reel','carousel')),
  caption text,
  hook text,
  cta text,
  hashtags text,
  status text default 'idea' check (status in ('idea','draft','approved','posted')),
  created_at timestamptz default now()
);

alter table social_posts enable row level security;

create policy "Users manage own social posts"
  on social_posts for all using (auth.uid() = user_id);

-- ============================================================
-- AD CAMPAIGNS
-- ============================================================
create table if not exists ad_campaigns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients on delete set null,
  platform text not null check (platform in ('meta','google')),
  campaign_name text not null,
  objective text,
  offer text,
  audience text,
  angle text,
  primary_text text,
  headline text,
  cta text,
  budget text,
  notes text,
  status text default 'planning' check (status in ('planning','active','paused','completed')),
  created_at timestamptz default now()
);

alter table ad_campaigns enable row level security;

create policy "Users manage own campaigns"
  on ad_campaigns for all using (auth.uid() = user_id);

-- ============================================================
-- ASSETS
-- ============================================================
create table if not exists assets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients on delete set null,
  name text not null,
  file_url text not null,
  file_type text,
  size bigint,
  notes text,
  created_at timestamptz default now()
);

alter table assets enable row level security;

create policy "Users manage own assets"
  on assets for all using (auth.uid() = user_id);

-- ============================================================
-- TASKS
-- ============================================================
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients on delete set null,
  project_id uuid references projects on delete set null,
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo','in_progress','done')),
  priority text default 'medium' check (priority in ('low','medium','high')),
  due_date date,
  created_at timestamptz default now()
);

alter table tasks enable row level security;

create policy "Users manage own tasks"
  on tasks for all using (auth.uid() = user_id);

-- ============================================================
-- GENERATED REPORTS
-- ============================================================
create table if not exists generated_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients on delete set null,
  title text not null,
  content text,
  status text default 'draft' check (status in ('draft','reviewed','sent')),
  created_at timestamptz default now()
);

alter table generated_reports enable row level security;

create policy "Users manage own reports"
  on generated_reports for all using (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_clients_user_id on clients(user_id);
create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_projects_client_id on projects(client_id);
create index if not exists idx_website_audits_user_id on website_audits(user_id);
create index if not exists idx_website_audits_client_id on website_audits(client_id);
create index if not exists idx_seo_reports_user_id on seo_reports(user_id);
create index if not exists idx_content_items_user_id on content_items(user_id);
create index if not exists idx_social_posts_user_id on social_posts(user_id);
create index if not exists idx_ad_campaigns_user_id on ad_campaigns(user_id);
create index if not exists idx_tasks_user_id on tasks(user_id);
create index if not exists idx_generated_reports_user_id on generated_reports(user_id);
