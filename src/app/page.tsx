"use client";

import Link from "next/link";
import { 
  BarChart3, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  ArrowRight, 
  Ship, 
  TrendingUp,
  Search,
  Shield
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "📊 시장분석",
    description: "HS Code 기반 시장 규모·트렌드 AI 분석",
    href: "/market",
    icon: Search,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "🛡️ 규제·SWOT",
    description: "수출 규제 신호등 + AI SWOT 분석",
    href: "/barrier",
    icon: Shield,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "💰 가격전략",
    description: "경쟁사 가격 조사 + 포지셔닝",
    href: "/pricing",
    icon: DollarSign,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "🤝 바이어실행",
    description: "AI 바이어 발굴 + 서류 3종 자동 생성",
    href: "/action",
    icon: Users,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    title: "🚢 물류비 견적",
    description: "Incoterms 기반 FOB/CFR/CIF 자동 계산",
    href: "/logistics",
    icon: Ship,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
  {
    title: "📈 환율",
    description: "4개 통화 실시간 환율 + 30일 추이 차트",
    href: "/exchange",
    icon: TrendingUp,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
];

const stats = [
  { label: "대상 국가", value: "29개국", detail: "주요 수출국 커버리지" },
  { label: "글로벌 바이어", value: "30만+", detail: "검증된 바이어 데이터" },
  { label: "수출입 서류", value: "6종", detail: "AI 자동 작성 지원" },
  { label: "실시간 데이터", value: "24/7", detail: "최신 무역 트렌드 반영" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-16 px-4">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#051161] tracking-tight">
          SY Global Connect
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          해외영업 실무를 위한 AI 기반 무역 지원 플랫폼
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button asChild size="lg" className="bg-[#051161] hover:bg-blue-900 rounded-full px-8">
            <Link href="/market">시작하기</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/barrier">서비스 소개</Link>
          </Button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} className="group transition-all hover:-translate-y-1">
              <Card className="h-full border-slate-200 transition-all group-hover:shadow-lg group-hover:border-blue-200">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${feature.bgColor}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-slate-500 text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center text-sm font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    바로가기 <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Data Section */}
      <section className="max-w-7xl mx-auto w-full bg-white rounded-3xl border border-slate-200 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left space-y-2">
              <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              <div className="text-3xl font-bold text-[#051161]">{stat.value}</div>
              <div className="text-slate-400 text-xs">{stat.detail}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
