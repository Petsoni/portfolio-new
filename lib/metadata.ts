import type { Metadata } from "next";

/** Where the site lives. Relative URLs in metadata resolve against this. */
export const siteUrl = "https://petsoni.xyz";
export const siteName = "Petar Marković";

interface PageMetadata {
  title: string;
  description: string;
  /** The page's path on the site, e.g. "/playground/slider". */
  path: string;
}

/**
 * Everything a page needs to be shared and indexed properly: title,
 * description, its canonical URL, and the Open Graph / Twitter tags a link
 * preview is built from. The preview image itself comes from the nearest
 * opengraph-image file.
 */
export function pageMetadata({
  title,
  description,
  path,
}: PageMetadata): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName, title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
}
