import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAdminContext() {
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
    profile,
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
