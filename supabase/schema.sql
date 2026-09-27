-- Digilago Admin : schéma Supabase (à exécuter une fois dans SQL Editor)
-- Toutes les données de l'admin vivent dans une seule table de documents JSON, protégée par RLS.

create table if not exists public.records (
  id text primary key,
  collection text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists records_collection_idx on public.records (collection);
create index if not exists records_phone_idx on public.records ((data->>'phone'));

-- Administrateurs : ajoutez ici l'identifiant de votre compte (Authentication > Users)
create table if not exists public.admins (user_id uuid primary key references auth.users (id) on delete cascade);

create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table public.records enable row level security;
alter table public.admins enable row level security;
drop policy if exists "admins lisent leur ligne" on public.admins;
create policy "admins lisent leur ligne" on public.admins for select using (auth.uid() = user_id);
drop policy if exists "admin : accès complet" on public.records;
create policy "admin : accès complet" on public.records for all using (public.is_admin()) with check (public.is_admin());
-- Aucun accès anonyme : le site public écrit uniquement via les fonctions serveur (lead, subscribe).

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists records_touch on public.records;
create trigger records_touch before update on public.records for each row execute function public.touch_updated_at();

-- Temps réel : l'admin voit arriver demandes et messages WhatsApp sans recharger
alter publication supabase_realtime add table public.records;

-- Tâche planifiée quotidienne (relances de factures, résumé du jour) à 8 h, heure du Maroc (7 h UTC)
-- Activez les extensions pg_cron et pg_net, remplacez <PROJET> et <CRON_SECRET>, puis exécutez :
-- select cron.schedule('digilago-cron', '0 7 * * *', $$
--   select net.http_post(url := 'https://<PROJET>.supabase.co/functions/v1/cron',
--     headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>'), body := '{}'::jsonb);
-- $$);

-- Après la création de votre compte admin :
-- insert into public.admins (user_id) values ('<UUID de votre utilisateur>');
