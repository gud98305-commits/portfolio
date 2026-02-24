"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, TrendingUp, TrendingDown, Clock, Globe, Loader2 } from "lucide-react";
import { fetchClient } from "@/lib/api-client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ExchangeData {
  rate: number;
  change: number;
  flag: string;
  name: string;
}

interface HistoryItem {
  date: string;
  USD: number;
  EUR: number;
  JPY: number;
  CNY: number;
}

export default function ExchangePage() {
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1450, EUR: 1550, JPY: 950, CNY: 198 });
  const [source, setSource] = useState("fallback");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [chartCurrency, setChartCurrency] = useState<"USD" | "EUR" | "JPY" | "CNY">("USD");
  const [currentTime, setCurrentTime] = useState<string>("");

  // Calculator State
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KRW");

  useEffect(() => {
    async function fetchLatest() {
      try {
        const data = await fetchClient<any>("/api/exchange-rate");
        setRates(data.rates);
        setSource(data.source);
      } catch (e) {
        console.error("Failed to fetch latest rates", e);
      }
    }

    async function fetchHistory() {
      setLoadingHistory(true);
      try {
        const data = await fetchClient<any>("/api/exchange-rate?history=true");
        if (data.history) setHistory(data.history);
      } catch (e) {
        console.error("Failed to fetch history", e);
      } finally {
        setLoadingHistory(false);
      }
    }

    fetchLatest();
    fetchHistory();

    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currencies: Record<string, ExchangeData> = useMemo(() => ({
    USD: { rate: rates.USD, change: 1.2, flag: "🇺🇸", name: "미국 달러" },
    EUR: { rate: rates.EUR, change: -0.5, flag: "🇪🇺", name: "유럽 유로" },
    JPY: { rate: rates.JPY / 100, change: 0.1, flag: "🇯🇵", name: "일본 엔" },
    CNY: { rate: rates.CNY, change: 0.3, flag: "🇨🇳", name: "중국 위안" },
    KRW: { rate: 1, change: 0, flag: "🇰🇷", name: "대한민국 원" }
  }), [rates]);

  // Derived calculation for results
  const conversionResult = useMemo(() => {
    const fromRate = currencies[fromCurrency].rate;
    const toRate = currencies[toCurrency].rate;
    return (amount * fromRate) / toRate;
  }, [amount, fromCurrency, toCurrency, currencies]);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const chartData = useMemo(() => {
    return history.map(item => ({
      date: item.date.slice(5), // MM-DD
      rate: item[chartCurrency]
    }));
  }, [history, chartCurrency]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-[#051161] flex items-center gap-3">
            <Globe className="h-8 w-8 text-blue-600" /> 실시간 환율 모니터링
          </h1>
          <p className="text-slate-600">주요 국가 통화의 실시간 환율과 변동 추이를 분석합니다.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="h-4 w-4" /> 최종 업데이트: {currentTime}
        </div>
      </div>

      {/* Currency Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(currencies).filter(([k]) => k !== "KRW").map(([code, data]) => {
          const isPositive = data.change > 0;
          const displayRate = code === "JPY" ? (data.rate * 100).toFixed(2) : data.rate.toLocaleString(undefined, { minimumFractionDigits: 2 });
          return (
            <Card key={code} className="border-slate-200 shadow-sm overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{data.flag}</span>
                    <span className="font-bold text-slate-900">{code} {code === "JPY" ? "(JPY 100)" : ""}</span>
                  </div>
                  <Badge variant={source === "fallback" ? "outline" : "default"} className={source === "fallback" ? "text-slate-400" : "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none"}>
                    {source === "fallback" ? "기본값" : "실시간"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-black text-[#051161]">₩{displayRate}</p>
                  <p className="text-xs text-slate-400">{data.name}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exchange Calculator */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>환율 계산기</CardTitle>
            <CardDescription>현재 시장 환율을 기준으로 통화 간 금액을 변환합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full space-y-2">
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="h-12 text-lg font-bold" />
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(currencies).map(c => <SelectItem key={c} value={c}>{currencies[c].flag} {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 hover:bg-slate-100" onClick={swapCurrencies}>
                <ArrowRightLeft className="h-5 w-5 text-slate-400" />
              </Button>

              <div className="flex-1 w-full space-y-2">
                <div className="h-12 w-full rounded-md border border-input bg-slate-50 px-3 py-2 flex items-center">
                  <span className="text-lg font-bold text-[#051161]">
                    {conversionResult.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(currencies).map(c => <SelectItem key={c} value={c}>{currencies[c].flag} {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>환율 추이 분석</CardTitle>
              <CardDescription>최근 30일 변동 내역</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={chartCurrency} onValueChange={(v: any) => setChartCurrency(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-9">
                <TabsTrigger value="USD" className="text-xs">USD</TabsTrigger>
                <TabsTrigger value="EUR" className="text-xs">EUR</TabsTrigger>
                <TabsTrigger value="JPY" className="text-xs">JPY</TabsTrigger>
                <TabsTrigger value="CNY" className="text-xs">CNY</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="h-[200px] w-full pr-4 flex items-center justify-center">
              {loadingHistory ? (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-xs">데이터 로딩 중...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" hide />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: number | undefined) => [`₩${(value ?? 0).toFixed(2)}`, chartCurrency]}
                    />
                    <Line type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={3} dot={false} animationDuration={1000} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 px-2">
              <span>30일 전</span>
              <span>오늘</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remittance Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>송금 환율 정보</CardTitle>
          <CardDescription>은행별 고시 환율 및 송금 수수료(스프레드) 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="whitespace-nowrap">통화명</TableHead>
                  <TableHead className="text-right whitespace-nowrap">매매기준율</TableHead>
                  <TableHead className="text-right whitespace-nowrap">송금 보낼 때 (+1%)</TableHead>
                  <TableHead className="text-right whitespace-nowrap">송금 받을 때 (-1%)</TableHead>
                  <TableHead className="text-right whitespace-nowrap">스프레드</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(currencies).filter(([k]) => k !== "KRW").map(([code, data]) => {
                  const sendRate = data.rate * 1.01;
                  const receiveRate = data.rate * 0.99;
                  const spread = sendRate - receiveRate;
                  const isUSD = code === "USD";

                  return (
                    <TableRow key={code}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{data.flag}</span>
                          {data.name} ({code})
                          {source !== "fallback" && <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none h-5 text-[10px]">실시간</Badge>}
                          {source === "fallback" && <Badge variant="outline" className="ml-2 h-5 text-[10px] font-normal text-slate-400">기본값</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold whitespace-nowrap">
                        {code === "JPY" ? (data.rate * 100).toFixed(2) : data.rate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-red-600 whitespace-nowrap">
                        {code === "JPY" ? (sendRate * 100).toFixed(2) : sendRate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-blue-600 whitespace-nowrap">
                        {code === "JPY" ? (receiveRate * 100).toFixed(2) : receiveRate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-slate-400 text-sm whitespace-nowrap">
                        {code === "JPY" ? (spread * 100).toFixed(2) : spread.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
