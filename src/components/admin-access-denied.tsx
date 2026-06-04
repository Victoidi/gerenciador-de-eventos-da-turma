import Link from "next/link";
import { ADMIN_DENIED_MESSAGE } from "@/lib/constants";
import { signOut } from "@/app/admin/actions";
import { buttonClassName } from "@/components/ui/button";

export function AdminAccessDenied({ email }: { email?: string | null }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-lg rounded-lg border border-line bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Acesso negado
        </p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Perfil administrativo necessário</h1>
        <p className="mt-3 text-sm leading-6 text-muted">{ADMIN_DENIED_MESSAGE}</p>
        {email ? (
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-muted">
            Usuário autenticado: <strong className="text-ink">{email}</strong>
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className={buttonClassName({ variant: "secondary" })}>
            Voltar ao site
          </Link>
          <form action={signOut}>
            <button type="submit" className={buttonClassName({ variant: "primary" })}>
              Sair
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
