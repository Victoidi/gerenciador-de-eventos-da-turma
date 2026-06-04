import type { ReactNode } from "react";
import {
  getPublicationStatusLabel,
  getPublicationStatusTone,
  getPublicationTypeLabel,
  getPublicationTypeTone
} from "@/lib/constants";
import type { PublicationStatus, PublicationType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        className
      )}
    >
      {children}
    </span>
  );
}

export function TypeBadge({ type }: { type: PublicationType | string }) {
  return <Badge className={getPublicationTypeTone(type)}>{getPublicationTypeLabel(type)}</Badge>;
}

export function StatusBadge({ status }: { status: PublicationStatus | string }) {
  return (
    <Badge className={getPublicationStatusTone(status)}>
      <span className="mr-1.5 h-2 w-2 rounded-full bg-current" />
      {getPublicationStatusLabel(status)}
    </Badge>
  );
}
