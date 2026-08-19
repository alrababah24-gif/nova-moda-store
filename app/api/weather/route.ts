import { NextResponse } from "next/server";

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=31.9539&longitude=35.9106&current=temperature_2m,weather_code,is_day&timezone=Asia%2FAmman";

export const revalidate = 600;

export async function GET() {
  try {
    const response = await fetch(WEATHER_URL, { cache: "force-cache" });
    if (!response.ok) throw new Error(`Weather provider returned ${response.status}`);
    const data = await response.json();
    return NextResponse.json(
      {
        temperature: data?.current?.temperature_2m ?? null,
        weatherCode: data?.current?.weather_code ?? null,
        isDay: data?.current?.is_day ?? null,
        provider: "Open-Meteo",
      },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=900" } },
    );
  } catch {
    return NextResponse.json({ temperature: null, weatherCode: null, isDay: null, provider: "Open-Meteo" }, { status: 200 });
  }
}
