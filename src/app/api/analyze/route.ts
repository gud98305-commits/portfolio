import { NextResponse } from "next/server";
import { RiskSignal } from "@/types/trade";

export async function POST(request: Request) {
  try {
    const { country, hsCode } = await request.json();

    if (!country || !hsCode) {
      return NextResponse.json(
        { error: "Country and HS Code are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const isDemoMode = !apiKey;

    if (isDemoMode) {
      // Demo response if API Key is missing
      const demoResponse: RiskSignal & { isDemoMode: boolean } = {
        isDemoMode: true,
        risk_color: "yellow",
        risk_level: "주의 (Caution)",
        risk_reason: `${country}의 HS Code ${hsCode} 관련하여 수입 규제 및 인증 요건이 존재합니다. 최근 환경 규제가 강화되는 추세입니다.`,
        tip: "### 전문가 조언\n\n1. **현지 파트너 활용**: 현지 파트너를 통한 사전 인증 획득이 중요합니다.\n2. **라벨링 준수**: 라벨링 규정 준수 여부를 재확인하십시오.\n3. **인증서 준비**: ISO 및 관련 인증서를 최신화하십시오.",
        swot: {
          S: "한국 제품의 높은 브랜드 인지도 및 품질 신뢰도",
          W: "현지 물류 비용 상승 및 AS 인프라 부족",
          O: "한-현지 FTA 활용을 통한 관세 절감 기회",
          T: "현지 로컬 업체의 저가 공세 및 규제 강화"
        }
      };
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json(demoResponse);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "당신은 20년 경력의 국제무역 컨설턴트입니다. 사용자가 제공하는 국가와 HS Code를 기반으로 해당 품목의 수출입 규제 위험도와 SWOT 분석을 수행하십시오. 반드시 JSON 형식으로만 응답해야 합니다."
          },
          {
            role: "user",
            content: `국가: ${country}, HS Code: ${hsCode}. 다음 구조의 JSON으로 응답하세요: { "risk_color": "red" | "yellow" | "green", "risk_level": "위험도 단계", "risk_reason": "위험 사유", "tip": "조언(마크다운 형식)", "swot": { "S": "강점", "W": "약점", "O": "기회", "T": "위협" } }`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content) as RiskSignal;

    return NextResponse.json({ ...result, isDemoMode: false });
  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
