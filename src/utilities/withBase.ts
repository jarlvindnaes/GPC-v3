/**
 * Prefix an internal app path with Astro's configured `base` (`/GPC-v3/`).
 *
 * Replaces the old HashRouter links (`#/dpp`) now that routing is file-based.
 * `import.meta.env.BASE_URL` is inlined at build time, so this works in both
 * statically-rendered components and hydrated islands.
 *
 * @example withBase("/dpp") // -> "/GPC-v3/dpp"
 * @example withBase("/")    // -> "/GPC-v3/"
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  if (path === "/") {
    return base;
  }
  const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${cleanPath}`;
}
