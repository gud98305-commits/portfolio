"use client";

import { useState } from "react";
import { SUPPORTED_COUNTRIES } from "@/lib/constants";
import { RiskSignal } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import { fetchClient } from "@/lib/api-client";

interface ExtendedRiskSignal extends RiskSignal {
  isDemoMode?: boolean;
}

export default function BarrierPage() {
  const [country, setCountry] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtendedRiskSignal | null>(null);

  const handleAnalyze = async () => {
    if (!country || !hsCode) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await fetchClient<any>("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ country, hsCode }),
      });

      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (color: "red" | "yellow" | "green") => {
    switch (color) {
      case "red": return <Badge variant="destructive" className="px-4 py-1 text-lg">🔴 위험 (High Risk)</Badge>;
      case "yellow": return <Badge variant="secondary" className="px-4 py-1 text-lg bg-amber-100 text-amber-700 hover:bg-amber-100">🟡 주의 (Caution)</Badge>;
      case "green": return <Badge variant="default" className="px-4 py-1 text-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-100">🟢 양호 (Safe)</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-[#051161]">🛡️ 규제·SWOT 분석</h1>
        <p className="text-slate-600">진출하려는 국가의 수입 규제와 비즈니스 환경을 실시간으로 분석합니다.</p>
      </div>

      {result?.isDemoMode && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-bold">데모 모드</AlertTitle>
          <AlertDescription className="text-amber-700">
            현재 API 키가 설정되지 않아 가상 데이터로 분석 결과를 제공합니다.
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">HS Code (권장 6자리)</label>
              <Input
                placeholder="예: 3304.99"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                className="h-12 border-slate-200"
              />
            </div>
            <Button
              className="md:col-span-2 h-14 text-lg font-bold bg-[#051161] hover:bg-blue-900 shadow-lg shadow-blue-100 transition-all hover:scale-[1.01]"
              onClick={handleAnalyze}
              disabled={loading || !country || !hsCode}
            >
              {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> AI 정밀 분석 중...</> : "AI 분석 시작"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Risk Signal Card */}
          <Card className="overflow-hidden border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">시장 진입 신호등</CardTitle>
                {getStatusBadge(result.risk_color)}
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="text-2xl font-bold text-slate-800">{result.risk_level}</div>
              <p className="text-slate-600 leading-relaxed text-lg">
                {result.risk_reason}
              </p>
            </CardContent>
          </Card>

          {/* SWOT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-blue-50/50 border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Strengths (강점)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 font-medium">{result.swot.S}</CardContent>
            </Card>
            <Card className="bg-orange-50/50 border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" /> Weaknesses (약점)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 font-medium">{result.swot.W}</CardContent>
            </Card>
            <Card className="bg-emerald-50/50 border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-700 flex items-center gap-2">
                  <Info className="h-5 w-5" /> Opportunities (기회)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 font-medium">{result.swot.O}</CardContent>
            </Card>
            <Card className="bg-red-50/50 border-red-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" /> Threats (위협)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 font-medium">{result.swot.T}</CardContent>
            </Card>
          </div>

          {/* Tips Card */}
          <Card className="border-blue-100 bg-blue-50/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#051161]">
                💡 진출 전문가 팁
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none text-slate-700 leading-loose">
                {result.tip.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('#') ? 'font-bold text-lg mt-4 mb-2' : ''}>
                    {line.replace(/#+|[*]/g, '')}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
