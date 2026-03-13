// ============================================================================
// Product Connect Data Schema
// Compatible with the Circular Product Data Protocol (CPDP) V1.0 classification
// Extended with classes 500-800 for sustainability, lifecycle, certifications,
// and data carrier information.
//
// Canonical type definitions for DPP data.
// ============================================================================

export type AccessLevel = "public" | "authorized" | "regulatory";
export type GranularityLevel = "model" | "batch" | "item";

export interface Measurement {
  value: number;
  unit: string;
}

export interface Price {
  value: number;
  currency: string;
}

export interface Dimensions {
  height: Measurement;
  width: Measurement;
  depth: Measurement;
}

export interface Identity {
  protocolVersion: string;
  productIdSystem: "did:web" | "gtin" | "product-connect";
  productIdValue: string;
  did?: string;
  gtin?: string;
  brandName: string;
  parentOrganization?: string;
  economicOperatorId?: string;
  eoriNumber?: string;
}

export interface Commerce {
  description: string;
  photographs: ProductPhotographs;
  yearOfSale?: number;
  seasonOfSale?: string;
  msrpCurrency?: string;
  msrpValue?: number;
  productPageUrl?: string;
}

export interface ProductPhotographs {
  hero: string;
  lifestyle?: string;
  dimensionsDiagram?: string;
  detail?: string;
  materialSource?: string;
}

export interface Categorization {
  category: string;
  subCategory: string;
  dimensions: Dimensions;
  color?: string;
  designer: string;
  modelName: string;
  displayName: string;
}

export interface Production {
  countryOfOrigin: string;
  countryOfOriginCode?: string;
  facilityName: string;
  facilityRegistryId?: string;
  facilityCoordinates?: { lat: number; lng: number };
  traceabilityProvider?: string;
  supplyChainTierVisibility?: number;
  manufacturingLocation: string;
}

export interface MaterialsAndComponents {
  components: Component[];
  purchasableParts: PurchasablePart[];
  primaryMaterial: string;
  materialComposition: MaterialComposition[];
  finish: string;
  adhesive?: string;
  fasteners?: string;
  surfaceTreatment?: string;
  totalWeight: Measurement;
  materialDescriptions: MaterialDescription[];
  packaging: PackagingInfo;
}

export interface Component {
  name: string;
  replaceable: boolean;
  material?: string;
  weight?: Measurement;
  partNumber?: string;
}

export interface CartItem {
  partId: string;
  quantity: number;
}

export interface PurchasablePart {
  id: string;
  name: string;
  weight: string;
  weightValue?: Measurement;
  material: string;
  price: string;
  priceValue?: Price;
  image: string;
}

export interface MaterialComposition {
  material: string;
  label: string;
  percentage: number;
  chartColor: string;
}

export interface MaterialDescription {
  material: string;
  description: string;
}

export interface PackagingInfo {
  summary: string;
  domestic: string;
  international: string;
}

export interface SustainabilityAndImpact {
  carbonFootprintTotal: Measurement;
  carbonFootprintScope?: "cradle-to-gate" | "cradle-to-grave";
  carbonFootprintByStage: CarbonStage[];
  recycledContentPercent?: number;
  recyclableContentPercent?: number;
  recyclabilityAssessment?: string;
  substancesOfConcern?: string;
  vocData: string;
  epdReference?: string;
  lcaMethodology?: string;
  en15804Modules?: Record<string, Measurement>;
  toxicitySummary: string;
  redListFreeStatement: string;
}

export interface CarbonStage {
  stage: string;
  label: string;
  value: number;
  percentage: number;
  chartColor: string;
}

export interface LifecycleAndMaintenance {
  expectedLifetime: string;
  expectedLifetimeValue?: Measurement;
  warranty: string;
  warrantyDuration?: Measurement;
  lifespanDetails: LifespanDetail[];
  maintenanceInstructions: string[];
  reparabilityScore?: number;
  refurbishAndRepair: string[];
  takeBackProgram: string;
  endOfLife: string;
  productHistory: ProductHistoryEvent[];
  productAgeStatement: string;
}

export interface LifespanDetail {
  label: string;
  text: string;
}

export interface ProductHistoryEvent {
  title: string;
  date: string;
  icon: "star" | "archive" | "qr" | "add-to-basket";
}

export interface CertificationsAndCompliance {
  certifications: Certification[];
  buildingRatingContributions?: string;
  regulatoryCompliance?: string;
  conformityDeclarations?: string;
  dopcReference?: string;
  fireSafety?: string;
  indoorAirQuality?: string;
  certificationsText: string[];
}

export interface Certification {
  name: string;
  issuingBody?: string;
  certificationId?: string;
  expiryDate?: string;
  verificationUrl?: string;
  description: string;
}

export interface DataCarrier {
  type: "qr-code" | "nfc" | "rfid";
  material?: string;
  locationOnProduct?: string;
  qrPayloadUrl?: string;
  dppEndpointUrl?: string;
}

export interface ContactInfo {
  companyName: string;
  addressLines: string[];
  phone: string;
  email: string;
  website: string;
  websiteUrl: string;
}

export interface CompanyInfo {
  description: string;
  contact: ContactInfo;
}

export interface ProductPassport {
  granularityLevel: GranularityLevel;
  identity: Identity;
  commerce: Commerce;
  categorization: Categorization;
  production: Production;
  materialsAndComponents: MaterialsAndComponents;
  sustainabilityAndImpact: SustainabilityAndImpact;
  lifecycleAndMaintenance: LifecycleAndMaintenance;
  certificationsAndCompliance: CertificationsAndCompliance;
  dataCarrier: DataCarrier;
  company: CompanyInfo;
}
