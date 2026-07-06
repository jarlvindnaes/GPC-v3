export interface Brand {
  name: string;
  slug: string; // matches the logo (logos/<slug>.svg) and photo (product-images/<slug>.jpg) filenames
  wide?: boolean; // very wide wordmarks get a trimmed height in the marquee
  photo?: boolean; // set false when there's no furniture photo yet — the logo shows on its own
}

// Furniture partners shown in the "Trusted with product data by" marquee (photo above logo).
export const brands: Brand[] = [
  { name: "Benchmark", slug: "benchmark" },
  { name: "Dansani", slug: "dansani" },
  { name: "Loungers", slug: "loungers" },
  { name: "Mater", slug: "mater" },
  { name: "Muuto", slug: "muuto" },
  { name: "New Works", slug: "new-works", wide: true },
  { name: "TAKT", slug: "takt" },
  { name: "Træfolk", slug: "traefolk" },
  { name: "&shufl", slug: "shufl", wide: true }
];
