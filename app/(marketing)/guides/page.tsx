import { LinkButton } from "@/components/ui/link-button";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Buying and selling",
  description:
    "Checklists for selling and buying a home in the Western Cape: compliance certificates, seller costs, and the documents buyers and sellers are usually asked for.",
  path: "/guides",
});

const sellingCertificates = [
  "Electrical certificate of compliance (COC)",
  "Plumbing certificate, as required in the Western Cape",
  "Electric fence certificate, if the property has an electric fence",
  "Gas certificate of compliance, if the property has a gas installation",
];

const sellingCosts = [
  "Bond cancellation, if the property is bonded",
  "Rates clearance",
  "Levies, if the property is sectional title or in a homeowners' association",
  "Agent commission",
  "Deceased estate costs, if the sale is from a deceased estate",
];

const sellingDocuments = [
  "Title deed",
  "Letter of authority, if applicable",
  "Marriage certificate or divorce decree, if applicable",
  "Latest municipal account",
  "ID",
  "FICA documents",
];

const buyingDocuments = [
  "ID",
  "Proof of address",
  "3 months' payslips",
  "3 months' bank statements",
  "FICA documents",
];

const selfEmployedDocuments = [
  "2 years' financial statements",
  "Tax returns (IRP5 or ITA34)",
  "6 months' business bank statements and 6 months' personal bank statements",
];

function Checklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm leading-relaxed text-foreground sm:text-base"
        >
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

function ChecklistBlock({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <div>
      <h3 className="font-heading text-xl text-primary">{title}</h3>
      <Checklist items={items} />
    </div>
  );
}

export default function GuidesPage() {
  return (
    <>
      <section className="bg-[linear-gradient(180deg,#fafbfc_0%,#eef2f7_100%)] px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Guides
          </p>
          <h1 className="mt-3 font-heading text-3xl leading-tight text-primary sm:text-4xl md:text-5xl">
            Buying and selling
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            If you are selling or buying around Blue Downs, these are the
            certificates, costs and documents people are usually asked for. It
            is a checklist, not a legal opinion.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10">
          <div>
            <h2 className="font-heading text-3xl text-primary sm:text-4xl">
              Selling
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Have these ready before the transfer starts. Your attorney will
              tell you which ones apply to your property.
            </p>
          </div>
          <ChecklistBlock
            title="Compliance certificates"
            items={sellingCertificates}
          />
          <ChecklistBlock
            title="Costs covered by the seller"
            items={sellingCosts}
          />
          <ChecklistBlock title="Documents needed" items={sellingDocuments} />
        </div>
      </section>

      <section className="bg-secondary/50 px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10">
          <div>
            <h2 className="font-heading text-3xl text-primary sm:text-4xl">
              Buying
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              The bank and the transferring attorney usually ask for the
              following. Gather them before you apply for a bond.
            </p>
          </div>
          <ChecklistBlock title="Documents needed" items={buyingDocuments} />
          <ChecklistBlock
            title="Extra documents for self-employed buyers"
            items={selfEmployedDocuments}
          />
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card px-6 py-8 sm:px-8">
          <h2 className="font-heading text-2xl text-primary">
            This can differ from one sale to the next
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            A bank, a municipality or a body corporate can ask for something
            that is not on these lists. A deceased estate, a trust or a
            sectional title sale is not the same as a straightforward house
            sale. Contact Wendy and she will tell you what applies to you.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/contact" variant="accent" className="cta-lift">
              Contact Wendy
            </LinkButton>
            <LinkButton href={`tel:${site.phoneTel}`} variant="outline">
              Call {site.phoneDisplay}
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
