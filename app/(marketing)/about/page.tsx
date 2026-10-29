import Image from "next/image";
import { LinkButton } from "@/components/ui/link-button";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { pageMetadata } from "@/lib/metadata";
import { complianceLines, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description: `${site.name} is an estate agency in Blue Downs, Cape Town. Principal: ${site.principal}.`,
  path: "/about",
});

const background = [
  "PPRE / PPRA registered",
  "Advanced Diploma in Public Management",
  "10+ years administrative experience",
  "Sales experience in Blue Rise, Central Blue, and Bardale Village",
];

export default function AboutPage() {
  const facts = complianceLines();

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fafbfc_0%,#eef2f7_55%,#f7f1dc_100%)] px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="About us"
            title={site.name}
            description="An estate agency in Blue Downs, Cape Town."
          />
          <div className="animate-section-reveal mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              {site.name} works from {site.address}. {site.principal} is the
              principal.
            </p>
            <p>
              We help people buy and sell in Blue Downs, Eerste River, Kuils
              River, Mfuleni, Khayelitsha and the suburbs around them. If you
              want a valuation, or you are buying for the first time, phone or
              WhatsApp Wendy and she will tell you what the next step is.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div className="animate-section-reveal rounded-2xl bg-primary px-7 py-8 text-primary-foreground sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Vision
            </p>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl">
              A name people here can trust
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              To be known in Blue Downs and the eastern suburbs for straight
              answers, and for knowing the streets we sell in.
            </p>
          </div>
          <div className="animate-section-reveal rounded-2xl border border-border bg-card px-7 py-8 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Mission
            </p>
            <h2 className="mt-3 font-heading text-2xl text-primary sm:text-3xl">
              Clear help with buying and selling
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Tell you what a place is worth, list it properly, and walk buyers
              through the offer and transfer without the runaround.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="animate-section-reveal relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-muted lg:mx-0">
            <Image
              src="/brand/founder.jpg"
              alt={`${site.principal}, principal of ${site.name}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 420px"
            />
          </div>

          <div className="animate-section-reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Meet the principal
            </p>
            <h2 className="mt-3 font-heading text-3xl break-words text-primary sm:text-4xl">
              {site.principal}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Wendy runs {site.name} from Blue Downs. She has an Advanced
              Diploma in Public Management, more than 10 years of admin
              experience, and sales experience in Blue Rise, Central Blue and
              Bardale Village.
            </p>
            <ul className="mt-6 space-y-2.5">
              {background.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>

            <dl className="mt-8 space-y-2 border-t border-border pt-6 text-sm">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-0.5 sm:grid-cols-[8.5rem_1fr] sm:gap-2"
                >
                  <dt className="font-medium text-foreground">{fact.label}</dt>
                  <dd className="break-words text-muted-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <LinkButton
              href="/contact"
              variant="accent"
              className="cta-lift mt-8"
            >
              Get in touch
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
