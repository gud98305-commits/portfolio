"use client";

import React from "react";
import { CommercialInvoice } from "@/types/documents";
import { Button } from "./button";
import { Printer, FileText } from "lucide-react";
import { Card } from "./card";
import { formatMoney } from "@/lib/invoice-utils";

interface InvoicePreviewProps {
  data: CommercialInvoice;
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  if (!data || !data.trade_terms) {
    return <div className="p-4 text-center text-gray-500">서류 데이터를 불러오는 중입니다...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const currency = data?.trade_terms?.currency || "USD";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">서류 미리보기</h2>
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
              Commercial Invoice
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

            {/* Invoice Meta */}
            <div className="border-b border-black">
              <div className="flex border-b border-black h-1/2">
                <div className="w-1/2 border-r border-black p-2 bg-gray-50/50">
                  <span className="block text-[10px] font-bold uppercase text-gray-600">Invoice No.</span>
                  <span className="text-base font-bold">{data.invoice_no}</span>
                </div>
                <div className="w-1/2 p-2 bg-gray-50/50">
                  <span className="block text-[10px] font-bold uppercase text-gray-600">Date</span>
                  <span className="text-base font-bold">{data.date}</span>
                </div>
              </div>
              <div className="p-3 h-1/2">
                <h3 className="text-[10px] font-bold uppercase mb-1 text-gray-600">Reference / Remarks</h3>
                <p className="text-xs italic">{data.trade_terms.payment_terms}</p>
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

            {/* Notify Party */}
            <div className="border-b border-black p-3">
              <h3 className="text-[10px] font-bold uppercase mb-1 text-gray-600">Notify Party</h3>
              <div className="text-sm">
                <p className="font-bold uppercase">{data.notify_party.company_name}</p>
                <p className="text-xs italic text-gray-700 mt-2">{data.notify_party.note}</p>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="grid grid-cols-4 border-l border-r border-b border-black text-center bg-gray-50/30">
            <div className="border-r border-black p-2">
              <span className="block text-[9px] font-bold uppercase text-gray-600">Vessel / Voyage</span>
              <span className="text-xs font-semibold">{data.shipment_details.vessel_or_vehicle}</span>
            </div>
            <div className="border-r border-black p-2">
              <span className="block text-[9px] font-bold uppercase text-gray-600">Port of Loading</span>
              <span className="text-xs font-semibold">{data.shipment_details.port_of_loading}</span>
            </div>
            <div className="border-r border-black p-2">
              <span className="block text-[9px] font-bold uppercase text-gray-600">Port of Discharge</span>
              <span className="text-xs font-semibold">{data.shipment_details.port_of_discharge}</span>
            </div>
            <div className="p-2">
              <span className="block text-[9px] font-bold uppercase text-gray-600">Final Destination</span>
              <span className="text-xs font-semibold">{data.shipment_details.place_of_delivery}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 border-l border-r border-b border-black text-center">
            <div className="border-r border-black p-2">
              <span className="block text-[9px] font-bold uppercase text-gray-600">Trade Terms</span>
              <span className="text-sm font-bold">{data.trade_terms.incoterms}</span>
            </div>
            <div className="p-2">
              <span className="block text-[9px] font-bold uppercase text-gray-600">ETD / ETA</span>
              <span className="text-sm font-bold">{data.shipment_details.etd} / {data.shipment_details.eta}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mb-0 border-l border-r border-b border-black">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-black">
                  <th className="border-r border-black p-2 text-[10px] font-bold uppercase w-32">HS Code</th>
                  <th className="border-r border-black p-2 text-[10px] font-bold uppercase">Description of Goods</th>
                  <th className="border-r border-black p-2 text-[10px] font-bold uppercase w-24">Quantity</th>
                  <th className="border-r border-black p-2 text-[10px] font-bold uppercase w-28">Unit Price</th>
                  <th className="p-2 text-[10px] font-bold uppercase w-32">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.line_items.map((item, index) => (
                  <tr key={index} className="border-b border-black/10 min-h-[45px]">
                    <td className="border-r border-black p-2 text-center font-mono text-xs">{item.hs_code}</td>
                    <td className="border-r border-black p-2">
                      <p className="font-bold uppercase mb-1">{item.description}</p>
                      <p className="text-[10px] text-gray-600">ORIGIN: {item.country_of_origin}</p>
                    </td>
                    <td className="border-r border-black p-2 text-center">
                      <span className="font-bold">{item.quantity.toLocaleString()}</span>
                      <span className="text-[10px] ml-1 uppercase">{item.unit}</span>
                    </td>
                    <td className="border-r border-black p-2 text-right font-mono">
                      {formatMoney(item.unit_price, currency)}
                    </td>
                    <td className="p-2 text-right font-bold font-mono">
                      {formatMoney(item.amount, currency)}
                    </td>
                  </tr>
                ))}
                {/* Spacer rows */}
                {[...Array(Math.max(0, 5 - data.line_items.length))].map((_, i) => (
                  <tr key={`spacer-${i}`} className="border-b border-black/10 h-10">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex border-l border-r border-b border-black">
            <div className="w-2/3 p-4 border-r border-black">
              <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">Amount in Words:</p>
              <p className="text-xs font-bold italic tracking-tight leading-relaxed underline">
                {data.totals.amount_in_words}
              </p>
            </div>
            <div className="w-1/3 text-sm">
              <div className="flex justify-between p-2 border-b border-black/10">
                <span className="font-bold uppercase text-[10px]">Subtotal</span>
                <span className="font-mono">{formatMoney(data.totals.subtotal, currency)}</span>
              </div>
              {(parseFloat(data.totals.freight) > 0) && (
                <div className="flex justify-between p-2 border-b border-black/10">
                  <span className="font-bold uppercase text-[10px]">Freight</span>
                  <span className="font-mono">{formatMoney(data.totals.freight, currency)}</span>
                </div>
              )}
              {data.totals.additional_charges.map((charge, idx) => (
                <div key={idx} className="flex justify-between p-2 border-b border-black/10">
                  <span className="font-bold uppercase text-[10px]">{charge.description}</span>
                  <span className="font-mono">{formatMoney(charge.amount, currency)}</span>
                </div>
              ))}
              {(parseFloat(data.totals.discount) > 0) && (
                <div className="flex justify-between p-2 border-b border-black/10 text-red-600">
                  <span className="font-bold uppercase text-[10px]">Discount</span>
                  <span className="font-mono">-{formatMoney(data.totals.discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between p-2 bg-black text-white font-bold">
                <span className="uppercase text-[11px]">Total ({currency})</span>
                <span className="text-base font-mono underline decoration-double underline-offset-4">
                  {formatMoney(data.totals.total_amount, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Packing & Bank Details */}
          <div className="grid grid-cols-2 border-l border-r border-b border-black">
            <div className="border-r border-black p-3 bg-gray-50/20">
              <h3 className="text-[10px] font-bold uppercase mb-2 border-b border-black/20 pb-1">Packing & Weight Details</h3>
              <div className="grid grid-cols-2 gap-y-1 text-xs">
                <span className="text-gray-600 uppercase text-[9px]">Total Packages:</span>
                <span className="font-bold">{data.packages.total_packages} {data.packages.package_type}</span>
                <span className="text-gray-600 uppercase text-[9px]">Gross Weight:</span>
                <span className="font-bold">{data.packages.gross_weight_kg} KGS</span>
                <span className="text-gray-600 uppercase text-[9px]">Net Weight:</span>
                <span className="font-bold">{data.packages.net_weight_kg} KGS</span>
                <span className="text-gray-600 uppercase text-[9px]">Measurement:</span>
                <span className="font-bold">{data.packages.measurement_cbm} CBM</span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-[10px] font-bold uppercase mb-2 border-b border-black/20 pb-1">Bank Information</h3>
              <div className="text-[11px] leading-tight space-y-0.5">
                <p><span className="font-bold uppercase text-[9px] w-16 inline-block">Bank:</span> {data.bank_details.bank_name}</p>
                <p><span className="font-bold uppercase text-[9px] w-16 inline-block">Branch:</span> {data.bank_details.branch}</p>
                <p><span className="font-bold uppercase text-[9px] w-16 inline-block">SWIFT:</span> {data.bank_details.swift_code}</p>
                <p><span className="font-bold uppercase text-[9px] w-16 inline-block">A/C No:</span> {data.bank_details.account_no}</p>
                <p><span className="font-bold uppercase text-[9px] w-16 inline-block">Holder:</span> {data.bank_details.account_holder}</p>
              </div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="mt-12 flex justify-between items-end">
            <div className="w-1/2 pr-10">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">Declaration:</p>
              <p className="text-[10px] leading-relaxed italic text-gray-700">
                {data.declarations.statement}
              </p>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b-2 border-black min-h-[80px] flex items-end justify-center pb-2 relative">
                {/* Placeholder for actual signature image or seal */}
                <div className="absolute top-0 opacity-10 flex items-center justify-center w-full h-full">
                   <div className="border-4 border-red-800 rounded-full w-20 h-20 flex items-center justify-center transform rotate-12 text-red-800 font-bold text-[8px] uppercase text-center p-1">
                     APPROVED<br/>EXPORT DEPT
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
