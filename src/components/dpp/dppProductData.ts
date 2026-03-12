import type { ProductPassport } from "./dppTypes";

// ── Dynamic product history dates (relative to today) ──────────────
const today = new Date();
const toISO = (d: Date) => d.toISOString().slice(0, 10);

// Product Created: exactly 3 years ago
const createdDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
// Product Shipped: 1 week and 1 day after creation
const shippedDate = new Date(createdDate.getTime() + 8 * 86_400_000);
// Product Scanned: 2 years, 1 month, and 2 days ago
const scannedDate = new Date(today.getFullYear() - 2, today.getMonth() - 1, today.getDate() - 2);
// Floor Pads Ordered: same date as scanned
const orderedDate = new Date(scannedDate);

// Image paths — served from public/images/dpp/ via GitHub Pages base URL
const base = `${import.meta.env.BASE_URL}images/dpp/`;
const heroImage = `${base}chair-hero.jpg`;
const lifestyleImage = `${base}chair-detail.jpg`;
const dimensionsDiagram = `${base}chair-dimensions.jpg`;
const detailImage = `${base}chair-lifestyle.jpg`;
const materialSourceImage = `${base}chair-material-source.jpg`;
const seatCushionImage = `${base}chair-seat-component.jpg`;
const armrestImage = `${base}table-bar-component.png`;
const legImage = `${base}chair-legs-component.jpg`;

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
      "A modern dining chair with a gently angled backrest and clean sculptural lines. The solid walnut frame is hand-finished with a low VOC oil, while the seat and back are upholstered in full-grain vegetable-tanned leather over high-resilience foam. Designed for disassembly so every part can be repaired, replaced, or recycled.",
    photographs: {
      hero: heroImage,
      lifestyle: lifestyleImage,
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
      height: { value: 82, unit: "cm" },
      width: { value: 58, unit: "cm" },
      depth: { value: 60, unit: "cm" }
    },
    color: "Saddle brown leather / Oiled walnut",
    designer: "YOUR COMPANY",
    modelName: "Slope",
    displayName: "West Elm Slope Leather Chair"
  },

  production: {
    countryOfOrigin: "Denmark",
    countryOfOriginCode: "DK",
    facilityName: "Your Company",
    manufacturingLocation: "Horsens, Central Jutland, DK"
  },

  materialsAndComponents: {
    components: [
      { name: "Seat Cushion", replaceable: true, material: "Full-grain leather / HR foam", weight: { value: 2.4, unit: "kg" } },
      { name: "Back Cushion", replaceable: true, material: "Full-grain leather / HR foam", weight: { value: 1.6, unit: "kg" } },
      { name: "Seat Frame", replaceable: true, material: "Powder-coated steel", weight: { value: 1.8, unit: "kg" } },
      { name: "Backrest Frame", replaceable: true, material: "Powder-coated steel", weight: { value: 1.2, unit: "kg" } },
      { name: "Front Leg", replaceable: true, material: "Solid American Walnut", weight: { value: 0.6, unit: "kg" } },
      { name: "Rear Leg", replaceable: true, material: "Solid American Walnut", weight: { value: 0.7, unit: "kg" } },
      { name: "Armrest", replaceable: true, material: "Solid American Walnut", weight: { value: 0.5, unit: "kg" } },
      { name: "Cross Brace", replaceable: true, material: "Powder-coated steel", weight: { value: 0.4, unit: "kg" } },
      { name: "M6 x 20mm Hex Bolt", replaceable: true, material: "Stainless steel" },
      { name: "M6 x 15mm Threaded Insert", replaceable: true, material: "Stainless steel" },
      { name: "Felt Floor Pad", replaceable: true, material: "Recycled wool felt" }
    ],
    purchasableParts: [
      {
        id: "seat-cushion",
        name: "Seat Cushion",
        weight: "2.4 kg",
        weightValue: { value: 2.4, unit: "kg" },
        material: "Leather",
        price: "95 \u20AC",
        priceValue: { value: 95, currency: "EUR" },
        image: seatCushionImage
      },
      {
        id: "armrest",
        name: "Armrest",
        weight: "0.5 kg",
        weightValue: { value: 0.5, unit: "kg" },
        material: "Walnut",
        price: "42 \u20AC",
        priceValue: { value: 42, currency: "EUR" },
        image: armrestImage
      },
      {
        id: "leg",
        name: "Legs",
        weight: "0.7 kg",
        weightValue: { value: 0.7, unit: "kg" },
        material: "Walnut",
        price: "38 \u20AC",
        priceValue: { value: 38, currency: "EUR" },
        image: legImage
      }
    ],
    primaryMaterial: "Full-grain vegetable-tanned leather",
    materialComposition: [
      { material: "leather", label: "Leather", percentage: 35, chartColor: "#ADF5D1" },
      { material: "steel", label: "Steel", percentage: 30, chartColor: "#B6D4FC" },
      { material: "walnut", label: "Walnut", percentage: 25, chartColor: "#C4B5FD" },
      { material: "foam", label: "Foam", percentage: 8, chartColor: "#A9F1FA" },
      { material: "other", label: "Other", percentage: 2, chartColor: "#FDE68A" }
    ],
    finish: "Low VOC hand-applied natural walnut oil",
    adhesive: "Water-based adhesives",
    fasteners: "Mechanical fixings (hex bolts, threaded inserts)",
    totalWeight: { value: 11.8, unit: "kg" },
    materialDescriptions: [
      { material: "Leather", description: "Vegetable-tanned full-grain cowhide" },
      { material: "Steel", description: "Powder-coated recycled steel" },
      { material: "Walnut", description: "FSC American Walnut" },
      { material: "Foam", description: "CertiPUR-US certified HR foam" },
      { material: "Other", description: "Recycled wool felt pads & water-based adhesives" }
    ],
    packaging: {
      summary: "No plastic wrapping",
      domestic:
        "For domestic deliveries, the Slope Leather Chair is protected with recycled cardboard corners and wrapped in a reusable fabric sleeve.",
      international:
        "For international deliveries, the Slope Leather Chair is packed in a recycled cardboard carton with cornstarch cushioning inserts."
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
      "88% of the chair by weight is recyclable. Walnut and steel components enter standard recycling streams; leather can be repurposed or composted under industrial conditions.",
    substancesOfConcern:
      "No substances of very high concern (SVHC) above 0.1% w/w per REACH Article 33. No SCIP notification required.",
    vocData: "Low VOC natural walnut oil finish; CertiPUR-US certified foam",
    epdReference: "S-P-04781",
    lcaMethodology: "EN 15804+A2",
    toxicitySummary: "Low VOC walnut oil finish with chrome-free leather tanning",
    redListFreeStatement:
      "The West Elm Slope Leather Chair contains no harmful chemicals and meets strict health and safety standards for indoor environments."
  },

  lifecycleAndMaintenance: {
    expectedLifetime: "25+ years",
    expectedLifetimeValue: { value: 25, unit: "years" },
    warranty: "10-year warranty against defective materials and workmanship",
    warrantyDuration: { value: 10, unit: "years" },
    lifespanDetails: [
      {
        label: "Material",
        text: "Full-grain leather develops a rich patina with age, while solid walnut is naturally resistant to wear and structural fatigue."
      },
      {
        label: "Expected lifespan",
        text: "25+ years with regular care. Leather cushions can be re-dyed or replaced, and the walnut frame can be sanded and re-oiled to extend functional life."
      },
      {
        label: "Warranty & Support",
        text: "10-year warranty against defective materials and workmanship. Lifetime Repair Promise ensures replacement parts remain available."
      }
    ],
    maintenanceInstructions: [
      "Wipe leather surfaces with a soft, dry cloth. Condition every 6\u201312 months with a quality leather balm.",
      "Avoid prolonged direct sunlight to prevent uneven patina development.",
      "Periodically inspect and tighten bolts at the leg-to-frame joints.",
      "Re-oil walnut components annually to maintain finish and protect against moisture."
    ],
    refurbishAndRepair: [
      "The Slope Leather Chair is designed for easy disassembly using standard hex tools. Every joint uses mechanical fixings rather than glue.",
      "Leather cushions are secured with concealed zips, allowing simple swap-outs for re-upholstery or replacement.",
      "Supported by a Lifetime Repair Promise — replacement parts are stocked for the full production life of the chair."
    ],
    takeBackProgram:
      "The Slope Leather Chair is built for circular lifecycle management. When you no longer need it, return it through our Take Back Programme. Returned chairs are inspected, refurbished, and resold or donated, keeping materials in use and out of landfill.",
    endOfLife:
      "The chair disassembles into individual parts. Walnut components are recyclable or biodegradable; steel frames enter standard metal recycling; leather can be repurposed or industrially composted.",
    productHistory: [
      { title: "Product Created", date: toISO(createdDate), icon: "star" },
      { title: "Product Shipped", date: toISO(shippedDate), icon: "archive" },
      { title: "Product Scanned", date: toISO(scannedDate), icon: "qr" },
      { title: "Floor Pads Ordered", date: toISO(orderedDate), icon: "add-to-basket" }
    ],
    productAgeStatement: "Your product is 3 years old"
  },

  certificationsAndCompliance: {
    certifications: [
      {
        name: "FSC",
        issuingBody: "Forest Stewardship Council",
        description:
          "FSC-Certified Walnut \u2013 sourced from responsibly managed forests certified by the Forest Stewardship Council."
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
    fireSafety: "BS 5852 (Ignition Source 0) \u2014 meets flammability requirements for upholstered seating",
    indoorAirQuality: "Low VOC \u2014 compliant with AgBB/CDPH VOC emission standards",
    buildingRatingContributions: "Meets the criteria for leading Building Ratings including BREEAM, LEED and WELL",
    certificationsText: [
      "Meets the criteria for leading Building Ratings including BREEAM, LEED and WELL:",
      "FSC-Certified Walnut \u2013 sourced from responsibly managed forests certified by the Forest Stewardship Council.",
      "EPD (Environmental Product Declaration) \u2013 verified environmental impact data for transparency and lifecycle assessment.",
      "Red List Free / Declare Label \u2013 free from harmful chemicals and substances of concern, supporting healthy indoor environments."
    ]
  },

  dataCarrier: {
    type: "qr-code",
    material: "Laser-engraved stainless steel tag",
    locationOnProduct: "Underside of seat frame, near front-left leg bracket"
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
