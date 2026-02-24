export interface HSCode {
  code: string;
  name: string;
  category: string;
}

export interface SWOTResult {
  S: string;
  W: string;
  O: string;
  T: string;
}

export interface RiskSignal {
  risk_color: "red" | "yellow" | "green";
  risk_level: string;
  risk_reason: string;
  tip: string;
  swot: SWOTResult;
}

export interface CompetitorProduct {
  title: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  link: string;
}

export interface PricingAnalysis {
  min: number;
  max: number;
  average: number;
  currency: string;
  products: CompetitorProduct[];
}

export interface BuyerInfo {
  companyName: string;
  country: string;
  email: string;
  industry: string;
  matchScore: number;
}

export interface Country {
  name: string;
  code: string;
  amazonDomain?: string;
}
