import type { PublicationStatus, PublicationType } from "@/lib/types";

export const PUBLICATION_TYPES: Array<{
  value: PublicationType;
  label: string;
  tone: string;
}> = [
  { value: "prova", label: "Prova", tone: "bg-wine-50 text-wine-700 ring-wine-200" },
  {
    value: "atividade",
    label: "Atividade",
    tone: "bg-parchment text-wine-700 ring-line"
  },
  { value: "evento", label: "Evento", tone: "bg-wine-100 text-wine-800 ring-wine-200" },
  { value: "aviso", label: "Aviso", tone: "bg-ink text-surface ring-ink" }
];

export const PUBLICATION_STATUSES: Array<{
  value: PublicationStatus;
  label: string;
  tone: string;
}> = [
  {
    value: "rascunho",
    label: "Rascunho",
    tone: "bg-parchment text-muted ring-line"
  },
  {
    value: "publicado",
    label: "Publicado",
    tone: "bg-wine-50 text-wine-700 ring-wine-200"
  },
  {
    value: "arquivado",
    label: "Arquivado",
    tone: "bg-ink/10 text-ink ring-ink/15"
  }
];

export const ADMIN_DENIED_MESSAGE =
  "Seu usuário está autenticado, mas não possui perfil administrativo para acessar esta área.";

export function getPublicationTypeLabel(value: string) {
  return PUBLICATION_TYPES.find((item) => item.value === value)?.label ?? value;
}

export function getPublicationStatusLabel(value: string) {
  return PUBLICATION_STATUSES.find((item) => item.value === value)?.label ?? value;
}

export function getPublicationTypeTone(value: string) {
  return (
    PUBLICATION_TYPES.find((item) => item.value === value)?.tone ??
    "bg-parchment text-muted ring-line"
  );
}

export function getPublicationStatusTone(value: string) {
  return (
    PUBLICATION_STATUSES.find((item) => item.value === value)?.tone ??
    "bg-parchment text-muted ring-line"
  );
}
