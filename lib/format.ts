/** A year and month, written "YYYY-MM". */
export type YearMonth = `${number}-${number}`;

// Fixed locale and time zone, so the server and every visitor's browser
// produce the same string.
const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatYearMonth(value: YearMonth): string {
  const [year, month] = value.split("-").map(Number);
  return monthYear.format(Date.UTC(year, month - 1, 1));
}

/**
 * A date range as "Aug 2022 – Apr 2026": abbreviated months, an en dash, and
 * "Present" for a range that is still open. The one formatter for every date
 * range on the site.
 */
export function formatRange(start: YearMonth, end: YearMonth | null): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "Present"}`;
}
