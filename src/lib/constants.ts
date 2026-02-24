import { Country } from "../types/trade";

export const SUPPORTED_COUNTRIES: Country[] = [
  { name: "미국", code: "US", amazonDomain: "amazon.com" },
  { name: "일본", code: "JP", amazonDomain: "amazon.co.jp" },
  { name: "독일", code: "DE", amazonDomain: "amazon.de" },
  { name: "영국", code: "GB", amazonDomain: "amazon.co.uk" },
  { name: "프랑스", code: "FR", amazonDomain: "amazon.fr" },
  { name: "이탈리아", code: "IT", amazonDomain: "amazon.it" },
  { name: "스페인", code: "ES", amazonDomain: "amazon.es" },
  { name: "캐나다", code: "CA", amazonDomain: "amazon.ca" },
  { name: "멕시코", code: "MX", amazonDomain: "amazon.com.mx" },
  { name: "브라질", code: "BR", amazonDomain: "amazon.com.br" },
  { name: "인도", code: "IN", amazonDomain: "amazon.in" },
  { name: "호주", code: "AU", amazonDomain: "amazon.com.au" },
  { name: "싱가포르", code: "SG", amazonDomain: "amazon.sg" },
  { name: "아랍에미리트", code: "AE", amazonDomain: "amazon.ae" },
  { name: "사우디아라비아", code: "SA", amazonDomain: "amazon.sa" },
  { name: "네덜란드", code: "NL", amazonDomain: "amazon.nl" },
  { name: "스웨덴", code: "SE", amazonDomain: "amazon.se" },
  { name: "폴란드", code: "PL", amazonDomain: "amazon.pl" },
  { name: "튀르키예", code: "TR", amazonDomain: "amazon.com.tr" },
  { name: "중국", code: "CN" },
  { name: "베트남", code: "VN" },
  { name: "태국", code: "TH" },
  { name: "인도네시아", code: "ID" },
  { name: "말레이시아", code: "MY" },
  { name: "필리핀", code: "PH" },
  { name: "대만", code: "TW" },
  { name: "홍콩", code: "HK" },
  { name: "러시아", code: "RU" },
  { name: "카자흐스탄", code: "KZ" },
];

export const AMAZON_DOMAINS: Record<string, string> = Object.fromEntries(
  SUPPORTED_COUNTRIES.filter((c) => c.amazonDomain).map((c) => [c.code, c.amazonDomain!])
);

export const CATEGORY_HINTS: Record<string, string> = {
  화장품: "3304",
  스킨케어: "3304.99",
  메이크업: "3304.91",
  샴푸: "3305.10",
  비누: "3401.11",
  가공식품: "2106",
  라면: "1902.30",
  과자: "1905.90",
  의류: "6109",
  티셔츠: "6109.10",
  전자제품: "8517",
  반도체: "8542",
};

export const FTA_RATES = {
  "한-미 FTA": 0,
  "한-EU FTA": 0,
  RCEP: 0.05,
  CPTPP: 0.03,
  일반: 0.08,
} as const;

export const FREIGHT_RATES: Record<string, Record<string, Record<string, number>>> = {
  "부산항": {
    "LA": { "20ft": 1200, "40ft": 2400, "40hc": 2600 },
    "뉴욕": { "20ft": 2500, "40ft": 5000, "40hc": 5400 },
    "상하이": { "20ft": 300, "40ft": 600, "40hc": 650 },
    "도쿄": { "20ft": 500, "40ft": 1000, "40hc": 1100 },
    "함부르크": { "20ft": 1800, "40ft": 3500, "40hc": 3800 },
    "로테르담": { "20ft": 1700, "40ft": 3400, "40hc": 3700 },
    "싱가포르": { "20ft": 400, "40ft": 800, "40hc": 900 },
    "호치민": { "20ft": 350, "40ft": 700, "40hc": 800 }
  },
  "인천항": {
    "LA": { "20ft": 1300, "40ft": 2600, "40hc": 2800 },
    "칭다오": { "20ft": 200, "40ft": 400, "40hc": 450 },
    "상하이": { "20ft": 250, "40ft": 500, "40hc": 550 },
    "도쿄": { "20ft": 450, "40ft": 900, "40hc": 1000 },
    "호치민": { "20ft": 500, "40ft": 1000, "40hc": 1100 }
  },
  "광양항": {
    "상하이": { "20ft": 280, "40ft": 560, "40hc": 620 },
    "도쿄": { "20ft": 480, "40ft": 960, "40hc": 1050 },
    "싱가포르": { "20ft": 450, "40ft": 900, "40hc": 1000 }
  }
};

export const INLAND_TRANSPORT: Record<string, Record<string, number>> = {
  "구미": { "부산항": 300000, "인천항": 450000, "광양항": 350000 },
  "청주": { "부산항": 350000, "인천항": 400000, "광양항": 380000 },
  "화성": { "부산항": 450000, "인천항": 250000, "광양항": 480000 },
  "수도권": { "부산항": 450000, "인천항": 200000, "광양항": 500000 },
  "부산": { "부산항": 100000, "인천항": 500000, "광양항": 300000 },
  "대구": { "부산항": 200000, "인천항": 420000, "광양항": 320000 },
  "광주": { "부산항": 350000, "인천항": 480000, "광양항": 150000 },
  "울산": { "부산항": 150000, "인천항": 480000, "광양항": 350000 },
  "창원": { "부산항": 120000, "인천항": 500000, "광양항": 280000 }
};

export const LOGISTICS_PORT_CHARGES: Record<string, number> = {
  THC: 150, Wharfage: 50, DocFee: 30, Handling: 40, SealFee: 10, ContainerTax: 20
};

export const LCL_BASE_RATE = 80;
export const EXPORT_CUSTOMS_FEE = 30000;
export const DEFAULT_INSURANCE_RATE = 0.003;

export const PORT_CHARGES = {
  THC: 150000, // Terminal Handling Charge (KRW)
  WHF: 20000,  // Wharfage
  DOC: 45000,  // Documentation Fee
  CFS: 250000, // Container Freight Station Fee
} as const;
