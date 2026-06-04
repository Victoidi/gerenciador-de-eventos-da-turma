import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { buttonClassName } from "@/components/ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/publicacoes", label: "Publicações" },
  { href: "/admin/publicacoes/nova", label: "Nova publicação" }
];

export function AdminShell({
  children,
  email
}: {
  children: ReactNode;
  email?: string | null;
}) {
  return (
    <div className="min-h-screen bg-parchment">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Link href="/admin/dashboard">
              <p className="text-sm font-semibold uppercase tracking-wide text-school-600">
                Painel SA
              </p>
              <h1 className="text-xl font-bold text-ink">Gerenciador de Eventos da Turma</h1>
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              {email ? <span className="text-sm text-muted">{email}</span> : null}
              <form action={signOut}>
                <button type="submit" className={buttonClassName({ variant: "secondary", size: "sm" })}>
                  Sair
                </button>
              </form>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-school-50 hover:text-school-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
