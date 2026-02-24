import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { industry, country, hsCode } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;
    const isDemoMode = !apiKey;

    if (isDemoMode) {
      const demoResponse = {
        isDemoMode: true,
        buyers: [
          { companyName: "Global Trade Co.", country: country, email: "contact@globaltrade.com", industry: industry, matchScore: 98, emailDraft: `Subject: Introduction - High-Quality HS Code: ${hsCode} Products from Korea

Dear Global Trade Co. Team,

We are a specialized supplier of ${industry} products. We noticed your presence in ${country}...` },
          { companyName: "NexGen Logistics", country: country, email: "sales@nexgen.net", industry: industry, matchScore: 92, emailDraft: `Subject: Partnership Opportunity for ${industry} Distribution

Hello NexGen Team,

We are looking to expand our ${industry} reach in ${country}...` },
          { companyName: "EuroMarket Imports", country: country, email: "info@euromarket.eu", industry: industry, matchScore: 85, emailDraft: `Subject: Premium ${industry} Supply for EuroMarket

Greetings,

Our company provides top-tier ${industry} items with HS Code ${hsCode}...` },
          { companyName: "Oceanic Partners", country: country, email: "procurement@oceanic.au", industry: industry, matchScore: 82, emailDraft: `Subject: High-Quality HS ${hsCode} Export Inquiry

Dear Oceanic Partners,

We'd like to introduce our range of ${industry} products...` },
          { companyName: "Asian Connect Group", country: country, email: "connect@acg.asia", industry: industry, matchScore: 78, emailDraft: `Subject: Exclusive ${industry} Distribution in ${country}

Hello,

We are a leading Korean exporter of ${industry}...` },
        ]
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
            content: "당신은 글로벌 비즈니스 매칭 전문가입니다. 산업 분야, 국가, HS Code를 기반으로 해당 지역의 가상 바이어 5곳과 각 바이어에 최적화된 콜드메일 초안(영문)을 생성하십시오. 반드시 JSON 형식으로만 응답해야 합니다."
          },
          {
            role: "user",
            content: `산업: ${industry}, 국가: ${country}, HS Code: ${hsCode}. 다음 구조의 JSON으로 응답하세요: { "buyers": [ { "companyName": "회사명", "country": "국가명", "email": "이메일", "industry": "산업", "matchScore": 점수(0-100), "emailDraft": "이메일초안(Subject 포함)" } ] }`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ ...result, isDemoMode: false });
  } catch (error) {
    console.error("Buyer Analysis Error:", error);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
