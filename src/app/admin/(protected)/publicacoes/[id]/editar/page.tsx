import { EmptyState } from "@/components/empty-state";
import { PublicationForm } from "@/components/publication-form";
import { getPublicationForEdit } from "@/lib/publications";
import { updatePublicationAction } from "@/app/admin/publicacoes/actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarPublicacaoPage({ params }: PageProps) {
  const { id } = await params;
  const { data: publication, error } = await getPublicationForEdit(id);

  if (error || !publication) {
    return (
      <main className="max-w-4xl">
        <EmptyState
          title="Publicação não encontrada"
          description="Não foi possível carregar esta publicação para edição."
          actionHref="/admin/publicacoes"
          actionLabel="Voltar para publicações"
        />
      </main>
    );
  }

  const updateAction = updatePublicationAction.bind(null, publication.id_publicacao);

  return (
    <main className="max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-school-600">
          Editar publicação
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
          {publication.nm_titulo}
        </h1>
      </div>

      <PublicationForm
        action={updateAction}
        publication={publication}
        submitLabel="Salvar alterações"
      />
    </main>
  );
}
