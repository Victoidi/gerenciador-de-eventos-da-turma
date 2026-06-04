import type { PublicationStatus, PublicationType } from "@/lib/types";

export const PUBLICATION_TYPES: Array<{
  value: PublicationType;
  label: string;
  tone: string;
}> = [
  { value: "prova", label: "Prova", tone: "bg-rose-50 text-rose-700 ring-rose-200" },
  {
    value: "atividade",
    label: "Atividade",
    tone: "bg-amber-50 text-amber-700 ring-amber-200"
  },
  { value: "evento", label: "Evento", tone: "bg-blue-50 text-blue-700 ring-blue-200" },
  { value: "aviso", label: "Aviso", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" }
];

export const PUBLICATION_STATUSES: Array<{
  value: PublicationStatus;
  label: string;
  tone: string;
}> = [
  {
    value: "rascunho",
    label: "Rascunho",
    tone: "bg-slate-100 text-slate-700 ring-slate-200"
  },
  {
    value: "publicado",
    label: "Publicado",
    tone: "bg-green-50 text-green-700 ring-green-200"
  },
  {
    value: "arquivado",
    label: "Arquivado",
    tone: "bg-zinc-100 text-zinc-700 ring-zinc-200"
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
    "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

export function getPublicationStatusTone(value: string) {
  return (
    PUBLICATION_STATUSES.find((item) => item.value === value)?.tone ??
    "bg-slate-100 text-slate-700 ring-slate-200"
  );
}
