import type { ProductPassport } from "./dppTypes";

// ── Dynamic product history dates (relative to today) ──────────────
const today = new Date();
const toIso = (d: Date) => d.toISOString().slice(0, 10);

// Product Created: exactly 3 years ago
const createdDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
// Product Shipped: 1 week and 1 day after creation
const shippedDate = new Date(createdDate.getTime() + 8 * 86_400_000);
// Product Scanned: 2 years, 1 month, and 2 days ago
const scannedDate = new Date(today.getFullYear() - 2, today.getMonth() - 1, today.getDate() - 2);
// Care Kit Ordered: same date as scanned
const orderedDate = new Date(scannedDate);

// Image paths — served from public/images/dpp/ via GitHub Pages base URL.
// Soft Lounge Chair photos (from the /passport folder, optimised): room setting (hero), studio shot from behind, close-up
// detail, and the dimensions drawing (flattened onto white). The oak-tree material-source image is shared.
const base = `${import.meta.env.BASE_URL}images/dpp/`;
const heroImage = `${base}soft-hero.jpg`;
const lifestyleImage = `${base}soft-lifestyle.jpg`;
const dimensionsDiagram = `${base}soft-dimensions.jpg`;
const detailImage = `${base}soft-detail.jpg`;
const materialSourceImage = `${base}chair-material-source.jpg`;

// Demo passport: Soft Lounge Chair by Thomas Bentzen. Figures are illustrative.
// (Export name kept so the passport views need no changes.)
export const slopeChair: ProductPassport = {
  granularityLevel: "model",

  identity: {
    protocolVersion: "1.0",
    productIdSystem: "product-connect",
    productIdValue: "7820194536",
    brandName: "TAKT",
    economicOperatorId: "CVR 39194104"
  },

  commerce: {
    description:
      "A light, generous lounge chair with soft curves in both back and seat. A shell of moulded oak veneer wraps the solid-oak frame like a cloth, and its double curves strengthen the whole construction. Every part stays visible, and the leather seat adds comfort and warmth. Designed for disassembly, so parts can be identified, repaired and replaced.",
    photographs: {
      hero: lifestyleImage, // living-room shot leads; the studio shot from behind sits further down
      lifestyle: heroImage,
      dimensionsDiagram: dimensionsDiagram,
      detail: detailImage,
      materialSource: materialSourceImage
    },
    productPageUrl: "https://taktcph.com/products/soft-lounge-chair/"
  },

  categorization: {
    category: "Furniture",
    subCategory: "Chair",
    dimensions: {
      height: { value: 72.7, unit: "cm" }, // product spec sheet: H 727, W 646, D 762 mm; seat height 381 mm
      width: { value: 64.6, unit: "cm" },
      depth: { value: 76.2, unit: "cm" }
    },
    color: "Oak, natural white-pigmented oil / leather seat",
    designer: "Thomas Bentzen",
    modelName: "Soft",
    displayName: "Soft Lounge Chair"
  },

  production: {
    countryOfOrigin: "Latvia",
    countryOfOriginCode: "LV",
    // Manufacturer named on the EU Ecolabel and FSC certificates; its FSC scope lists the Latvian
    // factories in Mālpils and Liepāja.
    facilityName: "Kvist Industries (SIA Kvist)",
    manufacturingLocation: "Latvia, EU"
  },

  materialsAndComponents: {
    components: [
      { name: "Leather Seat", replaceable: true, material: "Leather / HR foam", weight: { value: 1.4, unit: "kg" } },
      { name: "Back & Seat Shell", replaceable: true, material: "Moulded oak veneer", weight: { value: 2.1, unit: "kg" } },
      { name: "Front Leg", replaceable: true, material: "Solid oak", weight: { value: 0.6, unit: "kg" } },
      { name: "Rear Leg", replaceable: true, material: "Solid oak", weight: { value: 0.7, unit: "kg" } },
      { name: "Armrest", replaceable: true, material: "Solid oak", weight: { value: 0.5, unit: "kg" } },
      { name: "Seat Rail", replaceable: true, material: "Solid oak", weight: { value: 0.4, unit: "kg" } },
      { name: "Front & Back Rail", replaceable: true, material: "Solid oak", weight: { value: 0.4, unit: "kg" } },
      { name: "Armrest Cover", replaceable: true, material: "Moulded oak veneer", weight: { value: 0.2, unit: "kg" } },
      { name: "Connector Bolt", replaceable: true, material: "Steel" }
    ],
    // One part per piece type in the 3D model; modelPieces are node-name prefixes in soft-lounge-chair.glb
    // (pairs such as left/right armrests share one part). Weights and prices are illustrative.
    purchasableParts: [
      {
        id: "seat-cushion",
        name: "Leather Seat",
        weight: "1.4 kg",
        weightValue: { value: 1.4, unit: "kg" },
        material: "Leather",
        price: "95 \u20AC",
        priceValue: { value: 95, currency: "EUR" },
        modelPieces: ["Leather seat"]
      },
      {
        id: "back-shell",
        name: "Back Shell",
        weight: "1.2 kg",
        weightValue: { value: 1.2, unit: "kg" },
        material: "Moulded oak veneer",
        price: "120 \u20AC",
        priceValue: { value: 120, currency: "EUR" },
        modelPieces: ["Shell back"]
      },
      {
        id: "seat-shell",
        name: "Seat Shell",
        weight: "0.9 kg",
        weightValue: { value: 0.9, unit: "kg" },
        material: "Moulded oak veneer",
        price: "110 \u20AC",
        priceValue: { value: 110, currency: "EUR" },
        modelPieces: ["Shell seat"]
      },
      {
        id: "arm-cover",
        name: "Armrest Cover",
        weight: "0.2 kg",
        weightValue: { value: 0.2, unit: "kg" },
        material: "Moulded oak veneer",
        price: "36 \u20AC",
        priceValue: { value: 36, currency: "EUR" },
        modelPieces: ["Shell arm wrap"]
      },
      {
        id: "armrest",
        name: "Armrest",
        weight: "0.5 kg",
        weightValue: { value: 0.5, unit: "kg" },
        material: "Solid oak",
        price: "42 \u20AC",
        priceValue: { value: 42, currency: "EUR" },
        modelPieces: ["Armrest"]
      },
      {
        id: "front-leg",
        name: "Front Leg",
        weight: "0.6 kg",
        weightValue: { value: 0.6, unit: "kg" },
        material: "Solid oak",
        price: "38 \u20AC",
        priceValue: { value: 38, currency: "EUR" },
        modelPieces: ["Front leg"]
      },
      {
        id: "back-leg",
        name: "Rear Leg",
        weight: "0.7 kg",
        weightValue: { value: 0.7, unit: "kg" },
        material: "Solid oak",
        price: "44 \u20AC",
        priceValue: { value: 44, currency: "EUR" },
        modelPieces: ["Back leg"]
      },
      {
        id: "seat-rail",
        name: "Side Seat Rail",
        weight: "0.4 kg",
        weightValue: { value: 0.4, unit: "kg" },
        material: "Solid oak",
        price: "28 \u20AC",
        priceValue: { value: 28, currency: "EUR" },
        modelPieces: ["Side seat rail"]
      },
      {
        id: "front-rail",
        name: "Front Rail",
        weight: "0.4 kg",
        weightValue: { value: 0.4, unit: "kg" },
        material: "Solid oak",
        price: "28 \u20AC",
        priceValue: { value: 28, currency: "EUR" },
        modelPieces: ["Front rail"]
      },
      {
        id: "back-rail",
        name: "Back Rail",
        weight: "0.4 kg",
        weightValue: { value: 0.4, unit: "kg" },
        material: "Solid oak",
        price: "28 \u20AC",
        priceValue: { value: 28, currency: "EUR" },
        modelPieces: ["Back rail"]
      },
      {
        id: "bolt",
        name: "Connector Bolt",
        weight: "40 g",
        weightValue: { value: 0.04, unit: "kg" },
        material: "Steel",
        price: "6 \u20AC",
        priceValue: { value: 6, currency: "EUR" },
        modelPieces: ["Connector bolt"]
      }
    ],
    primaryMaterial: "Solid oak",
    materialComposition: [
      { material: "oak", label: "Solid oak", percentage: 52, chartColor: "#C4B5FD" },
      { material: "veneer", label: "Oak veneer", percentage: 27, chartColor: "#B6D4FC" },
      { material: "leather", label: "Leather", percentage: 13, chartColor: "#ADF5D1" },
      { material: "foam", label: "Foam", percentage: 5, chartColor: "#A9F1FA" },
      { material: "other", label: "Other", percentage: 3, chartColor: "#FDE68A" }
    ],
    finish: "Natural white-pigmented oil",
    fasteners: "Steel connector bolts",
    totalWeight: { value: 8, unit: "kg" },
    materialDescriptions: [
      { material: "Solid oak", description: "FSC™-certified solid oak frame; natural variation between light and dark grain" },
      { material: "Oak veneer", description: "Moulded oak veneer back and seat shell with double curves" },
      { material: "Leather", description: "Leather seat, also available on its own as an upgrade" },
      { material: "Foam", description: "Seat padding under the leather" },
      { material: "Other", description: "Steel connector bolts" }
    ],
    packaging: {
      summary: "Flat-packed in separate components",
      domestic:
        "The Soft Lounge Chair ships as separate components in flat boxes, which keeps the volume small and makes each part easy to identify.",
      international:
        "International orders ship the same way: separate components in flat boxes, assembled at home."
    }
  },

  sustainabilityAndImpact: {
    // Estimate built on TAKT's only fully published product footprint, the Cross Chair (same factory,
    // oak, steel bolts and flat-pack; PEF, third-party verified, 5 kg): materials 5.95, surface
    // treatment 3.01, production 0.45, production waste 1.98, packaging 2.20, transport 4.22, use 0.66,
    // disposal 3.61 = 22.08 kg CO2e. Scaled to this chair's ~6.6 kg of wood and bolts (x1.32); transport
    // and disposal by total weight (8 kg, x1.6); plus ~8 kg CO2e for the leather seat (~0.45 m2 of
    // finished bovine leather at typical published values, and foam). Carbon storage is TAKT's own
    // published figure for this chair.
    carbonFootprintTotal: { value: 39.4, unit: "kg CO\u2082e" },
    carbonFootprintScope: "cradle-to-grave",
    carbonStorage: { value: -1.82, unit: "kg CO\u2082e" },
    carbonFootprintNote:
      "Estimate, until TAKT publishes this chair's PEF footprint: based on TAKT's third-party verified Cross Chair (same factory, oak, bolts and flat-pack), scaled to this chair's weight, plus the leather seat. Carbon stored in the wood (published by TAKT): \u22121.82 kg CO\u2082e.",
    carbonFootprintByStage: [
      { stage: "materials", label: "Materials & surface treatment", value: 11.8, percentage: 30, chartColor: "#C4B5FD" },
      { stage: "upholstery", label: "Leather upholstery", value: 8, percentage: 20, chartColor: "#FDE68A" },
      { stage: "manufacturing", label: "Production", value: 3.2, percentage: 8, chartColor: "#B6D4FC" },
      { stage: "transport", label: "Packaging & transport", value: 9.7, percentage: 25, chartColor: "#A9F1FA" },
      { stage: "endOfLife", label: "Use & disposal", value: 6.7, percentage: 17, chartColor: "#ADF5D1" }
    ],
    recycledContentPercent: 30,
    recyclableContentPercent: 88,
    recyclabilityAssessment:
      "Designed for disassembly: the chair comes apart into its key materials (wood, leather and metal fixings), so each can be separated and recycled or upcycled.",
    vocData: "Natural white-pigmented oil finish",
    toxicitySummary: "Eco-certified with the EU Ecolabel",
    redListFreeStatement: ""
  },

  lifecycleAndMaintenance: {
    expectedLifetime: "Built to last for generations",
    warranty: "5-year warranty",
    warrantyDuration: { value: 5, unit: "years" },
    lifespanDetails: [
      {
        label: "Material",
        text: "The oiled oak develops a characterful patina over time, and surface damage can be repaired with light sanding and a new coat of oil, again and again."
      },
      {
        label: "Expected lifespan",
        text: "Built for everyday life. Designed for disassembly, so individual parts are easy to identify and replace when needed."
      },
      {
        label: "Warranty & Support",
        text: "5-year warranty. Spare parts are available through support, and the leather seat can be bought on its own."
      }
    ],
    maintenanceInstructions: [
      "Treat the oiled wood with a new layer of oil at least once a year to protect and strengthen the surface.",
      "Repair marks and scratches by sanding lightly and applying a new oil treatment.",
      "Wipe the leather seat with a soft, dry cloth.",
      "Periodically check and tighten the connector bolts."
    ],
    refurbishAndRepair: [
      "The Soft Lounge Chair is designed for disassembly, making individual parts easier to identify and replace when needed.",
      "The leather seat is a separate component: it can be added later as an upgrade or replaced on its own.",
      "Spare parts are available on request through support."
    ],
    takeBackProgram:
      "Keep the chair in use: worn or damaged parts can be replaced on their own, also in a different finish where available. If you no longer need it, pass it on to friends or family, or resell it to a new owner.",
    endOfLife:
      "When the chair can no longer be reused or repaired, it can be taken apart into its key materials, following the assembly instructions in reverse, so each material can be recycled or upcycled.",
    productHistory: [
      { title: "Product Created", date: toIso(createdDate), icon: "star" },
      { title: "Product Shipped", date: toIso(shippedDate), icon: "archive" },
      { title: "Product Scanned", date: toIso(scannedDate), icon: "qr" },
      { title: "Care Kit Ordered", date: toIso(orderedDate), icon: "add-to-basket" }
    ],
    productAgeStatement: "Your product is 3 years old"
  },

  certificationsAndCompliance: {
    certifications: [
      // From the product's certificate pack (t04-soft-lounge-chair-certificates.pdf on taktcph.com).
      {
        name: "FSC™",
        issuingBody: "Forest Stewardship Council · chain of custody certified by Preferred by Nature",
        certificationId: "FSC-C112576 (NC-COC-013022)",
        expiryDate: "2027-09-06",
        description: "Made from FSC™-certified wood from responsibly managed forests, with chain-of-custody certification covering the Latvian factories.",
        logo: `${base}certs/fsc.svg`
      },
      {
        name: "EU Ecolabel",
        issuingBody: "European Commission · awarded by Ecolabelling Denmark",
        certificationId: "DK/049/002",
        expiryDate: "2026-12-31",
        description: "Eco-certified with the EU Ecolabel, the EU's official label for environmental excellence, under the furniture criteria.",
        logo: `${base}certs/ecolabel.svg`
      },
      {
        name: "Durability tested, EN 16139 level L1",
        issuingBody: "Danish Technological Institute · report 884516-3 (2019)",
        description: "Passed the strength, durability and safety requirements for non-domestic seating at level L1 (offices, cafés, restaurants and public spaces), and the EN 1022 stability test."
      }
    ],
    certificationsText: [
      "FSC™-certified wood from responsibly managed forests.",
      "Eco-certified with the EU Ecolabel.",
      "Durability tested to EN 16139 level L1 for non-domestic use."
    ]
  },

  dataCarrier: {
    type: "qr-code",
    material: "Laser-engraved stainless steel tag",
    locationOnProduct: "Underside of the seat frame, near the front-left leg"
  },

  // From taktcph.com (contact, about and B Corp pages).
  company: {
    description:
      "TAKT is a Copenhagen furniture company rethinking how furniture is made and sold: well-designed pieces in natural, certified materials, shipped flat-packed in components and built to be repaired, so they can be handed on to the next generation. A certified B Corp since 2020.",
    contact: {
      companyName: "TAKT A/S",
      addressLines: ["Nygårdsvej 19", "2100 Copenhagen Ø", "Denmark"],
      phone: "", // TAKT publishes no phone number (chatbot and email instead)
      email: "info@taktcph.com",
      website: "taktcph.com",
      websiteUrl: "https://taktcph.com/products/soft-lounge-chair/"
    }
  }

};
