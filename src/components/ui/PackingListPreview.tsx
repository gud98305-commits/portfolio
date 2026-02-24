"use client";

import React from "react";
import { PackingList } from "@/types/documents";
import { Button } from "./button";
import { Printer, FileText } from "lucide-react";
import { Card } from "./card";

interface PackingListPreviewProps {
  data: PackingList;
}

export function PackingListPreview({ data }: PackingListPreviewProps) {
  if (!data || !data.items) {
    return <div className="p-4 text-center text-gray-500">데이터 로딩 중...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Packing List 미리보기</h2>
        </div>
        <Button onClick={handlePrint} variant="default" className="flex items-center gap-2 shadow-sm">
          <Printer className="h-4 w-4" />
          PDF 다운로드 (인쇄)
        </Button>
      </div>

      <div className="print-container">
        <Card className="p-[20mm] bg-white text-black shadow-xl border-gray-200 print:shadow-none print:border-none print:p-0 max-w-[210mm] mx-auto overflow-visible font-serif">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold uppercase tracking-[0.2em] border-b-4 border-black pb-2 inline-block">
              Packing List
            </h1>
          </div>

          {/* Top Info Section */}
          <div className="grid grid-cols-2 gap-0 border-t border-l border-r border-black mb-0">
            {/* Shipper */}
            <div className="border-r border-b border-black p-3 min-h-[160px]">
              <h3 className="text-[10px] font-bold uppercase mb-1 text-gray-600">Shipper / Exporter</h3>
              <div className="text-sm space-y-0.5">
                <p className="font-bold text-base uppercase">{data.shipper.company_name}</p>
                <p className="whitespace-pre-line leading-tight">{data.shipper.address}</p>
                <p>Tel: {data.shipper.tel}</p>
                <p>Email: {data.shipper.email}</p>
                {data.shipper.tax_id && <p className="font-semibold mt-1">TAX ID: {data.shipper.tax_id}</p>}
              </div>
            </div>

            {/* PL Meta */}
            <div className="border-b border-black">
              <div className="flex border-b border-black h-1/2">
                <div className="w-1/2 border-r border-black p-2 bg-gray-50/50">
                  <span className="block text-[10px] font-bold uppercase text-gray-600">P/L No.</span>
                  <span className="text-base font-bold">{data.packing_list_no}</span>
                </div>
                <div className="w-1/2 p-2 bg-gray-50/50">
                  <span className="block text-[10px] font-bold uppercase text-gray-600">Date</span>
                  <span className="text-base font-bold">{data.date}</span>
                </div>
              </div>
              <div className="p-3 h-1/2">
                <h3 className="text-[10px] font-bold uppercase mb-1 text-gray-600">Invoice Ref.</h3>
                <p className="text-base font-bold">{data.invoice_ref}</p>
              </div>
            </div>

            {/* Consignee */}
            <div className="border-r border-b border-black p-3 min-h-[160px]">
              <h3 className="text-[10px] font-bold uppercase mb-1 text-gray-600">Consignee</h3>
              <div className="text-sm space-y-0.5">
                <p className="font-bold text-base uppercase">{data.consignee.company_name}</p>
                <p className="whitespace-pre-line leading-tight">{data.consignee.address}</p>
                <p>Tel: {data.consignee.tel}</p>
                <p>Email: {data.consignee.email}</p>
                {data.consignee.tax_id && <p className="font-semibold mt-1">TAX ID: {data.consignee.tax_id}</p>}
              </div>
            </div>

            {/* Shipment Details Placeholder - Simple row for PL consistency */}
            <div className="border-b border-black p-3">
              <h3 className="text-[10px] font-bold uppercase mb-1 text-gray-600">Shipment Details</h3>
              <div className="text-xs space-y-1">
                <p><span className="font-bold uppercase text-[9px] w-20 inline-block">Vessel/Voyage:</span> {data.shipment_details.vessel_or_vehicle}</p>
                <p><span className="font-bold uppercase text-[9px] w-20 inline-block">Port of Loading:</span> {data.shipment_details.port_of_loading}</p>
                <p><span className="font-bold uppercase text-[9px] w-20 inline-block">Port of Disch.:</span> {data.shipment_details.port_of_discharge}</p>
                <p><span className="font-bold uppercase text-[9px] w-20 inline-block">ETD:</span> {data.shipment_details.etd}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-0 border-l border-r border-b border-black">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-black">
                  <th className="border-r border-black p-1 text-[9px] font-bold uppercase w-8">No</th>
                  <th className="border-r border-black p-1 text-[9px] font-bold uppercase">Description</th>
                  <th className="border-r border-black p-1 text-[9px] font-bold uppercase w-12">Qty</th>
                  <th className="border-r border-black p-1 text-[9px] font-bold uppercase w-12">Unit</th>
                  <th className="border-r border-black p-1 text-[9px] font-bold uppercase w-16">Net Wt(kg)</th>
                  <th className="border-r border-black p-1 text-[9px] font-bold uppercase w-16">Gross Wt(kg)</th>
                  <th className="border-r border-black p-1 text-[9px] font-bold uppercase w-14">CBM</th>
                  <th className="p-1 text-[9px] font-bold uppercase w-20">Carton No</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-b border-black/10">
                    <td className="border-r border-black p-2 text-center">{item.line_no}</td>
                    <td className="border-r border-black p-2 font-bold uppercase">{item.description}</td>
                    <td className="border-r border-black p-2 text-center font-bold">{item.quantity}</td>
                    <td className="border-r border-black p-2 text-center uppercase">{item.unit}</td>
                    <td className="border-r border-black p-2 text-right">{item.net_weight_kg}</td>
                    <td className="border-r border-black p-2 text-right font-bold">{item.gross_weight_kg}</td>
                    <td className="border-r border-black p-2 text-right">{item.measurement_cbm}</td>
                    <td className="p-2 text-center">{item.carton_no}</td>
                  </tr>
                ))}
                {/* Spacer rows */}
                {[...Array(Math.max(0, 8 - data.items.length))].map((_, i) => (
                  <tr key={`spacer-${i}`} className="border-b border-black/10 h-8">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td></td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="bg-gray-50 border-t border-black font-bold">
                  <td colSpan={2} className="border-r border-black p-2 text-right uppercase text-[9px]">Totals:</td>
                  <td className="border-r border-black p-2 text-center text-blue-700">{data.totals.total_cartons} CTNS</td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black p-2 text-right">{data.totals.total_net_weight_kg}</td>
                  <td className="border-r border-black p-2 text-right text-red-700">{data.totals.total_gross_weight_kg}</td>
                  <td className="border-r border-black p-2 text-right">{data.totals.total_measurement_cbm}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer & Signature */}
          <div className="mt-12 flex justify-between items-end">
            <div className="w-1/2 pr-10">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">Declaration:</p>
              <p className="text-[10px] leading-relaxed italic text-gray-700">
                WE HEREBY CERTIFY THAT THE ABOVE MENTIONED GOODS ARE IN ACCORDANCE WITH THE INVOICE AND PACKED IN GOOD CONDITION.
              </p>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b-2 border-black min-h-[80px] flex items-end justify-center pb-2 relative">
                <div className="absolute top-0 opacity-10 flex items-center justify-center w-full h-full">
                   <div className="border-4 border-red-800 rounded-full w-20 h-20 flex items-center justify-center transform rotate-12 text-red-800 font-bold text-[8px] uppercase text-center p-1">
                     CHECKED<br/>LOGISTICS
                   </div>
                </div>
                <span className="text-xs italic font-serif text-gray-400">Authorized Signature</span>
              </div>
              <p className="text-xs mt-3 font-bold uppercase tracking-wider">{data.declarations.signatory}</p>
              <p className="text-[10px] text-gray-600">{data.declarations.signature_date}</p>
            </div>
          </div>
        </Card>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
            background-color: white !important;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
          .Card {
            border: none !important;
            box-shadow: none !important;
            padding: 15mm !important;
          }
        }
      `}</style>
    </div>
  );
}
