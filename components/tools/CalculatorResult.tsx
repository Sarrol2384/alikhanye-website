type CalculatorResultProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

export function CalculatorResult({
  label,
  value,
  highlight = false,
}: CalculatorResultProps) {
  return (
    <div
      className={
        highlight
          ? "rounded-lg border border-gold/40 bg-gold/5 px-4 py-3"
          : "rounded-lg border border-border bg-muted/30 px-4 py-3"
      }
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={
          highlight
            ? "mt-1 font-heading text-2xl text-primary"
            : "mt-1 text-lg font-semibold text-primary"
        }
      >
        {value}
      </p>
    </div>
  );
}
