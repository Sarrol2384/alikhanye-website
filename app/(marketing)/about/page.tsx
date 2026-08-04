import type { Metadata } from "next";
import Image from "next/image";
import { LinkButton } from "@/components/ui/link-button";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${site.name} — a proudly South African real estate company based in Blue Downs, Cape Town. Led by ${site.principal}.`,
  openGraph: {
    title: `About | ${site.name}`,
    description: site.description,
    locale: "en_ZA",
  },
};

const qualifications = [
  "PPRE / PPRA registered",
  `FFC ${site.ffc}`,
  "Advanced Diploma in Public Management",
  "10+ years administrative experience",
  "Sales experience in Blue Rise, Central Blue, and Bardale Village",
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fafbfc_0%,#eef2f7_55%,#f7f1dc_100%)] px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="About us"
            title={site.name}
            description="Proudly South African. Rooted in Blue Downs. Lighting the way to your dream home."
          />
          <div className="animate-section-reveal mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              {site.name} is a proudly South African real estate company based
              in Blue Downs, Cape Town. We are committed to lighting the way to
              your dream home through professional, honest, and reliable
              service.
            </p>
            <p>
              Whether you are buying, selling, or investing, we provide
              personalised guidance tailored to your goals. Our focus is on
              building lasting relationships grounded in integrity,
              transparency, and exceptional service — backed by deep knowledge
              of the local Blue Downs market and surrounding communities.
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
              Trusted across the Western Cape
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              To become one of the most trusted and respected real estate
              agencies in the Western Cape — recognised for integrity, local
              expertise, and client-first service.
            </p>
          </div>
          <div className="animate-section-reveal rounded-2xl border border-border bg-card px-7 py-8 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Mission
            </p>
            <h2 className="mt-3 font-heading text-2xl text-primary sm:text-3xl">
              Ethical, client-focused solutions
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              To provide professional, ethical, and client-focused real estate
              solutions that help people buy, sell, and invest with clarity and
              confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="animate-section-reveal relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-muted lg:mx-0">
            <Image
              src="/brand/founder.png"
              alt={`${site.principal}, Principal of ${site.name}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 420px"
            />
          </div>

          <div className="animate-section-reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Meet the principal
            </p>
            <h2 className="mt-3 font-heading text-3xl text-primary sm:text-4xl">
              {site.principal}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Wendy brings professional discipline, community knowledge, and a
              people-first approach to every client relationship. She is
              committed to transparent communication and practical guidance that
              helps families and investors move forward with confidence.
            </p>
            <ul className="mt-6 space-y-2.5">
              {qualifications.map((item) => (
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
