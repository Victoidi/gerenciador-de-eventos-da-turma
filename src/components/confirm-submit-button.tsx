"use client";

import type { ReactNode } from "react";
import { buttonClassName } from "@/components/ui/button";

export function ConfirmSubmitButton({
  message,
  children,
  variant = "danger"
}: {
  message: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  return (
    <button
      type="submit"
      className={buttonClassName({ variant, size: "sm" })}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
