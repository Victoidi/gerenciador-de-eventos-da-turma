import { PublicationForm } from "@/components/publication-form";
import { createPublicationAction } from "@/app/admin/publicacoes/actions";

export default function NovaPublicacaoPage() {
  return (
    <main className="max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-school-600">
          Nova publicação
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
          Criar prova, atividade, evento ou aviso
        </h1>
      </div>

      <PublicationForm action={createPublicationAction} submitLabel="Criar publicação" />
    </main>
  );
}
