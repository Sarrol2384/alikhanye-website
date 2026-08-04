import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f7f8fa_0%,#e8eef5_100%)]">
      <header className="border-b border-navy/10 bg-navy text-primary-foreground">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Agency admin
            </p>
            <p className="font-heading text-xl">{site.name}</p>
          </div>
          <Link
            href="/"
            className="text-sm text-primary-foreground/80 underline-offset-4 hover:text-gold hover:underline"
          >
            View website
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
