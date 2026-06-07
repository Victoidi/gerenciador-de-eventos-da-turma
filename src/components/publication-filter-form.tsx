import { PUBLICATION_STATUSES, PUBLICATION_TYPES } from "@/lib/constants";
import type { PublicationFilters } from "@/lib/types";
import { ButtonLink, buttonClassName } from "@/components/ui/button";

export function PublicationFilterForm({
  filters,
  disciplinas,
  showStatus = false,
  resetHref = "/publicacoes"
}: {
  filters: PublicationFilters;
  disciplinas: string[];
  showStatus?: boolean;
  resetHref?: string;
}) {
  return (
    <form
      className="grid gap-4 rounded-lg border border-line bg-surface p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-4"
      action={resetHref}
    >
      <label className="space-y-1.5 text-sm font-semibold text-ink">
        <span>Tipo</span>
        <select
          name="tipo"
          defaultValue={filters.tipo ?? ""}
          className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal text-ink outline-none focus:border-school-500 focus:ring-2 focus:ring-school-100"
        >
          <option value="">Todos</option>
          {PUBLICATION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1.5 text-sm font-semibold text-ink">
        <span>Disciplina</span>
        <select
          name="disciplina"
          defaultValue={filters.disciplina ?? ""}
          className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal text-ink outline-none focus:border-school-500 focus:ring-2 focus:ring-school-100"
        >
          <option value="">Todas</option>
          {disciplinas.map((disciplina) => (
            <option key={disciplina} value={disciplina}>
              {disciplina}
            </option>
          ))}
        </select>
      </label>

      {showStatus ? (
        <label className="space-y-1.5 text-sm font-semibold text-ink">
          <span>Status</span>
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal text-ink outline-none focus:border-school-500 focus:ring-2 focus:ring-school-100"
          >
            <option value="">Todos</option>
            {PUBLICATION_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="space-y-1.5 text-sm font-semibold text-ink sm:col-span-2">
        <span>Busca</span>
        <input
          type="search"
          name="busca"
          defaultValue={filters.busca ?? ""}
          placeholder="Título ou descrição"
          className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal text-ink outline-none focus:border-school-500 focus:ring-2 focus:ring-school-100"
        />
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end lg:col-span-2">
        <button type="submit" className={buttonClassName({ className: "w-full sm:w-auto" })}>
          Filtrar
        </button>
        <ButtonLink href={resetHref} variant="secondary" className="w-full sm:w-auto">
          Limpar
        </ButtonLink>
      </div>
    </form>
  );
}
