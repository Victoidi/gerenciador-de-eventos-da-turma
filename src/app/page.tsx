import { EmptyState } from "@/components/empty-state";
import { PublicHeader } from "@/components/public-header";
import { PublicationCard } from "@/components/publication-card";
import { ButtonLink } from "@/components/ui/button";
import { getPublicPublications } from "@/lib/publications";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data, error } = await getPublicPublications({});
  const publications = (data ?? []).slice(0, 6);

  return (
    <main>
      <PublicHeader />

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-school-600">
              Área pública dos alunos
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Provas, atividades, eventos e avisos da turma em um só lugar.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Consulte publicações liberadas pela SA sem precisar fazer login. Use filtros por
              tipo, disciplina, turma, data e busca textual.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/publicacoes">Ver publicações</ButtonLink>
              <ButtonLink href="/admin/login" variant="secondary">
                Acesso SA
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-school-50 p-6">
            <h2 className="text-lg font-bold text-ink">Como funciona</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
              <li>Alunos visualizam somente publicações com status publicado.</li>
              <li>Rascunhos e arquivadas ficam protegidos no Supabase por RLS.</li>
              <li>A SA gerencia o conteúdo em um painel com login por e-mail e senha.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-school-600">
              Publicações recentes
            </p>
            <h2 className="mt-1 text-2xl font-bold text-ink">Disponíveis para os alunos</h2>
          </div>
          <ButtonLink href="/publicacoes" variant="secondary">
            Abrir filtros
          </ButtonLink>
        </div>

        {error ? (
          <EmptyState
            title="Erro ao carregar publicações"
            description="Confira a configuração do Supabase e tente novamente."
          />
        ) : publications.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {publications.map((publication) => (
              <PublicationCard
                key={publication.id_publicacao}
                publication={publication}
                detailHref={`/publicacoes/${publication.id_publicacao}`}
                compact
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma publicação encontrada"
            description="Quando a SA publicar provas, atividades, eventos ou avisos, eles aparecerão aqui."
          />
        )}
      </section>
    </main>
  );
}
