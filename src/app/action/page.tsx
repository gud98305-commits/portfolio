"use client";

import { useState } from "react";
import { SUPPORTED_COUNTRIES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, AlertCircle, Users, Mail, Globe, Sparkles, Send, Copy, 
  FilePlus, Trash2, Plus, FileText, ChevronRight, Building2, UserCircle 
} from "lucide-react";
import { fetchClient } from "@/lib/api-client";
import { CommercialInvoice, PackingList, SalesContract, DocumentType } from "@/types/documents";
import { InvoicePreview } from "@/components/ui/InvoicePreview";
import { PackingListPreview } from "@/components/ui/PackingListPreview";
import { SalesContractPreview } from "@/components/ui/SalesContractPreview";

interface BuyerInfo {
  companyName: string;
  country: string;
  email: string;
  industry: string;
  matchScore: number;
  emailDraft: string;
}

interface ActionResult {
  buyers: BuyerInfo[];
  isDemoMode?: boolean;
}

const industries = ["화장품/뷰티", "식음료", "IT/전자제품", "자동차부품", "생활가전", "의료기기", "의류/패션", "화학제품"];

const currencies = ["USD", "EUR", "JPY", "KRW", "CNY"];
const incotermsOptions = ["FOB", "CIF", "CFR", "EXW", "DDP", "FCA", "DAP"];
const paymentTermsOptions = ["T/T 100% Advance", "T/T 30/70", "L/C at Sight", "D/P", "D/A"];

export default function ActionPage() {
  // Tab 1: Buyer Search State
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  // Tab 2: Document Generation State
  const [documentType, setDocumentType] = useState<DocumentType>("commercial_invoice");
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<any | null>(null);
  
  const [shipper, setShipper] = useState({ company_name: "", address: "", tax_id: "" });
  const [consignee, setConsignee] = useState({ company_name: "", address: "", tax_id: "" });
  const [currency, setCurrency] = useState("USD");
  const [incoterms, setIncoterms] = useState("FOB");
  const [paymentTerms, setPaymentTerms] = useState("T/T 30/70");
  
  const [lineItems, setLineItems] = useState([
    { 
      description: "", 
      hs_code: "", 
      quantity: 1, 
      unit: "PCS", 
      unit_price: "",
      net_weight_kg: "",
      gross_weight_kg: "",
      measurement_cbm: "",
      carton_no: ""
    }
  ]);
  const [additionalCharges, setAdditionalCharges] = useState<{description: string, amount: string}[]>([]);
  const [discount, setDiscount] = useState("0");

  // Sales Contract Specific
  const [contractTerms, setContractTerms] = useState({
    validity_period: "90 days from the date of this contract",
    quality_standard: "Products shall conform to Korean FDA standards",
    penalty_clause: "Late delivery penalty: 0.5% of contract value per week, max 5%",
    arbitration: "Any dispute shall be settled by KCIA (Korean Commercial Arbitration Institute) in Seoul"
  });

  const handleSearch = async () => {
    if (!country || !industry || !hsCode) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await fetchClient<any>("/api/action", {
        method: "POST",
        body: JSON.stringify({ country, industry, hsCode }),
        timeout: 30000,
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { 
      description: "", 
      hs_code: "", 
      quantity: 1, 
      unit: "PCS", 
      unit_price: "",
      net_weight_kg: "",
      gross_weight_kg: "",
      measurement_cbm: "",
      carton_no: ""
    }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const newItems = [...lineItems];
    (newItems[index] as any)[field] = value;
    setLineItems(newItems);
  };

  const handleDocumentTypeChange = (value: DocumentType) => {
    setDocumentType(value);
    setInvoiceResult(null);
    // Optional: Reset other fields if needed
  };

  const handleGenerateInvoice = async () => {
    setInvoiceLoading(true);
    try {
      const data = await fetchClient<any>("/api/documents", {
        method: "POST",
        body: JSON.stringify({
          document_type: documentType,
          shipperInfo: shipper,
          consigneeInfo: consignee,
          items: lineItems,
          currency,
          incoterms,
          paymentTerms,
          discount,
          contractTerms: documentType === "sales_contract" ? contractTerms : undefined
        }),
      });
      setInvoiceResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setInvoiceLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-[#051161] flex items-center gap-3">
          🤝 바이어실행 & 서류자동화
        </h1>
        <p className="text-slate-600">AI가 바이어 발굴부터 수출 서류 생성까지 무역 프로세스 전반을 지원합니다.</p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
          <TabsTrigger value="search" className="text-base font-bold flex items-center gap-2">
            <Users className="h-4 w-4" /> 바이어 발굴
          </TabsTrigger>
          <TabsTrigger value="docs" className="text-base font-bold flex items-center gap-2">
            <FilePlus className="h-4 w-4" /> 서류 자동 생성
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-8">
          {result?.isDemoMode && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 font-bold">데모 모드</AlertTitle>
              <AlertDescription className="text-amber-700">
                실제 바이어 DB 대신 AI가 생성한 가상의 타겟 바이어 샘플 리스트를 표시 중입니다.
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-800" />
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" /> 산업 분야
                  </label>
                  <Select onValueChange={setIndustry}>
                    <SelectTrigger className="h-12 border-slate-200">
                      <SelectValue placeholder="산업 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-blue-500" /> 타겟 국가
                  </label>
                  <Select onValueChange={setCountry}>
                    <SelectTrigger className="h-12 border-slate-200">
                      <SelectValue placeholder="국가 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.name}>{c.name} ({c.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-500" /> HS Code
                  </label>
                  <Input
                    placeholder="예: 3304.99"
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    className="h-12 border-slate-200"
                  />
                </div>
                <Button
                  className="md:col-span-3 h-14 text-lg font-bold bg-[#051161] hover:bg-blue-900 shadow-lg shadow-blue-100 transition-all hover:scale-[1.01]"
                  onClick={handleSearch}
                  disabled={loading || !country || !industry || !hsCode}
                >
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> 바이어 발굴 중...</> : "AI 바이어 매칭 시작"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
                <Users className="h-5 w-5" /> 추천 바이어 리스트
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {result.buyers.map((buyer, idx) => (
                  <Card key={idx} className="border-slate-200 group hover:border-blue-200 transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#051161] font-bold text-xl shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {buyer.companyName.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg text-slate-800">{buyer.companyName}</h4>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                              매칭 {buyer.matchScore}%
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {buyer.country}</span>
                            <span className="flex items-center gap-1 font-medium text-slate-600">{buyer.industry}</span>
                            <span className="flex items-center gap-1 italic"><Mail className="h-3.5 w-3.5" /> {buyer.email}</span>
                          </div>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 whitespace-nowrap shadow-sm">
                            <Sparkles className="h-4 w-4" /> AI 이메일 생성
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-blue-600" /> 맞춤형 협력 제안서
                            </DialogTitle>
                            <DialogDescription>
                              {buyer.companyName} 바이어에게 최적화된 콜드메일 초안입니다.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 p-6 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm whitespace-pre-wrap leading-relaxed text-slate-800">
                            {buyer.emailDraft}
                          </div>
                          <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" className="gap-2" onClick={() => {
                              navigator.clipboard.writeText(buyer.emailDraft);
                              alert("복사되었습니다!");
                            }}>
                              <Copy className="h-4 w-4" /> 내용 복사
                            </Button>
                            <Button className="gap-2 bg-[#051161] hover:bg-blue-900">
                              <Send className="h-4 w-4" /> 메일 발송 (준비중)
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="docs" className="space-y-8">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-[#051161]">
                    <FilePlus className="h-5 w-5" /> 무역 서류 자동 생성
                  </CardTitle>
                  <CardDescription>AI가 전문적인 수출 서류(Invoice, P/L, Contract)를 생성합니다.</CardDescription>
                </div>
                <div className="w-full md:w-64">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">서류 종류 선택</label>
                  <Select value={documentType} onValueChange={(v) => handleDocumentTypeChange(v as DocumentType)}>
                    <SelectTrigger className="bg-white border-blue-200 font-bold text-blue-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial_invoice">Commercial Invoice</SelectItem>
                      <SelectItem value="packing_list">Packing List</SelectItem>
                      <SelectItem value="sales_contract">Sales Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Shipper & Consignee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-bold text-slate-800 border-l-4 border-[#051161] pl-2 uppercase tracking-tight">
                    <Building2 className="h-4 w-4" /> {documentType === "sales_contract" ? "Seller (매도인)" : "Shipper (수출자)"}
                  </div>
                  <div className="space-y-3">
                    <Input placeholder="회사명 (ex. AMORE BEAUTY CO., LTD.)" value={shipper.company_name} onChange={e => setShipper({...shipper, company_name: e.target.value})} />
                    <Input placeholder="사업자번호 / TAX ID" value={shipper.tax_id} onChange={e => setShipper({...shipper, tax_id: e.target.value})} />
                    <textarea 
                      className="w-full h-24 p-3 border border-slate-200 rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#051161]" 
                      placeholder="주소 및 연락처"
                      value={shipper.address}
                      onChange={e => setShipper({...shipper, address: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-bold text-slate-800 border-l-4 border-[#051161] pl-2 uppercase tracking-tight">
                    <UserCircle className="h-4 w-4" /> {documentType === "sales_contract" ? "Buyer (매수인)" : "Consignee (수입자)"}
                  </div>
                  <div className="space-y-3">
                    <Input placeholder="회사명" value={consignee.company_name} onChange={e => setConsignee({...consignee, company_name: e.target.value})} />
                    <Input placeholder="Tax ID / EORI No" value={consignee.tax_id} onChange={e => setConsignee({...consignee, tax_id: e.target.value})} />
                    <textarea 
                      className="w-full h-24 p-3 border border-slate-200 rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#051161]" 
                      placeholder="주소 및 연락처"
                      value={consignee.address}
                      onChange={e => setConsignee({...consignee, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Trade Terms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">통화 (Currency)</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">인코텀즈 (Incoterms)</label>
                  <Select value={incoterms} onValueChange={setIncoterms}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {incotermsOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">결제조건 (Payment Terms)</label>
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {paymentTermsOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {documentType === "sales_contract" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">품질 기준 (Quality Standard)</label>
                    <Input value={contractTerms.quality_standard} onChange={e => setContractTerms({...contractTerms, quality_standard: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">유효 기간 (Validity Period)</label>
                    <Input value={contractTerms.validity_period} onChange={e => setContractTerms({...contractTerms, validity_period: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">위약 조항 (Penalty Clause)</label>
                    <Input value={contractTerms.penalty_clause} onChange={e => setContractTerms({...contractTerms, penalty_clause: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">중재 조항 (Arbitration)</label>
                    <Input value={contractTerms.arbitration} onChange={e => setContractTerms({...contractTerms, arbitration: e.target.value})} />
                  </div>
                </div>
              )}

              <Separator />

              {/* Line Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">품목 정보 (Line Items)</h3>
                  <Button variant="outline" size="sm" onClick={addLineItem} className="gap-2">
                    <Plus className="h-4 w-4" /> 행 추가
                  </Button>
                </div>
                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div key={index} className="space-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-100 relative group">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">HS Code</label>
                          <Input placeholder="HS Code" value={item.hs_code} onChange={e => updateLineItem(index, "hs_code", e.target.value)} />
                        </div>
                        <div className="md:col-span-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                          <Input placeholder="품목명 및 상세 설명" value={item.description} onChange={e => updateLineItem(index, "description", e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
                          <Input type="number" placeholder="수량" value={item.quantity} onChange={e => updateLineItem(index, "quantity", e.target.value)} />
                        </div>
                        <div className="md:col-span-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Unit</label>
                          <Input placeholder="단위" value={item.unit} onChange={e => updateLineItem(index, "unit", e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Price ({currency})</label>
                          <Input placeholder="단가" value={item.unit_price} onChange={e => updateLineItem(index, "unit_price", e.target.value)} />
                        </div>
                        <div className="md:col-span-1 flex items-end justify-end">
                          <Button variant="ghost" size="icon" onClick={() => removeLineItem(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {documentType === "packing_list" && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-slate-200 mt-2">
                          <div>
                            <label className="text-[10px] font-bold text-blue-500 uppercase">Net Weight (kg)</label>
                            <Input placeholder="순중량" value={item.net_weight_kg} onChange={e => updateLineItem(index, "net_weight_kg", e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-blue-500 uppercase">Gross Weight (kg)</label>
                            <Input placeholder="총중량" value={item.gross_weight_kg} onChange={e => updateLineItem(index, "gross_weight_kg", e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-blue-500 uppercase">Measurement (CBM)</label>
                            <Input placeholder="부피" value={item.measurement_cbm} onChange={e => updateLineItem(index, "measurement_cbm", e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-blue-500 uppercase">Carton No.</label>
                            <Input placeholder="카톤 번호" value={item.carton_no} onChange={e => updateLineItem(index, "carton_no", e.target.value)} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleGenerateInvoice} 
                  disabled={invoiceLoading}
                  className="h-14 px-10 text-lg font-bold bg-[#051161] hover:bg-blue-900 shadow-lg"
                >
                  {invoiceLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> 서류 생성 중...</> : `${documentType === 'commercial_invoice' ? 'Commercial Invoice' : documentType === 'packing_list' ? 'Packing List' : 'Sales Contract'} 자동 생성`}
                </Button>
              </div>
            </CardContent>
          </Card>

          {invoiceResult && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              {documentType === "commercial_invoice" && <InvoicePreview data={invoiceResult} />}
              {documentType === "packing_list" && <PackingListPreview data={invoiceResult} />}
              {documentType === "sales_contract" && <SalesContractPreview data={invoiceResult} />}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
