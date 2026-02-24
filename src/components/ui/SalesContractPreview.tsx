"use client";

import React from "react";
import { SalesContract } from "@/types/documents";
import { Button } from "./button";
import { Printer, FileText } from "lucide-react";
import { Card } from "./card";
import { formatMoney } from "@/lib/invoice-utils";

interface SalesContractPreviewProps {
  data: SalesContract;
}

export function SalesContractPreview({ data }: SalesContractPreviewProps) {
  if (!data || !data.items) {
    return <div className="p-4 text-center text-gray-500">데이터 로딩 중...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const currency = data.trade_terms.currency || "USD";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Sales Contract 미리보기</h2>
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
              Sales Contract
            </h1>
          </div>

          {/* Top Info Section */}
          <div className="grid grid-cols-2 gap-0 border-t border-l border-r border-black mb-0">
            {/* Seller */}
            <div className="border-r border-b border-black p-3 min-h-[160px]">
              <h3 className="text-[10px] font-bold uppercase mb-1 text-gray-600">Seller</h3>
              <div className="text-sm space-y-0.5">
                <p className="font-bold text-base uppercase">{data.seller.company_name}</p>
                <p className="whitespace-pre-line leading-tight">{data.seller.address}</p>
                <p>Tel: {data.seller.tel}</p>
                <p>Email: {data.seller.email}</p>
                {data.seller.tax_id && <p className="font-semibold mt-1">TAX ID: {data.seller.tax_id}</p>}
              </div>
            </div>

            {/* Contract Meta */}
            <div className="border-b border-black">
              <div className="flex border-b border-black h-1/2">
                <div className="w-1/2 border-r border-black p-2 bg-gray-50/50">
                  <span className="block text-[10px] font-bold uppercase text-gray-600">Contract No.</span>
                  <span className="text-base font-bold">{data.contract_no}</span>
                </div>
                <div className="w-1/2 p-2 bg-gray-50/50">
                  <span className="block text-[10px] font-bold uppercase text-gray-600">Date</span>
                  <span className="text-base font-bold">{data.date}</span>
                </div>
              </div>
              <div className="p-3 h-1/2">
                <h3 className="text-[10px] font-bold uppercase mb-1 text-gray-600">Trade Terms</h3>
                <p className="text-base font-bold text-blue-800">{data.trade_terms.incoterms}</p>
              </div>
            </div>

            {/* Buyer */}
            <div className="border-r border-b border-black p-3 min-h-[160px]">
              <h3 className="text-[10px] font-bold uppercase mb-1 text-gray-600">Buyer</h3>
              <div className="text-sm space-y-0.5">
                <p className="font-bold text-base uppercase">{data.buyer.company_name}</p>
                <p className="whitespace-pre-line leading-tight">{data.buyer.address}</p>
                <p>Tel: {data.buyer.tel}</p>
                <p>Email: {data.buyer.email}</p>
                {data.buyer.tax_id && <p className="font-semibold mt-1">TAX ID: {data.buyer.tax_id}</p>}
              </div>
            </div>

            {/* Empty space or additional meta */}
            <div className="border-b border-black p-3 bg-gray-50/10">
              <p className="text-[10px] text-gray-400 italic">This contract is made by and between the Seller and the Buyer, whereby the Seller agrees to sell and the Buyer agrees to buy the undermentioned goods according to the terms and conditions stipulated below.</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-0 border-l border-r border-b border-black">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-black">
                  <th className="border-r border-black p-2 text-[10px] font-bold uppercase w-10">No</th>
                  <th className="border-r border-black p-2 text-[10px] font-bold uppercase">Description</th>
                  <th className="border-r border-black p-2 text-[10px] font-bold uppercase w-24">HS Code</th>
                  <th className="border-r border-black p-2 text-[10px] font-bold uppercase w-20">Qty</th>
                  <th className="border-r border-black p-2 text-[10px] font-bold uppercase w-24">Unit Price</th>
                  <th className="p-2 text-[10px] font-bold uppercase w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-b border-black/10">
                    <td className="border-r border-black p-2 text-center">{item.line_no}</td>
                    <td className="border-r border-black p-2 font-bold uppercase">{item.description}</td>
                    <td className="border-r border-black p-2 text-center font-mono text-xs">{item.hs_code}</td>
                    <td className="border-r border-black p-2 text-center">
                      <span className="font-bold">{item.quantity}</span>
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
                {[...Array(Math.max(0, 5 - data.items.length))].map((_, i) => (
                  <tr key={`spacer-${i}`} className="border-b border-black/10 h-10">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td></td>
                  </tr>
                ))}
                <tr className="bg-black text-white font-bold">
                  <td colSpan={5} className="p-2 text-right uppercase text-[10px]">Total Amount ({currency}):</td>
                  <td className="p-2 text-right text-base font-mono underline underline-offset-4">
                    {formatMoney(data.total_amount, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Conditions Section */}
          <div className="mt-6 border border-black">
            <div className="bg-gray-100 p-2 border-b border-black text-[10px] font-bold uppercase">Terms and Conditions</div>
            <div className="grid grid-cols-1 divide-y divide-black/10 text-xs">
              <div className="p-2 flex gap-4">
                <span className="font-bold w-32 shrink-0 uppercase text-[10px] text-gray-600">Payment Terms:</span>
                <span>{data.payment_terms}</span>
              </div>
              <div className="p-2 flex gap-4">
                <span className="font-bold w-32 shrink-0 uppercase text-[10px] text-gray-600">Delivery Date:</span>
                <span>{data.delivery_date}</span>
              </div>
              <div className="p-2 flex gap-4">
                <span className="font-bold w-32 shrink-0 uppercase text-[10px] text-gray-600">Validity Period:</span>
                <span>{data.validity_period}</span>
              </div>
              <div className="p-2 flex gap-4">
                <span className="font-bold w-32 shrink-0 uppercase text-[10px] text-gray-600">Quality Standard:</span>
                <span>{data.quality_standard}</span>
              </div>
              <div className="p-2 flex gap-4">
                <span className="font-bold w-32 shrink-0 uppercase text-[10px] text-gray-600">Penalty Clause:</span>
                <span>{data.penalty_clause}</span>
              </div>
              <div className="p-2 flex gap-4">
                <span className="font-bold w-32 shrink-0 uppercase text-[10px] text-gray-600">Arbitration:</span>
                <span>{data.arbitration}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-12 grid grid-cols-2 gap-20">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">For and on behalf of Seller:</p>
              <div className="border-b-2 border-black min-h-[80px] flex items-end justify-center pb-2 relative">
                <span className="text-xs italic font-serif text-gray-300">Seller's Stamp & Signature</span>
              </div>
              <p className="text-xs mt-3 font-bold uppercase tracking-wider">{data.signatures.seller_signatory}</p>
              <p className="text-[10px] text-gray-600">Date: {data.signatures.date}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">For and on behalf of Buyer:</p>
              <div className="border-b-2 border-black min-h-[80px] flex items-end justify-center pb-2 relative">
                <span className="text-xs italic font-serif text-gray-300">Buyer's Stamp & Signature</span>
              </div>
              <p className="text-xs mt-3 font-bold uppercase tracking-wider">{data.signatures.buyer_signatory}</p>
              <p className="text-[10px] text-gray-600">Date: {data.signatures.date}</p>
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
