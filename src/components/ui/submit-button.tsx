"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { buttonClassName } from "@/components/ui/button";

export function SubmitButton({
  children,
  pendingLabel = "Salvando...",
  variant = "primary",
  className
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonClassName({
        variant,
        className
      })}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
