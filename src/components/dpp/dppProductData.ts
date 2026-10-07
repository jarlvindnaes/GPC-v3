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
// Floor Pads Ordered: same date as scanned
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
    brandName: "Your Company"
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
    productPageUrl: "#"
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
    facilityName: "Your Company",
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
      { name: "Connector Bolt", replaceable: true, material: "Stainless steel" },
      { name: "Felt Floor Pad", replaceable: true, material: "Recycled wool felt" }
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
        material: "Stainless steel",
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
    adhesive: "Water-based adhesives",
    fasteners: "Stainless connector bolts",
    totalWeight: { value: 8, unit: "kg" },
    materialDescriptions: [
      { material: "Solid oak", description: "FSC™-certified solid oak frame; natural variation between light and dark grain" },
      { material: "Oak veneer", description: "Moulded oak veneer back and seat shell with double curves" },
      { material: "Leather", description: "Leather seat, also available on its own as an upgrade" },
      { material: "Foam", description: "Seat padding under the leather" },
      { material: "Other", description: "Stainless fixings, felt floor pads and water-based adhesives" }
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
    carbonFootprintTotal: { value: 24, unit: "kg CO\u2082e" },
    carbonFootprintScope: "cradle-to-gate",
    carbonFootprintByStage: [
      {
        stage: "rawMaterialExtraction",
        label: "Raw material extraction",
        value: 10,
        percentage: 42,
        chartColor: "#ADF5D1"
      },
      { stage: "manufacturing", label: "Manufacturing", value: 9, percentage: 37, chartColor: "#B6D4FC" },
      { stage: "transport", label: "Transport", value: 5, percentage: 21, chartColor: "#A9F1FA" }
    ],
    recycledContentPercent: 30,
    recyclableContentPercent: 88,
    recyclabilityAssessment:
      "88% of the chair by weight is recyclable. Oak and plywood parts enter standard wood recycling streams and stainless fixings standard metal recycling; leather can be repurposed or composted under industrial conditions.",
    substancesOfConcern:
      "No substances of very high concern (SVHC) above 0.1% w/w per REACH Article 33. No SCIP notification required.",
    vocData: "Natural white-pigmented oil finish",
    toxicitySummary: "Eco-certified with the EU Ecolabel",
    redListFreeStatement: ""
  },

  lifecycleAndMaintenance: {
    expectedLifetime: "25+ years",
    expectedLifetimeValue: { value: 25, unit: "years" },
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
      "The Soft Lounge Chair is built for circular lifecycle management. When you no longer need it, return it through our Take Back Programme. Returned chairs are inspected, refurbished, and resold or donated, keeping materials in use and out of landfill.",
    endOfLife:
      "The chair disassembles into individual parts. Oak and plywood components are recyclable or biodegradable; stainless fixings enter standard metal recycling; leather can be repurposed or industrially composted.",
    productHistory: [
      { title: "Product Created", date: toIso(createdDate), icon: "star" },
      { title: "Product Shipped", date: toIso(shippedDate), icon: "archive" },
      { title: "Product Scanned", date: toIso(scannedDate), icon: "qr" },
      { title: "Floor Pads Ordered", date: toIso(orderedDate), icon: "add-to-basket" }
    ],
    productAgeStatement: "Your product is 3 years old"
  },

  certificationsAndCompliance: {
    certifications: [
      {
        name: "FSC™",
        issuingBody: "Forest Stewardship Council",
        description: "FSC™-certified wood from responsibly managed forests.",
        logo: `${base}certs/fsc.svg`
      },
      {
        name: "EU Ecolabel",
        issuingBody: "European Commission",
        description: "Eco-certified with the EU Ecolabel, the EU's official label for environmental excellence.",
        logo: `${base}certs/ecolabel.svg`
      }
    ],
    certificationsText: [
      "FSC™-certified wood from responsibly managed forests.",
      "Eco-certified with the EU Ecolabel."
    ]
  },

  dataCarrier: {
    type: "qr-code",
    material: "Laser-engraved stainless steel tag",
    locationOnProduct: "Underside of the seat frame, near the front-left leg"
  },

  company: {
    description:
      "Your Company designs furniture that lasts — combining Scandinavian craft traditions with modern circular-economy principles. Every piece is made to be repaired, refinished, and eventually returned, so materials stay in use for as long as possible.",
    contact: {
      companyName: "Your Company",
      addressLines: ["Industrivej 42", "8700 Horsens", "Central Jutland", "Denmark"],
      phone: "+45 70 20 30 40",
      email: "hello@yourcompany.com",
      website: "yourcompany.com",
      websiteUrl: "#"
    }
  }
};
