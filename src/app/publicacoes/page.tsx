import { EmptyState } from "@/components/empty-state";
import { PublicHeader } from "@/components/public-header";
import { PublicationCard } from "@/components/publication-card";
import { PublicationFilterForm } from "@/components/publication-filter-form";
import { getFilterOptions, getFilters, getPublicPublications } from "@/lib/publications";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function hasActiveFilters(filters: Record<string, string | undefined>) {
  return Object.values(filters).some(Boolean);
}

export default async function PublicacoesPage({ searchParams }: PageProps) {
  const filters = getFilters(await searchParams);
  const [{ data, error }, options] = await Promise.all([
    getPublicPublications(filters),
    getFilterOptions(false)
  ]);
  const publications = data ?? [];

  return (
    <main>
      <PublicHeader />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-school-600">
            Consulta pública
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Publicações</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Apenas publicações com status publicado aparecem nesta área.
          </p>
        </div>

        <PublicationFilterForm
          filters={filters}
          disciplinas={options.disciplinas}
          resetHref="/publicacoes"
        />

        <div className="mt-8">
          {error ? (
            <EmptyState
              title="Erro ao carregar publicações"
              description="Não foi possível buscar as publicações no Supabase. Verifique as variáveis de ambiente e as políticas RLS."
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
              title={
                hasActiveFilters(filters)
                  ? "Nenhum resultado para os filtros aplicados"
                  : "Nenhuma publicação encontrada"
              }
              description={
                hasActiveFilters(filters)
                  ? "Altere os filtros ou limpe a busca para consultar todas as publicações disponíveis."
                  : "Ainda não há publicações com status publicado para os alunos."
              }
            />
          )}
        </div>
      </section>
    </main>
  );
}
