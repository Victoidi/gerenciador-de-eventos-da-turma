import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="group">
          <p className="text-sm font-semibold uppercase tracking-wide text-school-600">
            Turma
          </p>
          <h1 className="text-xl font-bold text-ink group-hover:text-school-700">
            Gerenciador de Eventos
          </h1>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          <ButtonLink href="/publicacoes" variant="ghost" size="sm">
            Publicações
          </ButtonLink>
          <ButtonLink href="/admin/login" variant="secondary" size="sm">
            Login SA
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
