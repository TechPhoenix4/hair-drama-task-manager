create extension if not exists "uuid-ossp";

create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  created_by uuid references public.users(id) not null,
  assigned_to uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);