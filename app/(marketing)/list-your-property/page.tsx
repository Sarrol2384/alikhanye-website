import { Mail, MessageCircle, Phone } from "lucide-react";
import { ListPropertyForm } from "@/components/marketing/ListPropertyForm";
import { whatsappUrl } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "List your property",
  description: `Ask ${site.name} to list your home or give you a free valuation. Send your details and Wendy will contact you.`,
  path: "/list-your-property",
});

export default function ListYourPropertyPage() {
  const waHref = whatsappUrl(
    site.whatsapp,
    "Hi Alikhanye Properties, I'd like to list my property or ask for a valuation.",
  );

  return (
    <section className="bg-[linear-gradient(180deg,#fafbfc_0%,#eef2f7_100%)] px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
          Selling
        </p>
        <h1 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-primary sm:text-4xl md:text-5xl">
          List your property
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Selling in Blue Downs or nearby? Send a few details and Wendy will
          contact you about listing the property or doing a free valuation.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              You do not need a finished asking price. An estimate is enough
              for Wendy to phone you back.
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${site.phoneTel}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-accent"
                >
                  <Phone className="size-4 text-gold" aria-hidden />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-accent"
                >
                  <Mail className="size-4 text-gold" aria-hidden />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-accent"
                >
                  <MessageCircle className="size-4 text-gold" aria-hidden />
                  WhatsApp Wendy
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-2xl text-primary">
              Tell us about the property
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fields marked with * are required.
            </p>
            <div className="mt-6">
              <ListPropertyForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
