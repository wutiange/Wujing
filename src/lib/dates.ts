/** Accepts `YYYY-MM`, `YYYY/M`, `YYYY年M月`, or `present` / `至今`. */
export function formatYearMonth(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed === "present" || trimmed === "至今" || trimmed === "now") {
    return "至今";
  }

  const iso = trimmed.match(/^(\d{4})[-/](\d{1,2})$/);
  if (iso) {
    return `${iso[1]}年${Number(iso[2])}月`;
  }

  const zh = trimmed.match(/^(\d{4})\s*年\s*(\d{1,2})\s*月$/);
  if (zh) {
    return `${zh[1]}年${Number(zh[2])}月`;
  }

  return trimmed;
}

export function formatTenureRange(
  start?: string | null,
  end?: string | null,
): string | null {
  const startLabel = formatYearMonth(start);
  const endLabel = formatYearMonth(end);

  if (!startLabel && !endLabel) {
    return null;
  }

  if (startLabel && endLabel) {
    return `${startLabel}~${endLabel}`;
  }

  if (startLabel && !endLabel) {
    return `${startLabel}~至今`;
  }

  return endLabel;
}

function toMonthNumber(value?: string | null): number | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (
    trimmed === "present" ||
    trimmed === "至今" ||
    trimmed === "now"
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  const match =
    trimmed.match(/^(\d{4})[-/](\d{1,2})/) ||
    trimmed.match(/^(\d{4})\s*年\s*(\d{1,2})/);

  if (!match) {
    return null;
  }

  return Number(match[1]) * 100 + Number(match[2]);
}

/** Sort key: higher = more recent. Ongoing (`至今`) sorts first. */
export function tenureSortKey(end?: string | null, start?: string | null): number {
  return toMonthNumber(end) ?? toMonthNumber(start) ?? 0;
}
