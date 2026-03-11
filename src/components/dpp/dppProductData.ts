import type { ProductPassport } from "./dppTypes";

// Image paths — served from public/images/dpp/ via GitHub Pages base URL
const base = `${import.meta.env.BASE_URL}images/dpp/`;
const heroImage = `${base}table-room-scene.png`;
const lifestyleImage = `${base}workshop-craftsmanship.png`;
const dimensionsDiagram = `${base}table-dimensions-diagram.png`;
const detailImage = `${base}table-corner-detail.png`;
const materialSourceImage = `${base}oak-tree-landscape.png`;
const tableTopImage = `${base}table-top-component.png`;
const barImage = `${base}table-bar-component.png`;
const legImage = `${base}table-leg-component.png`;

export const aivenTable: ProductPassport = {
  granularityLevel: "model",

  identity: {
    protocolVersion: "1.0",
    productIdSystem: "product-connect",
    productIdValue: "4710283965",
    brandName: "Benchmark Furniture"
  },

  commerce: {
    description:
      "An elegant and refined design, with a slim profile and soft, tactile curves to the legs and top. Made in the UK from solid timber with a low VOC oiled finish. A lift off magnetic panel provides access for cable routing down the leg. Designed for disassembly for efficient transit and circularity.",
    photographs: {
      hero: heroImage,
      lifestyle: lifestyleImage,
      dimensionsDiagram: dimensionsDiagram,
      detail: detailImage,
      materialSource: materialSourceImage
    },
    productPageUrl: "https://www.benchmarkfurniture.com/aiven"
  },

  categorization: {
    category: "Furniture",
    subCategory: "Table",
    dimensions: {
      height: { value: 74, unit: "cm" },
      width: { value: 228, unit: "cm" },
      depth: { value: 100, unit: "cm" }
    },
    color: "Natural whitened oak",
    designer: "BENCHMARK",
    modelName: "Aiven",
    displayName: "Aiven Table"
  },

  production: {
    countryOfOrigin: "United Kingdom",
    countryOfOriginCode: "GB",
    facilityName: "Benchmark",
    manufacturingLocation: "Kintbury, West Berkshire, UK"
  },

  materialsAndComponents: {
    components: [
      { name: "Leg Bracket", replaceable: true, material: "Steel" },
      { name: "4mm x 25mm Pozi Woodscrew", replaceable: true, material: "Steel" },
      { name: "Table Leg", replaceable: true, material: "Solid European Oak", weight: { value: 2.5, unit: "kg" } },
      { name: "Table Top", replaceable: true, material: "Solid European Oak", weight: { value: 62.0, unit: "kg" } },
      { name: "M6 x 20mm Threaded Inserts", replaceable: true, material: "Steel" },
      { name: "3mm x 3mm Neodymium Magnet", replaceable: true, material: "Neodymium alloy" },
      { name: "Leg Bracket - Power", replaceable: true, material: "Steel" },
      { name: "Leg Bracket Panel", replaceable: true, material: "Solid European Oak" },
      { name: "Leg Cover Panel", replaceable: true, material: "Solid European Oak" },
      { name: "Cable Retention Plate", replaceable: true, material: "Steel" },
      { name: "M6 x 25mm Flange Head Screw", replaceable: true, material: "Steel" },
      { name: "6mm x 100mm Torx Screw", replaceable: true, material: "Steel" },
      { name: "MS Straightening Bar", replaceable: true, material: "Steel" },
      { name: "Straightening Bar Timber Cover", replaceable: true, material: "Solid European Oak" },
      {
        name: "Table Leg - Power",
        replaceable: true,
        material: "Solid European Oak",
        weight: { value: 3.1, unit: "kg" }
      },
      { name: "M6 x 45mm Joint Connector", replaceable: true, material: "Steel" }
    ],
    purchasableParts: [
      {
        id: "table-top",
        name: "Table top",
        weight: "10.2 kg",
        weightValue: { value: 10.2, unit: "kg" },
        material: "Oak",
        price: "120 \u00A3",
        priceValue: { value: 120, currency: "GBP" },
        image: tableTopImage
      },
      {
        id: "bar",
        name: "Straightening Bar Timber Cover",
        weight: "0.8 kg",
        weightValue: { value: 0.8, unit: "kg" },
        material: "Oak",
        price: "56 \u00A3",
        priceValue: { value: 56, currency: "GBP" },
        image: barImage
      },
      {
        id: "leg",
        name: "Leg",
        weight: "2.5 kg",
        weightValue: { value: 2.5, unit: "kg" },
        material: "Oak",
        price: "84 \u00A3",
        priceValue: { value: 84, currency: "GBP" },
        image: legImage
      }
    ],
    primaryMaterial: "Solid European Oak",
    materialComposition: [
      { material: "oak", label: "Oak", percentage: 85, chartColor: "#ADF5D1" },
      { material: "steel", label: "Steel", percentage: 10, chartColor: "#B6D4FC" },
      { material: "other", label: "Other", percentage: 5, chartColor: "#A9F1FA" }
    ],
    finish: "Low VOC hand applied natural whitened oil",
    adhesive: "Water-based adhesives",
    fasteners: "Mechanical fixings (screws, inserts, joint connectors)",
    totalWeight: { value: 94.6, unit: "kg" },
    materialDescriptions: [
      { material: "Oak", description: "PEFC European Oak" },
      { material: "Steel", description: "" },
      { material: "Other", description: "Plant based oil & water based adhesives" }
    ],
    packaging: {
      summary: "No plastic wrapping",
      domestic:
        "For domestic deliveries, the Aiven Table is protected with cardboard edges, and blanket wrapped using paper based tapes.",
      international:
        "For international deliveries, the Aiven Table is protected with cardboard and cornstarch and packed in timber crates which are reused whenever possible."
    }
  },

  sustainabilityAndImpact: {
    carbonFootprintTotal: { value: 40, unit: "kg CO\u2082e" },
    carbonFootprintScope: "cradle-to-gate",
    carbonFootprintByStage: [
      {
        stage: "rawMaterialExtraction",
        label: "Raw material extraction",
        value: 18,
        percentage: 45,
        chartColor: "#ADF5D1"
      },
      { stage: "manufacturing", label: "Manufacturing", value: 14, percentage: 35, chartColor: "#B6D4FC" },
      { stage: "transport", label: "Transport", value: 8, percentage: 20, chartColor: "#A9F1FA" }
    ],
    recycledContentPercent: 0,
    recyclableContentPercent: 95,
    recyclabilityAssessment:
      "95% of the product by weight is recyclable. Solid oak components are recyclable or biodegradable; steel fixings are recyclable via metal recycling streams.",
    substancesOfConcern:
      "No substances of very high concern (SVHC) above 0.1% w/w per REACH Article 33. No SCIP notification required.",
    vocData: "Low VOC natural hard wax oil finish",
    epdReference: "S-P-02345",
    lcaMethodology: "EN 15804+A2",
    toxicitySummary: "Low VOC natural hard wax oil finish",
    redListFreeStatement:
      "The Aiven Table contains no harmful chemicals and meets strict health and safety standards for indoor environments."
  },

  lifecycleAndMaintenance: {
    expectedLifetime: "50+ years",
    expectedLifetimeValue: { value: 50, unit: "years" },
    warranty: "10-year warranty against defective materials and workmanship",
    warrantyDuration: { value: 10, unit: "years" },
    lifespanDetails: [
      {
        label: "Material",
        text: "Solid oak, a dense hardwood naturally resistant to wear, structural fatigue, and repeated refinishing."
      },
      {
        label: "Expected lifespan",
        text: "50+ years with basic care. The solid oak top and structural components can be maintained, refinished or replaced multiple times to extend functional life."
      },
      {
        label: "Warranty & Support",
        text: "10-year warranty against defective materials and workmanship. Lifetime Repair and Refurbishment Promise ensures long-term usability"
      }
    ],
    maintenanceInstructions: [
      "Clean with a soft, damp cloth and avoid harsh chemicals.",
      "Periodically inspect and tighten mechanical fixings.",
      "Reapply hard wax oil to maintain finish and protect surfaces.",
      "Solid wood furniture will expand, move and shrink with difference in humidity and temperature. Please be wary when positioning your furniture close to heat sources."
    ],
    refurbishAndRepair: [
      "The Aiven table is designed for easy disassembly and component replacement. Components are connected using mechanical fixings.",
      "Because the table is made from solid timber and oiled rather than lacquered, major parts can be sanded, refinished, or upgraded without compromising structural integrity.",
      "Supported by a Lifetime Repair and Refurbishment Promise."
    ],
    takeBackProgram:
      "The Aiven is designed to minimise environmental impact through circular lifecycle management. Our customers can return furniture when no longer wanted as part of our Take Back Scheme. Items are refurbished, repurposed, or donated, minimizing waste and extending useful life.",
    endOfLife:
      "The table can be disassembled into component parts. Solid oak components are recyclable or biodegradable; metal screws and components can be recycled.",
    productHistory: [
      { title: "Product Created", date: "2020-02-13", icon: "star" },
      { title: "Product Shipped", date: "2020-09-13", icon: "archive" },
      { title: "Product Scanned", date: "2021-02-13", icon: "qr" },
      { title: "Screws Ordered", date: "2024-02-13", icon: "add-to-basket" }
    ],
    productAgeStatement: "Your product is 5 years old"
  },

  certificationsAndCompliance: {
    certifications: [
      {
        name: "PEFC",
        issuingBody: "PEFC International",
        description:
          "70% PEFC-Certified Oak \u2013 sourced from responsibly managed forests certified by the Programme for the Endorsement of Forest Certification."
      },
      {
        name: "EPD",
        issuingBody: "EPD International",
        description:
          "EPD (Environmental Product Declaration) \u2013 verified environmental impact data for transparency and lifecycle assessment."
      },
      {
        name: "Red List Free / Declare Label",
        issuingBody: "International Living Future Institute",
        description:
          "Red List Free / Declare Label \u2013 free from harmful chemicals and substances of concern, supporting healthy indoor environments."
      }
    ],
    fireSafety: "BS 5852 (Ignition Source 0) \u2014 low risk, untreated solid timber",
    indoorAirQuality: "Low VOC \u2014 compliant with AgBB/CDPH VOC emission standards",
    buildingRatingContributions: "Meets the criteria for leading Building Ratings including BREEAM, LEED and WELL",
    certificationsText: [
      "Meets the criteria for leading Building Ratings including BREEAM, LEED and WELL:",
      "70% PEFC-Certified Oak \u2013 sourced from responsibly managed forests certified by the Programme for the Endorsement of Forest Certification.",
      "EPD (Environmental Product Declaration) \u2013 verified environmental impact data for transparency and lifecycle assessment.",
      "Red List Free / Declare Label \u2013 free from harmful chemicals and substances of concern, supporting healthy indoor environments."
    ]
  },

  dataCarrier: {
    type: "qr-code",
    material: "Laser-engraved aluminum plate",
    locationOnProduct: "Underside of table top, near leg bracket"
  },

  company: {
    description:
      "Benchmark Furniture is renowned for its craft, expertise in solid timber, and leadership in sustainable enterprise. Collaborating with many of the world's foremost architects and designers across commercial and residential projects, they create furniture and joinery that is made to last - delivering low-carbon, circular solutions with certified measurable impact.",
    contact: {
      companyName: "Benchmark",
      addressLines: ["Bath Road", "Kintbury", "Berkshire", "RG17 9SA"],
      phone: "+44 1488 568184",
      email: "info@benchmarkfurniture.com",
      website: "benchmarkfurniture.com",
      websiteUrl: "https://benchmarkfurniture.com/"
    }
  }
};
