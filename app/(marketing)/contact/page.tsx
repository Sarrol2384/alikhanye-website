import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/marketing/ContactForm";
import { ContactMap } from "@/components/marketing/ContactMap";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { whatsappUrl } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name} in Blue Downs — call, email, WhatsApp, or send an enquiry. Reg. ${site.registration}.`,
  openGraph: {
    title: `Contact | ${site.name}`,
    description: `Reach ${site.name} at ${site.phoneDisplay} or ${site.email}.`,
    locale: "en_ZA",
  },
};

type ContactPageProps = {
  searchParams: Promise<{ property?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { property } = await searchParams;
  const propertyTitle = property?.trim();
  const defaultMessage = propertyTitle
    ? `Hi Alikhanye Properties, I'm interested in "${propertyTitle}". Please tell me more.`
    : "";

  const waHref = whatsappUrl(
    site.whatsapp,
    "Hi Alikhanye Properties, I'd like to enquire about your services.",
  );

  const details = [
    {
      icon: MapPin,
      label: "Address",
      value: site.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`,
      external: true,
    },
    {
      icon: Phone,
      label: "Phone",
      value: site.phoneDisplay,
      href: `tel:${site.phoneTel}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat on WhatsApp",
      href: waHref,
      external: true,
    },
  ] as const;

  return (
    <>
      <section className="bg-[linear-gradient(180deg,#fafbfc_0%,#eef2f7_100%)] px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            align="left"
            eyebrow="Contact"
            title="Let's start the conversation"
            description="Tell us what you need — buying, selling, valuations, or investment guidance. We'll respond promptly."
          />

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="animate-section-reveal space-y-6">
              <ul className="space-y-5">
                {details.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex gap-3">
                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/5 text-gold">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </p>
                        <a
                          href={item.href}
                          {...("external" in item && item.external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                          className="mt-1 inline-block text-base text-primary transition-colors hover:text-accent"
                        >
                          {item.value}
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-border pt-5 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">
                    Registration:
                  </span>{" "}
                  {site.registration}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-foreground">Principal:</span>{" "}
                  {site.principal}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-foreground">FFC:</span>{" "}
                  {site.ffc} · PPRE / PPRA registered
                </p>
              </div>
            </div>

            <div className="animate-section-reveal rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-heading text-2xl text-primary">
                Send an enquiry
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fields marked with * are required.
              </p>
              <div className="mt-6">
                <ContactForm
                  defaultMessage={defaultMessage}
                  defaultInterest={propertyTitle ? "buy" : ""}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <ContactMap address={site.address} />
        </div>
      </section>
    </>
  );
}
