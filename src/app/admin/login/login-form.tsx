"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError("E-mail ou senha inválidos. Confira os dados e tente novamente.");
      setLoading(false);
      return;
    }

    const next = searchParams.get("next");
    const redirectTo =
      next && next.startsWith("/admin") && next !== "/admin/login"
        ? next
        : "/admin/dashboard";

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block space-y-1.5 text-sm font-semibold text-ink">
        <span>E-mail</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal text-ink outline-none focus:border-school-500 focus:ring-2 focus:ring-school-100"
        />
      </label>

      <label className="block space-y-1.5 text-sm font-semibold text-ink">
        <span>Senha</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal text-ink outline-none focus:border-school-500 focus:ring-2 focus:ring-school-100"
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
