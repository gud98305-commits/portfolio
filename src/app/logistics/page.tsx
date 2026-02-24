"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Calculator, Ship } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { INLAND_TRANSPORT, FREIGHT_RATES } from "@/lib/constants";
import { logisticsSchema, LogisticsFormValues } from "@/types/logistics";
import { useLogisticsCalculator } from "@/hooks/useLogisticsCalculator";
import { LogisticsResult } from "@/components/domain/LogisticsResult";

export default function LogisticsPage() {
  const { result, isLoading, exchangeInfo, calculateQuote } = useLogisticsCalculator();

  const form = useForm<LogisticsFormValues>({
    resolver: zodResolver(logisticsSchema),
    defaultValues: {
      incoterms: "FOB",
      departure_city: "",
      departure_port: "",
      destination_port: "",
      container_type: "20ft",
      margin_percent: 5,
      cargo_value_usd: 0,
      cbm: 0,
      weight_kg: 0,
    },
  });

  const { watch, setValue, handleSubmit } = form;
  const watchIncoterms = watch("incoterms");
  const watchCity = watch("departure_city");
  const watchPort = watch("departure_port");
  const watchContainer = watch("container_type");

  useEffect(() => {
    setValue("departure_port", "", { shouldValidate: true });
    setValue("destination_port", "", { shouldValidate: true });
  }, [watchCity, setValue]);

  useEffect(() => {
    setValue("destination_port", "", { shouldValidate: true });
  }, [watchPort, setValue]);

  const onSubmit = async (data: LogisticsFormValues) => {
    try {
      await calculateQuote(data);
      toast.success("견적이 계산되었습니다.");
    } catch (error: any) {
      toast.error(error.message || "오류가 발생했습니다.");
    }
  };

  const cities = Object.keys(INLAND_TRANSPORT);
  const ports = watchCity ? Object.keys(INLAND_TRANSPORT[watchCity] || {}) : [];
  const destinations = watchPort ? Object.keys(FREIGHT_RATES[watchPort] || {}) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-[#051161] flex items-center gap-3">
          <Ship className="h-8 w-8" /> 물류비 견적 시뮬레이터
        </h1>
        <p className="text-slate-600">출발지부터 도착지까지의 모든 물류 비용을 투명하게 계산합니다.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">물류 정보 입력</CardTitle>
          <CardDescription>정확한 견적을 위해 상세 물류 조건을 선택해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="incoterms" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Incoterms</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-11"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="FOB">FOB (Free On Board)</SelectItem>
                        <SelectItem value="CFR">CFR (Cost and Freight)</SelectItem>
                        <SelectItem value="CIF">CIF (Cost, Insurance, and Freight)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                <FormField control={form.control} name="departure_city" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">출발 도시</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="h-11"><SelectValue placeholder="도시 선택" /></SelectTrigger></FormControl>
                      <SelectContent>{cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="departure_port" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">출발 항만</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!watchCity}>
                      <FormControl><SelectTrigger className="h-11"><SelectValue placeholder="항만 선택" /></SelectTrigger></FormControl>
                      <SelectContent>{ports.map(port => <SelectItem key={port} value={port}>{port}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="destination_port" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">도착 항만</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!watchPort}>
                      <FormControl><SelectTrigger className="h-11"><SelectValue placeholder="목적지 선택" /></SelectTrigger></FormControl>
                      <SelectContent>{destinations.map(dest => <SelectItem key={dest} value={dest}>{dest}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="container_type" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">컨테이너 타입</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-11"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="20ft">20ft FCL</SelectItem>
                        <SelectItem value="40ft">40ft FCL</SelectItem>
                        <SelectItem value="40hc">40ft HC FCL</SelectItem>
                        <SelectItem value="LCL">LCL (소량 화물)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                <FormField control={form.control} name="margin_percent" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">안전 할증률 (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="h-11" onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {watchIncoterms === "CIF" && (
                  <FormField control={form.control} name="cargo_value_usd" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-blue-600">화물 가액 (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="CIF 필수 항목" {...field} value={field.value ?? ""} className="h-11 border-blue-200" onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                {watchContainer === "LCL" && (
                  <>
                    <FormField control={form.control} name="cbm" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-emerald-600">부피 (CBM)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} value={field.value ?? ""} className="h-11 border-emerald-200" onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="weight_kg" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-emerald-600">무게 (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value ?? ""} className="h-11 border-emerald-200" onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </>
                )}
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-bold bg-[#051161] hover:bg-blue-900 shadow-lg transition-all" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> 계산 중...</> : <><Calculator className="mr-2 h-5 w-5" /> 견적 계산하기</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && <LogisticsResult result={result} formData={form.getValues()} exchangeInfo={exchangeInfo} />}
    </div>
  );
}
