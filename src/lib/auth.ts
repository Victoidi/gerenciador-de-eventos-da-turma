import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { AdminProfile } from "@/lib/types";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

type AdminContext = {
  supabase: ServerSupabaseClient;
  user: User | null;
  profile: AdminProfile | null;
  isAdmin: boolean;
};

export async function getAdminContext(): Promise<AdminContext> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      user: null,
      profile: null,
      isAdmin: false
    };
  }

  const { data: profile } = await supabase
    .from("tb_th_usuario_perfil")
    .select("*")
    .eq("id_usuario", user.id)
    .eq("tp_perfil", "admin")
    .maybeSingle();

  return {
    supabase,
    user,
    profile: profile as AdminProfile | null,
    isAdmin: Boolean(profile)
  };
}

export async function requireSignedInAdmin() {
  const context = await getAdminContext();

  if (!context.user) {
    redirect("/admin/login");
  }

  return context;
}
