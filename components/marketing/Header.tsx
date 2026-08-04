"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/properties", label: "Properties" },
  { href: "/contact", label: "Contact" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-navy/95 text-primary-foreground backdrop-blur supports-[backdrop-filter]:bg-navy/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2.5 sm:px-8 sm:py-3">
        <Link
          href="/"
          className="flex min-w-0 max-w-[72%] shrink items-center gap-2.5 sm:max-w-none sm:gap-3.5"
        >
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 sm:h-20 sm:w-20 sm:p-2 lg:h-24 lg:w-24 lg:p-2.5">
            <Image
              src="/brand/logo.png"
              alt=""
              width={112}
              height={112}
              priority
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-heading text-base leading-tight text-primary-foreground break-words sm:text-xl lg:text-2xl">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10",
                  active
                    ? "text-gold"
                    : "text-primary-foreground/80 hover:text-primary-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={`tel:${site.phoneTel}`}
            className="ml-1 inline-flex items-center gap-1.5 px-2 text-sm font-medium text-gold transition-colors hover:text-sun"
          >
            <Phone className="size-3.5" />
            <span className="hidden lg:inline">{site.phoneDisplay}</span>
          </a>
          <LinkButton
            href="/contact"
            size="sm"
            variant="accent"
            className="cta-lift ml-2"
          >
            Enquire
          </LinkButton>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "text-primary-foreground hover:bg-white/10 hover:text-primary-foreground md:hidden",
            )}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(18rem,100vw)] max-w-full">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium",
                      active
                        ? "bg-accent/15 text-primary"
                        : "text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href={`tel:${site.phoneTel}`}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground"
                onClick={() => setOpen(false)}
              >
                Call {site.phoneDisplay}
              </a>
              <LinkButton
                href="/contact"
                variant="accent"
                className="mt-4"
                onClick={() => setOpen(false)}
              >
                Enquire
              </LinkButton>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
