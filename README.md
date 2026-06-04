# Gerenciador de Eventos da Turma

Sistema web em Next.js para alunos consultarem publicações da turma sem login e para a SA administrar provas, atividades, eventos e avisos com Supabase Auth, PostgreSQL e Row Level Security.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Deploy pronto para Vercel

## Rotas

### Públicas

- `/` - página inicial com publicações disponíveis
- `/publicacoes` - listagem pública com filtros
- `/publicacoes/[id]` - detalhe de publicação publicada

### Administrativas

- `/admin/login` - login da SA
- `/admin/dashboard` - indicadores e próximos itens da semana
- `/admin/publicacoes` - listagem administrativa com filtros e ações
- `/admin/publicacoes/nova` - criação de publicação
- `/admin/publicacoes/[id]/editar` - edição de publicação

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Execute o script completo em `supabase/schema.sql`.
4. No painel do Supabase, copie:
   - Project URL
   - publishable key
5. Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

Não use Service Role Key no front-end.

## Criar o primeiro administrador SA

1. No Supabase, acesse **Authentication > Users**.
2. Crie um usuário com e-mail e senha.
3. Copie o UUID desse usuário.
4. Abra o SQL Editor e execute:

```sql
insert into public.tb_th_usuario_perfil (id_usuario, nm_email, tp_perfil)
values ('UUID_DO_USUARIO', 'email@exemplo.com', 'admin');
```

5. Acesse `/admin/login`.
6. Entre com o e-mail e a senha criados no Supabase Auth.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Para verificar tipos:

```bash
npm run typecheck
```

Para gerar build de produção:

```bash
npm run build
```

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Importe o projeto na Vercel.
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Faça o deploy.
5. No Supabase Auth, confirme que o domínio da Vercel está permitido nas configurações de URL, se necessário.

## Segurança

- Alunos não precisam de login.
- Alunos só fazem `SELECT` em publicações com `st_publicacao = 'publicado'`.
- Rascunhos e arquivadas não aparecem na área pública.
- Rotas administrativas exigem sessão e perfil admin.
- CRUD administrativo é protegido por middleware, layout protegido, server actions e políticas RLS.
- A tabela `tb_th_usuario_perfil` define quem é admin.
- O front-end usa somente a chave pública `anon`.

## Banco

O arquivo `supabase/schema.sql` cria:

- `tb_th_publicacao`
- `tb_th_usuario_perfil`
- constraints de tipo, status e período
- índices de filtros e busca textual
- função `is_admin()`
- trigger de `dt_atualizacao`
- trigger para validar `id_usuario_criacao`
- políticas RLS para público e administradores
