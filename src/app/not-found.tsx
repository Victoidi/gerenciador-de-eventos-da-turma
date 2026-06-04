import { PublicHeader } from "@/components/public-header";
import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return (
    <main>
      <PublicHeader />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Página não encontrada"
          description="A publicação pode não existir, estar em rascunho, arquivada ou indisponível para consulta pública."
          actionHref="/publicacoes"
          actionLabel="Ver publicações"
        />
      </section>
    </main>
  );
}
