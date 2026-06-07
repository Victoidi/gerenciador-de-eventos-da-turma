create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.tb_th_usuario_perfil (
  id_usuario uuid primary key references auth.users(id) on delete cascade,
  nm_email text not null,
  tp_perfil text not null default 'admin',
  dt_criacao timestamptz not null default now(),
  constraint tb_th_usuario_perfil_tp_perfil_ck check (tp_perfil in ('admin'))
);

create table if not exists public.tb_th_publicacao (
  id_publicacao uuid primary key default gen_random_uuid(),
  tp_publicacao text not null,
  nm_titulo text not null,
  ds_publicacao text not null,
  nm_disciplina text not null,
  nm_turma text null,
  dt_inicio timestamptz null,
  dt_fim timestamptz null,
  nm_local text null,
  ds_link_opcional text null,
  st_publicacao text not null default 'rascunho',
  dt_criacao timestamptz not null default now(),
  dt_atualizacao timestamptz not null default now(),
  id_usuario_criacao uuid null references auth.users(id),
  constraint tb_th_publicacao_tp_publicacao_ck
    check (tp_publicacao in ('prova', 'atividade', 'evento', 'aviso')),
  constraint tb_th_publicacao_st_publicacao_ck
    check (st_publicacao in ('rascunho', 'publicado', 'arquivado')),
  constraint tb_th_publicacao_periodo_ck
    check (dt_inicio is null or dt_fim is null or dt_fim >= dt_inicio)
);

alter table public.tb_th_publicacao
  alter column nm_turma drop not null,
  alter column dt_inicio drop not null,
  alter column nm_local drop not null;

alter table public.tb_th_publicacao
  drop constraint if exists tb_th_publicacao_periodo_ck,
  add constraint tb_th_publicacao_periodo_ck
    check (dt_inicio is null or dt_fim is null or dt_fim >= dt_inicio);

create index if not exists idx_tb_th_publicacao_tp_publicacao
  on public.tb_th_publicacao (tp_publicacao);

create index if not exists idx_tb_th_publicacao_st_publicacao
  on public.tb_th_publicacao (st_publicacao);

create index if not exists idx_tb_th_publicacao_nm_disciplina
  on public.tb_th_publicacao (nm_disciplina);

create index if not exists idx_tb_th_publicacao_nm_turma
  on public.tb_th_publicacao (nm_turma);

create index if not exists idx_tb_th_publicacao_dt_inicio
  on public.tb_th_publicacao (dt_inicio);

create index if not exists idx_tb_th_publicacao_titulo_trgm
  on public.tb_th_publicacao using gin (nm_titulo gin_trgm_ops);

create index if not exists idx_tb_th_publicacao_descricao_trgm
  on public.tb_th_publicacao using gin (ds_publicacao gin_trgm_ops);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as '
  select exists (
    select 1
    from public.tb_th_usuario_perfil perfil
    where perfil.id_usuario = auth.uid()
      and perfil.tp_perfil = ''admin''
  );
';

create or replace function public.set_publicacao_usuario_criacao()
returns trigger
language plpgsql
security definer
set search_path = public
as '
declare
  usuario_atual uuid;
begin
  usuario_atual := auth.uid();

  if usuario_atual is null then
    raise exception ''Usuario autenticado e obrigatorio para criar publicacoes.'';
  end if;

  if new.id_usuario_criacao is null then
    new.id_usuario_criacao := usuario_atual;
  end if;

  if new.id_usuario_criacao <> usuario_atual then
    raise exception ''id_usuario_criacao deve ser igual ao usuario autenticado.'';
  end if;

  return new;
end;
';

create or replace function public.set_dt_atualizacao()
returns trigger
language plpgsql
set search_path = public
as '
begin
  new.dt_atualizacao := now();
  return new;
end;
';

drop trigger if exists trg_tb_th_publicacao_usuario_criacao on public.tb_th_publicacao;
create trigger trg_tb_th_publicacao_usuario_criacao
before insert on public.tb_th_publicacao
for each row
execute function public.set_publicacao_usuario_criacao();

drop trigger if exists trg_tb_th_publicacao_dt_atualizacao on public.tb_th_publicacao;
create trigger trg_tb_th_publicacao_dt_atualizacao
before update on public.tb_th_publicacao
for each row
execute function public.set_dt_atualizacao();

alter table public.tb_th_publicacao enable row level security;
alter table public.tb_th_usuario_perfil enable row level security;

drop policy if exists "public_select_publicacoes_publicadas" on public.tb_th_publicacao;
create policy "public_select_publicacoes_publicadas"
on public.tb_th_publicacao
for select
to anon, authenticated
using (st_publicacao = 'publicado');

drop policy if exists "admin_select_todas_publicacoes" on public.tb_th_publicacao;
create policy "admin_select_todas_publicacoes"
on public.tb_th_publicacao
for select
to authenticated
using (public.is_admin());

drop policy if exists "admin_insert_publicacoes" on public.tb_th_publicacao;
create policy "admin_insert_publicacoes"
on public.tb_th_publicacao
for insert
to authenticated
with check (
  public.is_admin()
  and id_usuario_criacao = auth.uid()
);

drop policy if exists "admin_update_publicacoes" on public.tb_th_publicacao;
create policy "admin_update_publicacoes"
on public.tb_th_publicacao
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_delete_publicacoes" on public.tb_th_publicacao;
create policy "admin_delete_publicacoes"
on public.tb_th_publicacao
for delete
to authenticated
using (public.is_admin());

drop policy if exists "select_proprio_perfil_ou_admin" on public.tb_th_usuario_perfil;
create policy "select_proprio_perfil_ou_admin"
on public.tb_th_usuario_perfil
for select
to authenticated
using (id_usuario = auth.uid() or public.is_admin());

drop policy if exists "admin_insert_perfis" on public.tb_th_usuario_perfil;
create policy "admin_insert_perfis"
on public.tb_th_usuario_perfil
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admin_update_perfis" on public.tb_th_usuario_perfil;
create policy "admin_update_perfis"
on public.tb_th_usuario_perfil
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_delete_perfis" on public.tb_th_usuario_perfil;
create policy "admin_delete_perfis"
on public.tb_th_usuario_perfil
for delete
to authenticated
using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.tb_th_publicacao to anon, authenticated;
grant insert, update, delete on public.tb_th_publicacao to authenticated;
grant select on public.tb_th_usuario_perfil to authenticated;
grant insert, update, delete on public.tb_th_usuario_perfil to authenticated;
grant execute on function public.is_admin() to authenticated;

-- Depois de criar o primeiro usuario em Supabase Auth, execute:
-- insert into public.tb_th_usuario_perfil (id_usuario, nm_email, tp_perfil)
-- values ('UUID_DO_USUARIO', 'email@exemplo.com', 'admin');
