-- Schema do Tá Rodando
-- Rodar no SQL Editor do Supabase uma vez, ao criar o projeto.

create table if not exists public.alerts_sent (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('github', 'n8n')),
  external_id text not null,
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz not null default now(),
  unique (source, external_id)
);

create index if not exists alerts_sent_source_sent_at_idx
  on public.alerts_sent (source, sent_at desc);
