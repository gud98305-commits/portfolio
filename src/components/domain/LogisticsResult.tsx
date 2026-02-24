"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Ship, ShieldCheck, Truck, MapPin } from "lucide-react";
import { toast } from "sonner";
import { LogisticsResult as LogisticsResultType, LogisticsFormValues } from "@/types/logistics";

interface LogisticsResultProps {
  result: LogisticsResultType;
  formData: LogisticsFormValues;
  exchangeInfo: { rate: number; source: string } | null;
}

export function LogisticsResult({ result, formData, exchangeInfo }: LogisticsResultProps) {
  const copyToClipboard = async () => {
    try {
      const text = `LOGISTICS QUOTATION
Incoterms: ${result.incoterms}
Routing: ${formData.departure_port} → ${formData.destination_port}
Container: ${formData.container_type}
Ocean Freight: ${result.ocean_freight.usd.formatted}${result.ocean_freight.is_included ? "" : " (Buyer Pays)"}
Port Charges: ${result.port_charges.total_usd.formatted}
Inland Transport: ${result.inland_transport.krw.formatted}
Export Customs: ${result.export_customs.krw.formatted}
Insurance: ${result.incoterms === "CIF" ? result.insurance.usd.formatted : "N/A (Buyer Pays)"}
Subtotal: ${result.subtotal_cost.usd.formatted}
Margin (${formData.margin_percent}%): ${result.margin_amount.usd.formatted}
──────────────
TOTAL QUOTE: ${result.final_quote.usd.formatted} (${result.final_quote.krw.formatted})
* Subject to change based on actual sailing schedule and exchange rate.`;

      await navigator.clipboard.writeText(text);
      toast.success("견적 복사 완료");
    } catch (err) {
      toast.error("복사 실패");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-blue-200 bg-blue-50/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-blue-900">최종 견적 (Total Quote)</CardTitle>
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 font-bold px-3">{result.incoterms}</Badge>
              <span className="text-sm text-slate-500">Routing: {formData.departure_port} → {formData.destination_port}</span>
            </div>
          </div>
          <Button variant="outline" size="lg" className="border-blue-200 text-blue-700 hover:bg-blue-50 font-bold" onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" /> 견적 복사하기
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-6">
            <span className="text-5xl font-black text-blue-600 tracking-tight">{result.final_quote.usd.formatted}</span>
            <span className="text-2xl font-bold text-slate-400">({result.final_quote.krw.formatted})</span>
          </div>

          <div className="w-full overflow-x-auto">
            <Table className="border rounded-lg bg-white overflow-hidden">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[200px] font-bold whitespace-nowrap">항목 (Cost Item)</TableHead>
                  <TableHead className="text-right font-bold whitespace-nowrap">금액 (Amount)</TableHead>
                  <TableHead className="text-right font-bold whitespace-nowrap">비고 (Note)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap"><Ship className="h-4 w-4 text-slate-400" /> 해상운임 (Ocean Freight)</TableCell>
                  <TableCell className={`text-right whitespace-nowrap ${!result.ocean_freight.is_included ? "text-slate-300 line-through" : "font-bold"}`}>
                    {result.ocean_freight.usd.formatted}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {!result.ocean_freight.is_included && <Badge variant="secondary" className="font-normal">바이어 부담 (FOB)</Badge>}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap"><ShieldCheck className="h-4 w-4 text-slate-400" /> 적하보험료 (Insurance)</TableCell>
                  <TableCell className={`text-right whitespace-nowrap ${!result.insurance.is_included ? "text-slate-300 line-through" : "font-bold"}`}>
                    {result.insurance.usd.formatted}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {!result.insurance.is_included && <Badge variant="secondary" className="font-normal">바이어 부담</Badge>}
                  </TableCell>
                </TableRow>
                {result.port_charges.items.map((item, idx) => (
                  <TableRow key={idx} className="bg-slate-50/30">
                    <TableCell className="pl-8 text-slate-600 text-xs whitespace-nowrap">{item.name}</TableCell>
                    <TableCell className="text-right text-slate-600 text-xs whitespace-nowrap">{item.amount_usd.formatted}</TableCell>
                    <TableCell className="text-right text-xs text-slate-400 whitespace-nowrap">항만부대비용</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-slate-50/50">
                  <TableCell className="font-semibold text-blue-700 whitespace-nowrap">항만부대비용 소계</TableCell>
                  <TableCell className="text-right font-bold text-blue-700 whitespace-nowrap">{result.port_charges.total_usd.formatted}</TableCell>
                  <TableCell className="text-right text-xs whitespace-nowrap">Port Total</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap"><Truck className="h-4 w-4 text-slate-400" /> 내륙운송비 (Inland)</TableCell>
                  <TableCell className="text-right font-bold whitespace-nowrap">{result.inland_transport.krw.formatted}</TableCell>
                  <TableCell className="text-right text-xs text-slate-400 whitespace-nowrap">{formData.departure_city} → {formData.departure_port}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap"><MapPin className="h-4 w-4 text-slate-400" /> 수출통관수수료 (Customs)</TableCell>
                  <TableCell className="text-right font-bold whitespace-nowrap">{result.export_customs.krw.formatted}</TableCell>
                  <TableCell className="text-right text-xs text-slate-400 whitespace-nowrap">Fixed Fee</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 space-y-3">
            <Separator />
            <div className="flex justify-between items-center text-slate-600">
              <span>물류 원가 (Subtotal Cost)</span>
              <span className="font-medium">{result.subtotal_cost.usd.formatted} / {result.subtotal_cost.krw.formatted}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>안전 마진 (${formData.margin_percent}%)</span>
              <span className="font-medium">{result.margin_amount.usd.formatted}</span>
            </div>
            <Separator className="h-0.5 bg-blue-100" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-[#051161]">최종 합계 (TOTAL)</span>
              <div className="text-right">
                <div className="text-2xl font-black text-blue-700">{result.final_quote.usd.formatted}</div>
                <div className="text-sm font-bold text-slate-400">{result.final_quote.krw.formatted}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 px-1">
        <Badge variant="outline" className="text-[10px] text-slate-400 font-normal border-slate-200">
          적용 환율: 1 USD = {exchangeInfo?.rate?.toLocaleString() ?? "N/A"} KRW
        </Badge>
        <Badge variant="outline" className="text-[10px] text-slate-400 font-normal border-slate-200 capitalize">
          Data Source: {exchangeInfo?.source ?? "Unknown"}
        </Badge>
      </div>
    </div>
  );
}
