import * as z from "zod";

export const logisticsSchema = z.object({
  incoterms: z.enum(["FOB", "CFR", "CIF"]),
  departure_city: z.string().min(1, "출발 도시를 선택하세요"),
  departure_port: z.string().min(1, "출발 항만을 선택하세요"),
  destination_port: z.string().min(1, "도착 항만을 선택하세요"),
  container_type: z.enum(["20ft", "40ft", "40hc", "LCL"]),
  cbm: z.coerce.number().min(0, "0 이상 입력").optional(),
  weight_kg: z.coerce.number().min(0, "0 이상 입력").optional(),
  cargo_value_usd: z.coerce.number().min(0, "0 이상 입력").optional(),
  margin_percent: z.coerce.number().min(0, "0 이상 입력").default(5),
}).superRefine((data, ctx) => {
  if (data.incoterms === "CIF" && (!data.cargo_value_usd || data.cargo_value_usd <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "CIF 조건은 화물가액(Cargo Value)이 필수입니다",
      path: ["cargo_value_usd"],
    });
  }
  if (data.container_type === "LCL") {
    const hasCbm = (data.cbm ?? 0) > 0;
    const hasWeight = (data.weight_kg ?? 0) > 0;
    if (!hasCbm && !hasWeight) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "LCL 화물은 CBM 또는 무게 중 하나 이상 입력해야 합니다",
        path: ["cbm"],
      });
    }
  }
});

export type LogisticsFormValues = z.infer<typeof logisticsSchema>;

export interface LogisticsInput {
  incoterms: "FOB" | "CFR" | "CIF"
  departure_city: string
  departure_port: string
  destination_port: string
  container_type: "20ft" | "40ft" | "40hc" | "LCL"
  cbm?: number
  weight_kg?: number
  cargo_value_usd?: number
  margin_percent: number
}

export interface CurrencyValue {
  raw: number;
  formatted: string;
}

export interface LogisticsResult {
  incoterms: string
  ocean_freight: { usd: CurrencyValue, krw: CurrencyValue, is_included: boolean }
  insurance: { usd: CurrencyValue, krw: CurrencyValue, is_included: boolean }
  port_charges: { items: Array<{ name: string, amount_usd: CurrencyValue }>, total_usd: CurrencyValue, total_krw: CurrencyValue }
  inland_transport: { krw: CurrencyValue }
  export_customs: { krw: CurrencyValue }
  subtotal_cost: { usd: CurrencyValue, krw: CurrencyValue }
  margin_amount: { usd: CurrencyValue, krw: CurrencyValue }
  final_quote: { usd: CurrencyValue, krw: CurrencyValue }
  exchange_rate: number
}
