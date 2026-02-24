import { NextResponse, NextRequest } from "next/server";

const FALLBACK_RATES = { USD: 1450, EUR: 1550, JPY: 950, CNY: 198 };

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

function calculateRates(usdToKrw: number, usdToEur: number, usdToJpy: number, usdToCny: number) {
  return {
    USD: Math.round(usdToKrw * 100) / 100,
    EUR: Math.round((usdToKrw / usdToEur) * 100) / 100,
    JPY: Math.round((usdToKrw / usdToJpy) * 100 * 100) / 100, // 100 Yen basis
    CNY: Math.round((usdToKrw / usdToCny) * 100) / 100,
  };
}

async function getLatestRates() {
  // Priority 1
  try {
    const res = await fetchWithTimeout("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      return { rates: calculateRates(data.usd.krw, data.usd.eur, data.usd.jpy, data.usd.cny), source: "fawazahmed0" };
    }
  } catch (e) {}

  // Priority 2
  try {
    const res = await fetchWithTimeout("https://latest.currency-api.pages.dev/v1/currencies/usd.json", { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      return { rates: calculateRates(data.usd.krw, data.usd.eur, data.usd.jpy, data.usd.cny), source: "fawazahmed0-fallback" };
    }
  } catch (e) {}

  // Priority 3
  try {
    const res = await fetchWithTimeout("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      return { rates: calculateRates(data.rates.KRW, data.rates.EUR, data.rates.JPY, data.rates.CNY), source: "open-er-api" };
    }
  } catch (e) {}

  return { rates: FALLBACK_RATES, source: "fallback" };
}

async function getHistoricalData() {
  const history = [];
  const today = new Date();
  
  // Create 30 days in KST
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (i + 1));
    return d.toISOString().split("T")[0];
  });

  const results = await Promise.allSettled(
    dates.map(date => 
      fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/usd.json`, { next: { revalidate: 86400 } })
        .then(res => res.ok ? res.json() : null)
    )
  );

  results.forEach((result, idx) => {
    if (result.status === "fulfilled" && result.value) {
      const data = result.value;
      history.push({
        date: dates[idx],
        ...calculateRates(data.usd.krw, data.usd.eur, data.usd.jpy, data.usd.cny)
      });
    }
  });

  return history.reverse();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeHistory = searchParams.get("history") === "true";

  try {
    const { rates, source } = await getLatestRates();
    const response: any = {
      rates,
      source,
      timestamp: new Date().toISOString()
    };

    if (includeHistory) {
      response.history = await getHistoricalData();
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      rates: FALLBACK_RATES,
      source: "fallback",
      timestamp: new Date().toISOString()
    });
  }
}
