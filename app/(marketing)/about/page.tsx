import Image from "next/image";
import { LinkButton } from "@/components/ui/link-button";
import { ReviewsSection } from "@/components/marketing/ReviewsSection";
import { complianceLines, site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Alikhanye Properties is a Cape Town estate agency. We help people buy and sell in Blue Downs, Blue Rise, Central Blue, Bardale Village, Mfuleni, Scottsdene and surrounding areas.",
  path: "/about",
});

const services = [
  "Residential property sales",
  "Professional property marketing",
  "Free property valuations and market assessments",
  "Assistance to buyers and sellers",
  "Property listing and marketing advice",
];

const commitments = [
  "Integrity and honesty",
  "Professionalism and accountability",
  "Excellent client service",
  "Transparency and clear communication",
  "Building lasting relationships",
];

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-foreground sm:text-base">
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-gold"
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  const facts = complianceLines();

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fafbfc_0%,#eef2f7_55%,#f7f1dc_100%)] px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            About us
          </p>
          <h1 className="mt-3 font-heading text-3xl leading-tight text-primary sm:text-4xl md:text-5xl">
            Lighting the Way to Your Dream Home.
          </h1>
          <div className="animate-section-reveal mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              At Alikhanye Properties, we believe that finding or selling a home
              is more than just a property transaction. It is about people,
              families, new beginnings and creating opportunities.
            </p>
            <p>
              We are a Cape Town-based real estate agency committed to providing
              professional, reliable and personalised property services. Our
              goal is to make every property journey as smooth, transparent and
              rewarding as possible.
            </p>
            <p>
              We specialise in residential property sales, property marketing
              and assisting clients with their property needs. We proudly serve
              communities across Blue Downs, Blue Rise, Central Blue, Bardale
              Village, Mfuleni, Scottsdene and surrounding areas.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 sm:py-20">
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
            <h2 className="font-heading text-3xl text-primary sm:text-4xl">
              Meet our principal
            </h2>
            <p className="mt-4 font-heading text-2xl text-primary">
              Wendy Landiswa Madikazi
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">
              Founder &amp; Principal | Alikhanye Properties
            </p>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Wendy is a passionate property professional with a strong
                background in administration, public management and client
                service. With more than 10 years of administrative experience
                and a commitment to professionalism, she brings organisation,
                dedication and personal attention to every property transaction.
              </p>
              <p>
                Her vision is to build a trusted real estate brand that opens
                doors to homeownership and creates lasting relationships with
                clients and communities.
              </p>
              <p>
                Wendy believes that every client deserves respect, honest
                communication and professional guidance throughout their
                property journey.
              </p>
            </div>

            <dl className="mt-8 space-y-2 border-t border-border pt-6 text-sm">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-0.5 sm:grid-cols-[8.5rem_1fr] sm:gap-2"
                >
                  <dt className="font-medium text-foreground">{fact.label}</dt>
                  <dd className="break-words text-muted-foreground">
                    {fact.value}
                  </dd>
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

      <section className="bg-secondary/50 px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div className="animate-section-reveal">
            <h2 className="font-heading text-3xl text-primary sm:text-4xl">
              Our services
            </h2>
            <BulletList items={services} />
          </div>
          <div className="animate-section-reveal">
            <h2 className="font-heading text-3xl text-primary sm:text-4xl">
              Our commitment
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              At Alikhanye Properties, we are guided by:
            </p>
            <BulletList items={commitments} />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="animate-section-reveal rounded-2xl bg-primary px-7 py-8 text-primary-foreground sm:px-8">
            <h2 className="font-heading text-3xl sm:text-4xl">Our vision</h2>
            <p className="mt-4 text-base leading-relaxed text-primary-foreground/85">
              To become a trusted and recognised real estate brand in Cape Town
              and beyond, making property opportunities accessible to more
              families and individuals.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-[linear-gradient(180deg,#fafbfc_0%,#eef2f7_100%)] px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>Let us help you take the next step towards your property dreams.</p>
            <p className="font-heading text-2xl text-primary sm:text-3xl">
              Alikhanye Properties – Lighting the Way to Your Dream Home.
            </p>
            <p>Let&apos;s find your place in the world.</p>
          </div>
          <LinkButton
            href="/contact"
            variant="accent"
            className="cta-lift mt-8"
          >
            Get in touch
          </LinkButton>
        </div>
      </section>

      <ReviewsSection />
    </>
  );
}
