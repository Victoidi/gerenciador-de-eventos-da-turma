"use client";

import { useActionState } from "react";
import { PUBLICATION_STATUSES, PUBLICATION_TYPES } from "@/lib/constants";
import {
  EMPTY_PUBLICATION_ACTION_STATE,
  type PublicationActionState
} from "@/lib/action-state";
import { toDateTimeLocalValue } from "@/lib/format";
import type { Publication } from "@/lib/types";
import { ButtonLink } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";

const inputClass =
  "h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal text-ink outline-none focus:border-school-500 focus:ring-2 focus:ring-school-100";

const textareaClass =
  "min-h-32 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm font-normal text-ink outline-none focus:border-school-500 focus:ring-2 focus:ring-school-100";

export function PublicationForm({
  action,
  publication,
  submitLabel
}: {
  action: (
    state: PublicationActionState,
    formData: FormData
  ) => Promise<PublicationActionState>;
  publication?: Publication;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, EMPTY_PUBLICATION_ACTION_STATE);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border border-line bg-surface p-5 shadow-soft">
      {state.message ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">{state.message}</p>
          {state.errors && state.errors.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {state.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5 text-sm font-semibold text-ink">
          <span>Tipo</span>
          <select
            name="tp_publicacao"
            required
            defaultValue={publication?.tp_publicacao ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Selecione
            </option>
            {PUBLICATION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5 text-sm font-semibold text-ink">
          <span>Status</span>
          <select
            name="st_publicacao"
            required
            defaultValue={publication?.st_publicacao ?? "rascunho"}
            className={inputClass}
          >
            {PUBLICATION_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5 text-sm font-semibold text-ink md:col-span-2">
          <span>Título</span>
          <input
            name="nm_titulo"
            required
            defaultValue={publication?.nm_titulo ?? ""}
            className={inputClass}
            maxLength={180}
          />
        </label>

        <label className="space-y-1.5 text-sm font-semibold text-ink md:col-span-2">
          <span>Descrição</span>
          <textarea
            name="ds_publicacao"
            required
            defaultValue={publication?.ds_publicacao ?? ""}
            className={textareaClass}
          />
        </label>

        <label className="space-y-1.5 text-sm font-semibold text-ink">
          <span>Disciplina</span>
          <input
            name="nm_disciplina"
            required
            defaultValue={publication?.nm_disciplina ?? ""}
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5 text-sm font-semibold text-ink">
          <span>Data de fim</span>
          <input
            type="datetime-local"
            name="dt_fim"
            defaultValue={toDateTimeLocalValue(publication?.dt_fim)}
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5 text-sm font-semibold text-ink">
          <span>Local opcional</span>
          <input
            name="nm_local"
            defaultValue={publication?.nm_local ?? ""}
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5 text-sm font-semibold text-ink">
          <span>Link opcional</span>
          <input
            type="url"
            name="ds_link_opcional"
            placeholder="https://..."
            defaultValue={publication?.ds_link_opcional ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <ButtonLink href="/admin/publicacoes" variant="secondary">
          Cancelar
        </ButtonLink>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
