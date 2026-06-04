import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { LoginForm } from "@/app/admin/login/login-form";
import { getAdminContext } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const { user, isAdmin } = await getAdminContext();

  if (user && isAdmin) {
    redirect("/admin/dashboard");
  }

  if (user && !isAdmin) {
    return <AdminAccessDenied email={user.email} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft">
        <Link
          href="/"
          className="text-sm font-semibold text-school-700 underline-offset-4 hover:underline"
        >
          Voltar ao site
        </Link>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-school-600">
          Login administrativo
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Acesso da SA</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Entre com e-mail e senha cadastrados no Supabase Auth para gerenciar as publicações.
        </p>
        <Suspense fallback={<p className="mt-6 text-sm text-muted">Carregando login...</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
