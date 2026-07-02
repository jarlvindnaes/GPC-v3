export interface Brand {
  name: string;
  slug: string; // matches the logo (logos/<slug>.svg) and photo (product-images/<slug>.jpg) filenames
  wide?: boolean; // very wide wordmarks get a trimmed height in the marquee
}

// Furniture partners shown in the "Trusted with product data by" marquee (photo above logo).
export const brands: Brand[] = [
  { name: "Benchmark", slug: "benchmark" },
  { name: "Dansani", slug: "dansani" },
  { name: "Mater", slug: "mater" },
  { name: "Muuto", slug: "muuto" },
  { name: "New Works", slug: "new-works", wide: true },
  { name: "TAKT", slug: "takt" },
  { name: "Træfolk", slug: "traefolk" }
];
