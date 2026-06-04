import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminShell } from "@/components/admin-shell";
import { getAdminContext } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children
}: {
  children: ReactNode;
}) {
  const { user, profile, isAdmin } = await getAdminContext();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdmin) {
    return <AdminAccessDenied email={user.email} />;
  }

  return <AdminShell email={profile?.nm_email ?? user.email}>{children}</AdminShell>;
}
