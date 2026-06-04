import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { EmptyState } from "@/components/empty-state";
import { PublicationFilterForm } from "@/components/publication-filter-form";
import { StatusBadge, TypeBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { PUBLICATION_STATUSES } from "@/lib/constants";
import { formatDateTime, summarizeText } from "@/lib/format";
import { getAdminPublications, getFilterOptions, getFilters } from "@/lib/publications";
import type { Publication } from "@/lib/types";
import {
  changePublicationStatusAction,
  deletePublicationAction
} from "@/app/admin/publicacoes/actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const successMessages: Record<string, string> = {
  criada: "Publicação criada com sucesso.",
  atualizada: "Publicação atualizada com sucesso.",
  excluida: "Publicação excluída com sucesso.",
  status: "Status alterado com sucesso."
};

function valueOf(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function hasActiveFilters(filters: Record<string, string | undefined>) {
  return Object.values(filters).some(Boolean);
}

function AdminPublicationCard({ publication }: { publication: Publication }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <TypeBadge type={publication.tp_publicacao} />
            <StatusBadge status={publication.st_publicacao} />
          </div>
          <h2 className="mt-3 text-xl font-bold text-ink">{publication.nm_titulo}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {summarizeText(publication.ds_publicacao, 180)}
          </p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="font-semibold text-ink">Disciplina</dt>
              <dd className="text-muted">{publication.nm_disciplina}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Turma</dt>
              <dd className="text-muted">{publication.nm_turma}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Início</dt>
              <dd className="text-muted">{formatDateTime(publication.dt_inicio)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Atualização</dt>
              <dd className="text-muted">{formatDateTime(publication.dt_atualizacao)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 flex-col gap-3 lg:w-72">
          <form action={changePublicationStatusAction} className="space-y-2">
            <input type="hidden" name="id_publicacao" value={publication.id_publicacao} />
            <label className="block text-sm font-semibold text-ink">
              Alterar status
              <select
                name="st_publicacao"
                defaultValue={publication.st_publicacao}
                className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 text-sm font-normal text-ink outline-none focus:border-school-500 focus:ring-2 focus:ring-school-100"
              >
                {PUBLICATION_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <SubmitButton variant="secondary" pendingLabel="Alterando..." className="w-full">
              Alterar
            </SubmitButton>
          </form>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/publicacoes/${publication.id_publicacao}/editar`}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-school-600 px-3 text-sm font-semibold text-white hover:bg-school-700"
            >
              Editar
            </Link>
            <form action={deletePublicationAction.bind(null, publication.id_publicacao)}>
              <ConfirmSubmitButton
                message={`Excluir a publicação "${publication.nm_titulo}"? Esta ação não pode ser desfeita.`}
              >
                Excluir
              </ConfirmSubmitButton>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function AdminPublicacoesPage({ searchParams }: PageProps) {
  const rawSearchParams = await searchParams;
  const filters = getFilters(rawSearchParams);
  const [{ data, error }, options] = await Promise.all([
    getAdminPublications(filters),
    getFilterOptions(true)
  ]);
  const publications = data ?? [];
  const success = valueOf(rawSearchParams, "sucesso");
  const errorMessage = valueOf(rawSearchParams, "erro");

  return (
    <main>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-school-600">
            Administração
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
            Gerenciar publicações
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Visualize, filtre, crie, edite, exclua e altere o status de provas, atividades,
            eventos e avisos.
          </p>
        </div>
        <ButtonLink href="/admin/publicacoes/nova">Nova publicação</ButtonLink>
      </div>

      {success && successMessages[success] ? (
        <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {successMessages[success]}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <PublicationFilterForm
        filters={filters}
        disciplinas={options.disciplinas}
        turmas={options.turmas}
        showStatus
        resetHref="/admin/publicacoes"
      />

      <section className="mt-8">
        {error ? (
          <EmptyState
            title="Erro ao carregar publicações"
            description="Não foi possível listar as publicações administrativas. Verifique Supabase, sessão e permissões RLS."
          />
        ) : publications.length > 0 ? (
          <div className="space-y-4">
            {publications.map((publication) => (
              <AdminPublicationCard key={publication.id_publicacao} publication={publication} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              hasActiveFilters(filters)
                ? "Nenhum resultado para os filtros aplicados"
                : "Nenhuma publicação cadastrada"
            }
            description={
              hasActiveFilters(filters)
                ? "Ajuste os filtros para localizar outras publicações."
                : "Crie a primeira publicação para aparecer na área pública quando estiver publicada."
            }
            actionHref="/admin/publicacoes/nova"
            actionLabel="Criar publicação"
          />
        )}
      </section>
    </main>
  );
}
