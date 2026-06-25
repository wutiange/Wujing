export const STATIC_EXPORT_SKIP = "__SKIP__";

export function withStaticExportFallback<T extends Record<string, string>>(
  params: T[],
): T[] {
  if (params.length > 0) {
    return params;
  }

  const keys = Object.keys(params[0] ?? { slug: "", project: "", itemSlug: "" });
  const placeholder = Object.fromEntries(
    keys.map((key) => [key, STATIC_EXPORT_SKIP]),
  ) as T;

  return [placeholder];
}

export function isStaticExportSkip(...values: string[]): boolean {
  return values.some((value) => value === STATIC_EXPORT_SKIP);
}
