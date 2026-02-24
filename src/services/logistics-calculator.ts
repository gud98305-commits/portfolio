import { LogisticsInput, LogisticsResult, CurrencyValue } from "../types/logistics";
import {
  INLAND_TRANSPORT,
  LOGISTICS_PORT_CHARGES,
  FREIGHT_RATES,
  LCL_BASE_RATE,
  EXPORT_CUSTOMS_FEE,
  DEFAULT_INSURANCE_RATE
} from "../lib/constants";

const formatUSD = (val: number): CurrencyValue => {
  const raw = Math.round(val * 100) / 100;
  return {
    raw,
    formatted: `$${raw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  };
};

const formatKRW = (val: number): CurrencyValue => {
  const raw = Math.floor(val);
  return {
    raw,
    formatted: `₩${raw.toLocaleString()}`
  };
};

export function calculateLogistics(input: LogisticsInput, exchangeRate: number): LogisticsResult {
  const {
    incoterms,
    departure_city,
    departure_port,
    destination_port,
    container_type,
    cbm = 0,
    weight_kg = 0,
    cargo_value_usd = 0,
    margin_percent = 0
  } = input;

  const parsedRate = Number(exchangeRate);
  const safeExchangeRate = (parsedRate > 0) ? parsedRate : 1400;

  const safeCbm = Math.max(0, Number(cbm));
  const safeWeight = Math.max(0, Number(weight_kg));
  const safeCargoValue = Math.max(0, Number(cargo_value_usd));
  const safeMargin = Math.max(0, Number(margin_percent));

  // 1. 해상운임 (Ocean Freight)
  let ocean_freight_usd = 0;
  let rt = 0;

  if (container_type === "LCL") {
    if (!safeCbm && !safeWeight) {
      throw new Error("LCL 화물은 CBM 또는 무게를 입력해야 합니다");
    }
    rt = Math.max(safeCbm, safeWeight / 1000);
    ocean_freight_usd = rt * LCL_BASE_RATE;
  } else {
    const portRates = FREIGHT_RATES[departure_port];
    if (!portRates || !portRates[destination_port] || !portRates[destination_port][container_type]) {
      throw new Error("지원하지 않는 노선입니다");
    }
    ocean_freight_usd = portRates[destination_port][container_type];
  }

  // 2. 항만부대비용 (Port Charges)
  const port_charge_items = Object.entries(LOGISTICS_PORT_CHARGES).map(([name, rate]) => {
    const amount = container_type === "LCL" ? rate * Math.max(1, rt) : rate;
    return { name, amount_usd: formatUSD(amount) };
  });
  const total_port_charges_usd = port_charge_items.reduce((acc, item) => acc + item.amount_usd.raw, 0);

  // 3. 보험료 (Insurance)
  if (incoterms === "CIF" && (!safeCargoValue || safeCargoValue <= 0)) {
    throw new Error("CIF 조건은 화물가액(Cargo Value)이 필수입니다");
  }
  const insurance_usd = incoterms === "CIF" 
    ? (safeCargoValue + ocean_freight_usd) * DEFAULT_INSURANCE_RATE * 1.1 
    : 0;

  // 4. 내륙운송비 & 통관수수료 (KRW)
  const cityTransport = INLAND_TRANSPORT[departure_city];
  if (!cityTransport || cityTransport[departure_port] === undefined) {
    throw new Error("해당 도시와 항만 간의 내륙운송비 정보가 없습니다");
  }
  const inland_transport_krw = cityTransport[departure_port];
  const export_customs_krw = EXPORT_CUSTOMS_FEE;

  // 5. Incoterms 적용 여부
  const is_ocean_included = incoterms !== "FOB";
  const is_insurance_included = incoterms === "CIF";

  // 6. 총합 계산 (USD 기준)
  const included_ocean_usd = is_ocean_included ? ocean_freight_usd : 0;
  const included_insurance_usd = is_insurance_included ? insurance_usd : 0;
  
  const subtotal_usd = 
    included_ocean_usd + 
    included_insurance_usd + 
    total_port_charges_usd + 
    (inland_transport_krw / safeExchangeRate) + 
    (export_customs_krw / safeExchangeRate);

  const margin_amount_usd = subtotal_usd * (safeMargin / 100);
  const final_quote_usd = subtotal_usd + margin_amount_usd;

  return {
    incoterms,
    ocean_freight: {
      usd: formatUSD(ocean_freight_usd),
      krw: formatKRW(ocean_freight_usd * safeExchangeRate),
      is_included: is_ocean_included
    },
    insurance: {
      usd: formatUSD(insurance_usd),
      krw: formatKRW(insurance_usd * safeExchangeRate),
      is_included: is_insurance_included
    },
    port_charges: {
      items: port_charge_items,
      total_usd: formatUSD(total_port_charges_usd),
      total_krw: formatKRW(total_port_charges_usd * safeExchangeRate)
    },
    inland_transport: {
      krw: formatKRW(inland_transport_krw)
    },
    export_customs: {
      krw: formatKRW(export_customs_krw)
    },
    subtotal_cost: {
      usd: formatUSD(subtotal_usd),
      krw: formatKRW(subtotal_usd * safeExchangeRate)
    },
    margin_amount: {
      usd: formatUSD(margin_amount_usd),
      krw: formatKRW(margin_amount_usd * safeExchangeRate)
    },
    final_quote: {
      usd: formatUSD(final_quote_usd),
      krw: formatKRW(final_quote_usd * safeExchangeRate)
    },
    exchange_rate: safeExchangeRate
  };
}
