import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/format";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        className="animate-wave-drift pointer-events-none absolute inset-x-0 top-0 h-16 opacity-30"
        aria-hidden
      >
        <svg
          viewBox="0 0 1440 64"
          className="h-full w-[120%] max-w-none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,0 L0,0 Z"
            fill="currentColor"
            className="text-gold/40"
          />
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white p-1.5">
            <Image
              src="/brand/logo.png"
              alt={site.name}
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </span>
          <p className="font-heading text-lg text-primary-foreground">
            {site.name}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
            {site.slogan}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            Explore
          </h3>
          <ul className="space-y-2.5 text-sm text-primary-foreground/80">
            <li>
              <Link href="/" className="hover:text-primary-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary-foreground">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/properties"
                className="hover:text-primary-foreground"
              >
                Properties
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            Contact
          </h3>
          <ul className="space-y-2.5 text-sm text-primary-foreground/80">
            <li>
              <a
                href={`tel:${site.phoneTel}`}
                className="hover:text-primary-foreground"
              >
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="hover:text-primary-foreground"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(
                  site.whatsapp,
                  "Hi Alikhanye Properties, I'd like to enquire about your services.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground"
              >
                WhatsApp
              </a>
            </li>
            <li>{site.address}</li>
            <li>Reg. {site.registration}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/50">
        © {year} {site.name}. All rights reserved. PPRE / PPRA registered.
      </div>
    </footer>
  );
}
