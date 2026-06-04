import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/types";
import type { SupabaseCookieToSet } from "@/lib/supabase/cookie-types";
import { getSupabaseEnv } from "@/lib/supabase/env";

const ADMIN_FREE_ROUTES = ["/admin/login", "/admin/acesso-negado"];

export async function updateSession(request: NextRequest) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: SupabaseCookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as never);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedAdminRoute =
    pathname.startsWith("/admin") &&
    !ADMIN_FREE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!isProtectedAdminRoute) {
    return response;
  }

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("tb_th_usuario_perfil")
    .select("id_usuario")
    .eq("id_usuario", user.id)
    .eq("tp_perfil", "admin")
    .maybeSingle();

  if (!profile) {
    const deniedUrl = request.nextUrl.clone();
    deniedUrl.pathname = "/admin/acesso-negado";
    deniedUrl.search = "";
    return NextResponse.redirect(deniedUrl);
  }

  return response;
}
