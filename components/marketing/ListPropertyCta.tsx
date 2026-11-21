import { LinkButton } from "@/components/ui/link-button";

type ListPropertyCtaProps = {
  count: number;
};

export function ListPropertyCta({ count }: ListPropertyCtaProps) {
  const lead =
    count === 0
      ? "There are no homes listed at the moment."
      : count === 1
        ? "There is only one home listed at the moment."
        : "There are only a few homes listed at the moment.";

  return (
    <div className="rounded-xl border border-border bg-card px-6 py-10 text-center sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
        Selling
      </p>
      <h2 className="mt-3 font-heading text-2xl text-primary sm:text-3xl">
        List your property
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {lead} If you are selling in Blue Downs, Eerste River, Kuils River or
        nearby, ask for a free valuation.
      </p>
      <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <LinkButton
          href="/contact?interest=sell"
          variant="accent"
          className="cta-lift h-auto min-h-11 justify-center px-4 py-3"
        >
          List your property
        </LinkButton>
        <LinkButton
          href="/contact?interest=valuation"
          variant="outline"
          className="cta-lift h-auto min-h-11 justify-center px-4 py-3"
        >
          Free valuation
        </LinkButton>
      </div>
    </div>
  );
}
