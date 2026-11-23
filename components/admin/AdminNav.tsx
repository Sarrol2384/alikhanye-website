"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Listings" },
  { href: "/admin/reviews", label: "Reviews" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin" || pathname.startsWith("/admin/listings");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "underline-offset-4 hover:text-gold hover:underline",
              active ? "text-gold" : "text-primary-foreground/80",
            )}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="text-primary-foreground/80 underline-offset-4 hover:text-gold hover:underline"
      >
        View website
      </Link>
    </nav>
  );
}
