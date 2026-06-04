"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PUBLICATION_STATUSES } from "@/lib/constants";
import type { PublicationActionState } from "@/lib/action-state";
import { requireSignedInAdmin } from "@/lib/auth";
import type { PublicationStatus } from "@/lib/types";
import { validatePublicationForm } from "@/lib/validation";

async function requireAdminForWrite() {
  const context = await requireSignedInAdmin();

  if (!context.isAdmin || !context.user) {
    redirect("/admin/acesso-negado");
  }

  return {
    supabase: context.supabase,
    user: context.user
  };
}

function revalidatePublicationPages() {
  revalidatePath("/");
  revalidatePath("/publicacoes");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/publicacoes");
}

export async function createPublicationAction(
  _state: PublicationActionState,
  formData: FormData
): Promise<PublicationActionState> {
  const validation = validatePublicationForm(formData);

  if (!validation.ok) {
    return {
      message: "Revise os campos do formulário.",
      errors: validation.errors
    };
  }

  const { supabase, user } = await requireAdminForWrite();
  const { error } = await supabase.from("tb_th_publicacao").insert({
    ...validation.data,
    id_usuario_criacao: user.id
  });

  if (error) {
    return {
      message: "Não foi possível criar a publicação.",
      errors: [error.message]
    };
  }

  revalidatePublicationPages();
  redirect("/admin/publicacoes?sucesso=criada");
}

export async function updatePublicationAction(
  id: string,
  _state: PublicationActionState,
  formData: FormData
): Promise<PublicationActionState> {
  const validation = validatePublicationForm(formData);

  if (!validation.ok) {
    return {
      message: "Revise os campos do formulário.",
      errors: validation.errors
    };
  }

  const { supabase } = await requireAdminForWrite();
  const { error } = await supabase
    .from("tb_th_publicacao")
    .update(validation.data)
    .eq("id_publicacao", id);

  if (error) {
    return {
      message: "Não foi possível atualizar a publicação.",
      errors: [error.message]
    };
  }

  revalidatePublicationPages();
  revalidatePath(`/publicacoes/${id}`);
  redirect("/admin/publicacoes?sucesso=atualizada");
}

export async function deletePublicationAction(id: string) {
  const { supabase } = await requireAdminForWrite();
  const { error } = await supabase.from("tb_th_publicacao").delete().eq("id_publicacao", id);

  if (error) {
    redirect(`/admin/publicacoes?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePublicationPages();
  redirect("/admin/publicacoes?sucesso=excluida");
}

export async function changePublicationStatusAction(formData: FormData) {
  const id = String(formData.get("id_publicacao") ?? "");
  const status = String(formData.get("st_publicacao") ?? "") as PublicationStatus;
  const allowedStatuses = PUBLICATION_STATUSES.map((item) => item.value);

  if (!id || !allowedStatuses.includes(status)) {
    redirect("/admin/publicacoes?erro=Status%20inv%C3%A1lido");
  }

  const { supabase } = await requireAdminForWrite();
  const { error } = await supabase
    .from("tb_th_publicacao")
    .update({ st_publicacao: status })
    .eq("id_publicacao", id);

  if (error) {
    redirect(`/admin/publicacoes?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePublicationPages();
  revalidatePath(`/publicacoes/${id}`);
  redirect("/admin/publicacoes?sucesso=status");
}
