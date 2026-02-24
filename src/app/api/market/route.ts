import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { country, hsCode } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;
    const isDemoMode = !apiKey;

    if (isDemoMode) {
      const demoResponse = {
        isDemoMode: true,
        marketSize: "$1.2B",
        growthRate: "+8.5%",
        trend: "비건 및 친환경 원료를 사용한 제품군에 대한 수요가 급증하고 있으며, 온라인 D2C 채널의 비중이 40%를 넘어섰습니다.",
        competitors: "현지 로컬 브랜드 A사, 글로벌 브랜드 B사, 그리고 최근 시장 점유율을 높이고 있는 C사 등이 주요 경쟁사입니다.",
        opportunities: "MZ세대의 구매력 상승과 K-뷰티에 대한 우호적인 인식으로 프리미엄 라인의 진출 기회가 큽니다.",
        risks: "공급망 불안정으로 인한 원가 상승 압박과 환경 규제 강화에 따른 패키징 교체 비용 발생 가능성이 있습니다."
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
            content: "당신은 국제 시장 분석 전문가입니다. 주어진 국가와 HS Code를 기반으로 시장 규모, 성장률, 트렌드, 경쟁자, 기회, 리스크를 분석하십시오. 반드시 JSON 형식으로만 응답해야 합니다."
          },
          {
            role: "user",
            content: `국가: ${country}, HS Code: ${hsCode}. 다음 구조의 JSON으로 응답하세요: { "marketSize": "시장규모", "growthRate": "성장률", "trend": "시장트렌드", "competitors": "주요경쟁자", "opportunities": "진출기회", "risks": "잠재리스크" }`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ ...result, isDemoMode: false });
  } catch (error) {
    console.error("Market Analysis Error:", error);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
