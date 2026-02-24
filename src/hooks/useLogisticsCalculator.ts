import { useState } from "react";
import { toast } from "sonner";
import { fetchClient } from "@/lib/api-client";
import { calculateLogistics } from "@/services/logistics-calculator";
import { LogisticsFormValues, LogisticsResult, LogisticsInput } from "@/types/logistics";

export function useLogisticsCalculator() {
  const [result, setResult] = useState<LogisticsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeInfo, setExchangeInfo] = useState<{ rate: number; source: string } | null>(null);

  const calculateQuote = async (data: LogisticsFormValues) => {
    setIsLoading(true);
    try {
      let currentRate = exchangeInfo?.rate;
      let currentSource = exchangeInfo?.source;

      if (!currentRate) {
        try {
          const exData = await fetchClient<any>("/api/exchange-rate");
          currentRate = exData?.rates?.USD || 1400;
          currentSource = exData?.source || "fallback";
          setExchangeInfo({ rate: currentRate, source: currentSource });
        } catch (fetchError) {
          toast.error("환율 조회 실패. 기본 환율(1400원)로 계산합니다.");
          currentRate = 1400;
          currentSource = "fallback";
          setExchangeInfo({ rate: currentRate, source: currentSource });
        }
      }

      const calcResult = calculateLogistics(data as LogisticsInput, currentRate!);
      setResult(calcResult);
      return calcResult;
    } catch (error: any) {
      console.error("Calculation failed:", error);
      toast.error(error.message || "오류가 발생했습니다.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { result, isLoading, exchangeInfo, calculateQuote };
}
