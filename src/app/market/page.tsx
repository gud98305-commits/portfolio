"use client";

import { useState } from "react";
import { SUPPORTED_COUNTRIES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Globe, TrendingUp, Search } from "lucide-react";
import { fetchClient } from "@/lib/api-client";

interface MarketResult {
  marketSize: string;
  growthRate: string;
  trend: string;
  competitors: string;
  opportunities: string;
  risks: string;
  isDemoMode?: boolean;
}

export default function MarketPage() {
  const [country, setCountry] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketResult | null>(null);

  const handleSearch = async () => {
    if (!country || !hsCode) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await fetchClient<any>("/api/market", {
        method: "POST",
        body: JSON.stringify({ country, hsCode }),
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-[#051161]">📊 시장분석</h1>
        <p className="text-slate-600">대상 국가의 시장 규모와 최신 트렌드를 AI 기반 데이터로 분석합니다.</p>
      </div>

      {result?.isDemoMode && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-bold">데모 모드</AlertTitle>
          <AlertDescription className="text-amber-700">
            API 키 미설정으로 가상 데이터를 활용한 샘플 분석 결과입니다.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">수출 대상 국가</label>
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
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-slate-700">HS Code 또는 키워드</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="예: 3304.99 또는 화장품"
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  className="h-12 border-slate-200 pl-10"
                />
              </div>
            </div>
            <Button
              className="md:col-span-2 h-14 text-lg font-bold bg-[#051161] hover:bg-blue-900 shadow-lg shadow-blue-100 transition-all hover:scale-[1.01]"
              onClick={handleSearch}
              disabled={loading || !country || !hsCode}
            >
              {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> 시장 분석 중...</> : "AI 시장 분석 시작"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-blue-50/30 border-blue-100">
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-1">예상 시장 규모</p>
                  <p className="text-3xl font-bold text-blue-900">{result.marketSize}</p>
                </div>
                <Globe className="h-12 w-12 text-blue-200" />
              </CardContent>
            </Card>
            <Card className="bg-emerald-50/30 border-emerald-100">
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-600 mb-1">연평균 성장률</p>
                  <p className="text-3xl font-bold text-emerald-900">{result.growthRate}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-emerald-200" />
              </CardContent>
            </Card>
          </div>

          {/* Details Tabs */}
          <Tabs defaultValue="trend" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-14 bg-slate-100/50 p-1">
              <TabsTrigger value="trend" className="text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600">시장 트렌드</TabsTrigger>
              <TabsTrigger value="competitors" className="text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600">주요 경쟁자</TabsTrigger>
              <TabsTrigger value="opportunities" className="text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600">성장 기회</TabsTrigger>
              <TabsTrigger value="risks" className="text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600">잠재 리스크</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="trend">
                <Card className="border-slate-200">
                  <CardHeader><CardTitle className="text-lg">시장 트렌드 분석</CardTitle></CardHeader>
                  <CardContent className="text-slate-700 leading-relaxed">{result.trend}</CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="competitors">
                <Card className="border-slate-200">
                  <CardHeader><CardTitle className="text-lg">경쟁 구도 조사</CardTitle></CardHeader>
                  <CardContent className="text-slate-700 leading-relaxed">{result.competitors}</CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="opportunities">
                <Card className="border-slate-200">
                  <CardHeader><CardTitle className="text-lg">신규 진출 기회</CardTitle></CardHeader>
                  <CardContent className="text-slate-700 leading-relaxed">{result.opportunities}</CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="risks">
                <Card className="border-slate-200">
                  <CardHeader><CardTitle className="text-lg">위험 요소 식별</CardTitle></CardHeader>
                  <CardContent className="text-slate-700 leading-relaxed">{result.risks}</CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
}
