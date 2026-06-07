import {
  PUBLICATION_STATUSES,
  PUBLICATION_TYPES
} from "@/lib/constants";
import type { PublicationInsert, PublicationStatus, PublicationType } from "@/lib/types";

type ValidationResult =
  | {
      ok: true;
      data: Omit<PublicationInsert, "id_usuario_criacao">;
    }
  | {
      ok: false;
      errors: string[];
    };

function requiredText(formData: FormData, field: string, label: string, errors: string[]) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) {
    errors.push(`${label} é obrigatório.`);
  }
  return value;
}

function optionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value ? value : null;
}

function parseDateTime(value: string, label: string, errors: string[]) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${label} possui uma data inválida.`);
    return "";
  }
  return date.toISOString();
}

export function validatePublicationForm(formData: FormData): ValidationResult {
  const errors: string[] = [];

  const tp_publicacao = requiredText(formData, "tp_publicacao", "Tipo", errors);
  const nm_titulo = requiredText(formData, "nm_titulo", "Título", errors);
  const ds_publicacao = requiredText(formData, "ds_publicacao", "Descrição", errors);
  const nm_disciplina = requiredText(formData, "nm_disciplina", "Disciplina", errors);
  const st_publicacao = requiredText(formData, "st_publicacao", "Status", errors);
  const dt_fim_raw = optionalText(formData, "dt_fim");
  const nm_local = optionalText(formData, "nm_local");
  const ds_link_opcional = optionalText(formData, "ds_link_opcional");

  const allowedTypes = PUBLICATION_TYPES.map((item) => item.value);
  const allowedStatuses = PUBLICATION_STATUSES.map((item) => item.value);

  if (tp_publicacao && !allowedTypes.includes(tp_publicacao as PublicationType)) {
    errors.push("Tipo informado não é permitido.");
  }

  if (st_publicacao && !allowedStatuses.includes(st_publicacao as PublicationStatus)) {
    errors.push("Status informado não é permitido.");
  }

  const dt_fim = dt_fim_raw ? parseDateTime(dt_fim_raw, "Data de fim", errors) : null;

  if (ds_link_opcional) {
    try {
      const url = new URL(ds_link_opcional);
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.push("Link opcional deve começar com http:// ou https://.");
      }
    } catch {
      errors.push("Link opcional deve ser uma URL válida.");
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      tp_publicacao: tp_publicacao as PublicationType,
      nm_titulo,
      ds_publicacao,
      nm_disciplina,
      dt_fim,
      nm_local,
      ds_link_opcional,
      st_publicacao: st_publicacao as PublicationStatus
    }
  };
}
