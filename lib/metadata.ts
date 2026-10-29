import type { Metadata } from "next";
import { site } from "@/lib/site";

type PageMetadataInput = {
  title?: string;
  description: string;
  path: string;
  /**
   * "default" uses the site-wide 1200×630 share image.
   * "segment" leaves images unset so a colocated opengraph-image file is used.
   * Setting images here replaces the parent image, so listing pages must opt out.
   */
  shareImage?: "default" | "segment";
};

const defaultShareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — homes in Blue Downs and nearby suburbs`,
};

/** Canonical URL plus Open Graph for one public page. Paths are relative to metadataBase. */
export function pageMetadata({
  title,
  description,
  path,
  shareImage = "default",
}: PageMetadataInput): Metadata {
  const canonical = path === "" ? "/" : path;
  const socialTitle = title
    ? `${title} | ${site.name}`
    : `${site.name} — ${site.slogan}`;
  const images = shareImage === "default" ? [defaultShareImage] : undefined;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      locale: site.locale,
      type: "website",
      siteName: site.name,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      ...(images ? { images } : {}),
    },
  };
}
