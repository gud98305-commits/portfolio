import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { keyword, country } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;
    const isDemoMode = !apiKey;

    if (isDemoMode) {
      const demoResponse = {
        isDemoMode: true,
        min: 19.99,
        max: 89.00,
        average: 45.50,
        currency: "USD",
        products: [
          { title: `${keyword} - Premium A`, price: 89.00, currency: "USD", rating: 4.8, reviewCount: 1240, link: "#" },
          { title: `${keyword} - Standard B`, price: 45.00, currency: "USD", rating: 4.5, reviewCount: 890, link: "#" },
          { title: `${keyword} - Budget C`, price: 19.99, currency: "USD", rating: 4.2, reviewCount: 340, link: "#" },
          { title: `${keyword} - ECO Friendly D`, price: 55.00, currency: "USD", rating: 4.7, reviewCount: 560, link: "#" },
          { title: `${keyword} - Value Pack E`, price: 29.50, currency: "USD", rating: 4.3, reviewCount: 120, link: "#" },
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
            content: "당신은 글로벌 이커머스 가격 분석 전문가입니다. 주어진 키워드와 국가의 온라인 시장 가격(최저, 최고, 평균)과 경쟁 제품 5개를 분석하십시오. 반드시 JSON 형식으로만 응답해야 합니다."
          },
          {
            role: "user",
            content: `키워드: ${keyword}, 국가: ${country}. 다음 구조의 JSON으로 응답하세요: { "min": 최저가(숫자), "max": 최고가(숫자), "average": 평균가(숫자), "currency": "화폐단위", "products": [ { "title": "제품명", "price": 가격(숫자), "currency": "화폐단위", "rating": 평점(0-5), "reviewCount": 리뷰수, "link": "링크" } ] }`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ ...result, isDemoMode: false });
  } catch (error) {
    console.error("Pricing Analysis Error:", error);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
