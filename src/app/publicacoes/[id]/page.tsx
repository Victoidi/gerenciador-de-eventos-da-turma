import { notFound } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { PublicHeader } from "@/components/public-header";
import { PublicationCard } from "@/components/publication-card";
import { ButtonLink } from "@/components/ui/button";
import { getPublicPublicationById } from "@/lib/publications";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicacaoDetalhePage({ params }: PageProps) {
  const { id } = await params;
  const { data: publication, error } = await getPublicPublicationById(id);

  if (!publication && !error) {
    notFound();
  }

  return (
    <main>
      <PublicHeader />
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <ButtonLink href="/publicacoes" variant="ghost" size="sm">
          Voltar para publicações
        </ButtonLink>

        <div className="mt-5">
          {error || !publication ? (
            <EmptyState
              title="Erro ao carregar publicação"
              description="Esta publicação não pôde ser carregada ou não está disponível para consulta pública."
              actionHref="/publicacoes"
              actionLabel="Voltar"
            />
          ) : (
            <PublicationCard publication={publication} />
          )}
        </div>
      </section>
    </main>
  );
}
