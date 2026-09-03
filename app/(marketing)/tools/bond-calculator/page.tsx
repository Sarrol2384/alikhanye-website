import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { AffordabilityCalculator } from "@/components/tools/AffordabilityCalculator";
import { BondRepaymentCalculator } from "@/components/tools/BondRepaymentCalculator";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { whatsappUrl } from "@/lib/format";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bond calculator",
  description: `Free bond repayment and affordability calculators from ${site.name} — estimate monthly repayments and what you may afford in South Africa.`,
  openGraph: {
    title: `Bond calculator | ${site.name}`,
    description:
      "Estimate bond repayments and affordability for South African home buyers.",
    locale: "en_ZA",
  },
};

export default function BondCalculatorPage() {
  const waHref = whatsappUrl(
    site.whatsapp,
    "Hi Alikhanye Properties, I'd like help understanding what I can afford for a home.",
  );

  return (
    <>
      <section className="px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Property tools"
            title="Bond calculator"
            description="Estimate monthly repayments and affordability. Adjust the interest rate and term to match your bank's offer."
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <BondRepaymentCalculator />
            <AffordabilityCalculator />
          </div>

          <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
            These calculators provide estimates only and do not constitute
            financial advice. Actual bond approval, rates, and instalments
            depend on your bank, credit profile, and property details.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-[linear-gradient(180deg,#fafbfc_0%,#eef2f7_100%)] px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl text-primary sm:text-3xl">
            Ready to take the next step?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {site.name} can guide you from affordability to offer and transfer.
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <LinkButton href="/contact" size="lg" variant="accent" className="cta-lift">
              Contact us
            </LinkButton>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "cta-lift justify-center",
              )}
            >
              <MessageCircle className="mr-2 size-4 shrink-0" />
              WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <Link href="/tools" className="font-medium text-gold hover:underline">
              ← All tools
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
