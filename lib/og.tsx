import { ImageResponse } from "next/og";

// The link-preview image (Open Graph), shared by the home page and the
// playground pages: site address at the top, a title and one line under it
// at the bottom, on the site's white — the page itself, at card size.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Palette values from app/_palette.scss, inlined because the image is drawn
// outside the page's CSS.
const BACKGROUND = "#ffffff";
const HEADING = "#3d3d3d"; // $heading-light
const MUTED = "#6d6d6d"; // $muted-light
const FAINT = "#888888"; // $faint-light

const FAMILY = "Geist";
// The site's h1 is weight 550; the nearest static cut the image can load.
const WEIGHT = 500;
const TITLE_SIZE = 96;
// --tracking-display, as pixels at the title size.
const TITLE_TRACKING = TITLE_SIZE * -0.05;

/**
 * The site's typeface as raw font data, which the image renderer needs (it
 * can't use the page's web font). Fetched from Google Fonts when the image
 * is generated at build time. If that fails, the renderer's built-in font
 * is used instead of failing the build.
 */
async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${FAMILY}:wght@${WEIGHT}`,
      )
    ).text();
    const url = css.match(
      /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
    )?.[1];
    if (!url) return null;
    const font = await fetch(url);
    return font.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

interface OgImage {
  title: string;
  subtitle: string;
}

export async function renderOgImage({ title, subtitle }: OgImage) {
  const font = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: BACKGROUND,
          fontFamily: font ? FAMILY : undefined,
        }}
      >
        <div style={{ fontSize: 32, color: FAINT }}>petsoni.xyz</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: TITLE_SIZE,
              letterSpacing: TITLE_TRACKING,
              lineHeight: 1.1,
              color: HEADING,
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 24, fontSize: 40, color: MUTED }}>
            {subtitle}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: font
        ? [{ name: FAMILY, data: font, weight: WEIGHT, style: "normal" }]
        : undefined,
    },
  );
}
