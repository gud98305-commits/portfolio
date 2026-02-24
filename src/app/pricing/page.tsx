"use client";

import { useState } from "react";
import { SUPPORTED_COUNTRIES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, ShoppingCart, Star, ExternalLink, Calculator } from "lucide-react";
import { fetchClient } from "@/lib/api-client";

interface CompetitorProduct {
  title: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  link: string;
}

interface PricingResult {
  min: number;
  max: number;
  average: number;
  currency: string;
  products: CompetitorProduct[];
  isDemoMode?: boolean;
}

export default function PricingPage() {
  const [country, setCountry] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricingResult | null>(null);

  const handleSearch = async () => {
    if (!country || !keyword) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await fetchClient<any>("/api/pricing", {
        method: "POST",
        body: JSON.stringify({ country, keyword }),
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
        <h1 className="text-3xl font-extrabold text-[#051161]">💰 가격전략</h1>
        <p className="text-slate-600">글로벌 마켓플레이스의 경쟁사 가격을 벤치마킹하여 최적의 수출가를 제안합니다.</p>
      </div>

      {result?.isDemoMode && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-bold">데모 모드</AlertTitle>
          <AlertDescription className="text-amber-700">
            실시간 데이터 대신 가상의 가격 분석 샘플 데이터를 제공 중입니다.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">대상 시장 (Amazon 등)</label>
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
              <label className="text-sm font-semibold text-slate-700">분석 상품 키워드</label>
              <div className="relative">
                <ShoppingCart className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="예: Vitamin C Serum"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-12 border-slate-200 pl-10"
                />
              </div>
            </div>
            <Button
              className="md:col-span-2 h-14 text-lg font-bold bg-[#051161] hover:bg-blue-900 shadow-lg shadow-blue-100 transition-all hover:scale-[1.01]"
              onClick={handleSearch}
              disabled={loading || !country || !keyword}
            >
              {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> 가격 분석 중...</> : "경쟁사 가격 조사 시작"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Price Range Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-6 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">최저 가격</p>
                <p className="text-3xl font-extrabold text-slate-800">{result.min.toLocaleString()} <span className="text-lg font-normal text-slate-500">{result.currency}</span></p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200 shadow-md transform scale-105">
              <CardContent className="p-6 text-center">
                <p className="text-xs font-bold text-blue-600 uppercase mb-2">시장 평균가</p>
                <p className="text-4xl font-extrabold text-blue-900">{result.average.toLocaleString()} <span className="text-lg font-normal text-blue-500">{result.currency}</span></p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-6 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">최고 가격</p>
                <p className="text-3xl font-extrabold text-slate-800">{result.max.toLocaleString()} <span className="text-lg font-normal text-slate-500">{result.currency}</span></p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
              <Calculator className="h-5 w-5" /> 주요 경쟁 제품 리스트
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {result.products.map((product, idx) => (
                <Card key={idx} className="border-slate-200 hover:border-blue-200 transition-colors">
                  <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{product.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {product.rating}</span>
                        <span>리뷰 {product.reviewCount.toLocaleString()}개</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                      <div className="text-xl font-bold text-slate-900">
                        {product.price.toLocaleString()} {product.currency}
                      </div>
                      <Button variant="outline" size="sm" asChild className="gap-2">
                        <a href={product.link} target="_blank" rel="noopener noreferrer">
                          상품보기 <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
