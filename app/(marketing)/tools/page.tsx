import Link from "next/link";
import { Calculator } from "lucide-react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Tools",
  description: `Bond and affordability calculators from ${site.name} for buyers in South Africa.`,
  path: "/tools",
});

const tools = [
  {
    href: "/tools/bond-calculator",
    title: "Bond calculator",
    description:
      "Estimate monthly bond repayments and what you may afford based on your income.",
    icon: Calculator,
  },
] as const;

export default function ToolsPage() {
  return (
    <section className="px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Property tools"
          title="Helpful calculators"
          description="Work out a rough bond repayment, or what you might afford. These are estimates only — check with your bank before you offer."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary/5 text-gold">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h2 className="mt-4 font-heading text-xl text-primary group-hover:text-gold">
                    {tool.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                  <span className="mt-4 text-sm font-medium text-gold">
                    Open calculator →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
