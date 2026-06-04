import { ButtonLink } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">{description}</p>
      {actionHref && actionLabel ? (
        <div className="mt-6">
          <ButtonLink href={actionHref} variant="secondary">
            {actionLabel}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
