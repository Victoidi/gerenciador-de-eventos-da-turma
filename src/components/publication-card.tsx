import Link from "next/link";
import { TypeBadge, StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatDateTime, summarizeText } from "@/lib/format";
import type { Publication } from "@/lib/types";

export function PublicationCard({
  publication,
  detailHref,
  compact = false
}: {
  publication: Publication;
  detailHref?: string;
  compact?: boolean;
}) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge type={publication.tp_publicacao} />
        <StatusBadge status={publication.st_publicacao} />
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold tracking-tight text-ink">{publication.nm_titulo}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {compact
            ? summarizeText(publication.ds_publicacao, 150)
            : publication.ds_publicacao}
        </p>
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
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
          <dt className="font-semibold text-ink">Fim</dt>
          <dd className="text-muted">
            {publication.dt_fim ? formatDateTime(publication.dt_fim) : "Não informado"}
          </dd>
        </div>
        {publication.nm_local ? (
          <div>
            <dt className="font-semibold text-ink">Local</dt>
            <dd className="text-muted">{publication.nm_local}</dd>
          </div>
        ) : null}
        <div>
          <dt className="font-semibold text-ink">Criada em</dt>
          <dd className="text-muted">{formatDateTime(publication.dt_criacao)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {publication.ds_link_opcional ? (
          <Link
            href={publication.ds_link_opcional}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-school-700 underline-offset-4 hover:underline"
          >
            Abrir link
          </Link>
        ) : null}
        {detailHref ? (
          <ButtonLink href={detailHref} variant="secondary" size="sm">
            Ver detalhes
          </ButtonLink>
        ) : null}
      </div>
    </article>
  );
}
