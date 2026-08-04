import Image from "next/image";
import { Home, KeyRound, LineChart, Megaphone, Users } from "lucide-react";
import { CTABand } from "@/components/marketing/CTABand";
import { PropertyCard } from "@/components/marketing/PropertyCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { whatsappUrl } from "@/lib/format";
import { readListings } from "@/lib/listings-store";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const serviceIcons = [Home, LineChart, Users, Megaphone, KeyRound] as const;

export default async function HomePage() {
  const listings = await readListings();
  const featured = listings
    .filter((property) => property.featured)
    .slice(0, 3);

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="/brand/banner.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy/88 via-navy/72 to-navy/45"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/30"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 py-20 sm:px-8">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="animate-hero-fade-up font-heading text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              {site.name}
            </h1>
            <p className="animate-hero-fade-up-delay-1 mt-4 font-heading text-xl text-gold sm:text-2xl">
              {site.slogan}
            </p>
            <p className="animate-hero-fade-up-delay-2 mt-5 max-w-lg text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Trusted real estate guidance in Blue Downs and greater Cape Town —
              helping you buy, sell, and invest with confidence.
            </p>
            <div className="animate-hero-fade-up-delay-3 mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <LinkButton
                href="/contact"
                size="lg"
                variant="accent"
                className="cta-lift h-auto min-h-11 w-full justify-center px-5 py-3 sm:w-auto"
              >
                Enquire
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
                  "cta-lift h-auto min-h-11 w-full justify-center border-primary-foreground/35 bg-transparent px-5 py-3 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto",
                )}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#fafbfc_0%,#eef2f7_100%)] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="What we offer"
            title="Real estate services that put people first"
            description="From first-time buyers to seasoned investors, we provide professional, honest, and reliable support at every step."
          />

          <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {site.services.map((service, index) => {
              const Icon = serviceIcons[index] ?? Home;
              return (
                <li
                  key={service.title}
                  className="animate-section-reveal"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-primary/5 text-gold">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="font-heading text-xl text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="px-6 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Featured listings"
              title="Homes ready for viewing"
              description="A selection of properties for sale in Blue Downs and surrounding suburbs."
            />
            <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property, index) => (
                <li
                  key={property.id}
                  className="animate-section-reveal"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <PropertyCard property={property} />
                </li>
              ))}
            </ul>
            <div className="mt-10 flex justify-center">
              <LinkButton
                href="/properties"
                variant="outline"
                size="lg"
                className="cta-lift h-auto min-h-11 px-5 py-3"
              >
                View all properties
              </LinkButton>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[linear-gradient(180deg,#fafbfc_0%,#eef2f7_100%)] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Where we work"
            title="Serving Blue Downs and beyond"
            description="Local knowledge across Cape Town&apos;s southern and eastern suburbs — with personal service you can trust."
          />
          <ul className="animate-section-reveal mt-12 flex flex-wrap justify-center gap-x-3 gap-y-3">
            {site.areaServed.map((area) => (
              <li
                key={area}
                className="border-b border-gold/50 px-1 pb-0.5 text-sm font-medium text-primary sm:text-base"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABand />
    </>
  );
}
