import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tools",
  description: `Free property tools from ${site.name} — bond and affordability calculators for South African home buyers.`,
  openGraph: {
    title: `Tools | ${site.name}`,
    description: "Bond repayment and affordability calculators for home buyers.",
    locale: "en_ZA",
  },
};

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
          description="Quick estimates to guide your home-buying journey. Results are indicative only — speak to us for personalised advice."
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
