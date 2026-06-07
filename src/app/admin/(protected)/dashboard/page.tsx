import { EmptyState } from "@/components/empty-state";
import { StatusBadge, TypeBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { getDashboardData } from "@/lib/publications";
import type { Publication } from "@/lib/types";

export const dynamic = "force-dynamic";

const metricLabels = [
  { key: "totalProvas", label: "Provas" },
  { key: "totalAtividades", label: "Atividades" },
  { key: "totalEventos", label: "Eventos" },
  { key: "totalAvisos", label: "Avisos" },
  { key: "totalPublicadas", label: "Publicadas" },
  { key: "totalRascunhos", label: "Rascunhos" },
  { key: "totalArquivadas", label: "Arquivadas" }
] as const;

function PublicationList({ publications }: { publications: Publication[] }) {
  return (
    <div className="divide-y divide-line rounded-lg border border-line bg-surface shadow-soft">
      {publications.map((publication) => {
        const details = [
          publication.nm_disciplina,
          publication.nm_turma,
          publication.dt_inicio ? formatDateTime(publication.dt_inicio) : null
        ].filter(Boolean);

        return (
          <article key={publication.id_publicacao} className="p-4">
            <div className="flex flex-wrap gap-2">
              <TypeBadge type={publication.tp_publicacao} />
              <StatusBadge status={publication.st_publicacao} />
            </div>
            <h3 className="mt-3 font-semibold text-ink">{publication.nm_titulo}</h3>
            {details.length > 0 ? (
              <p className="mt-1 text-sm text-muted">{details.join(" · ")}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export default async function DashboardPage() {
  const { error, metrics, upcoming, recent } = await getDashboardData();

  return (
    <main>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-school-600">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
            Visão geral das publicações
          </h1>
        </div>
        <ButtonLink href="/admin/publicacoes/nova">Nova publicação</ButtonLink>
      </div>

      {error || !metrics ? (
        <EmptyState
          title="Erro ao carregar dashboard"
          description="Não foi possível consultar as publicações. Confira a conexão com o Supabase e as políticas RLS."
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metricLabels.map((metric) => (
              <div
                key={metric.key}
                className="rounded-lg border border-line bg-surface p-5 shadow-soft"
              >
                <p className="text-sm font-semibold text-muted">{metric.label}</p>
                <p className="mt-2 text-3xl font-bold text-ink">{metrics[metric.key]}</p>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink">Próximos itens da semana</h2>
              </div>
              {upcoming.length > 0 ? (
                <PublicationList publications={upcoming} />
              ) : (
                <EmptyState
                  title="Nenhum próximo item na semana"
                  description="Não há publicações com data de início entre hoje e os próximos 7 dias."
                />
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink">Publicações recentes</h2>
                <ButtonLink href="/admin/publicacoes" variant="secondary" size="sm">
                  Ver todas
                </ButtonLink>
              </div>
              {recent.length > 0 ? (
                <PublicationList publications={recent} />
              ) : (
                <EmptyState
                  title="Nenhuma publicação cadastrada"
                  description="Crie a primeira publicação para começar a alimentar o painel da turma."
                  actionHref="/admin/publicacoes/nova"
                  actionLabel="Criar publicação"
                />
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
