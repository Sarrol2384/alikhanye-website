import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/format";
import { site } from "@/lib/site";

export function CTABand() {
  return (
    <section className="relative overflow-hidden bg-primary px-6 py-20 text-primary-foreground sm:px-8">
      <div
        className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-gold/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-sun/10"
        aria-hidden
      />

      <div className="animate-section-reveal relative mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-[1.75rem] leading-tight break-words sm:text-4xl">
          Ready to find your next home?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
          Speak to {site.name} today — we&apos;ll guide you with honesty,
          clarity, and local market knowledge.
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <LinkButton
            href="/contact"
            size="lg"
            variant="accent"
            className="cta-lift h-auto min-h-11 w-full whitespace-normal px-4 py-3 sm:w-auto"
          >
            Enquire now
          </LinkButton>
          <a
            href={whatsappUrl(
              site.whatsapp,
              "Hi Alikhanye Properties, I'd like to enquire about your services.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "cta-lift h-auto min-h-11 w-full justify-center whitespace-normal border-primary-foreground/30 bg-transparent px-4 py-3 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto",
            )}
          >
            <MessageCircle className="mr-2 h-4 w-4 shrink-0" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
