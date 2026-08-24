import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockGetPrices } from "@/lib/ai/mock-responses";

const genAI = process.env.GOOGLE_GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const { medicineName } = await req.json();

    if (!medicineName?.trim()) {
      return NextResponse.json({ error: "medicineName is required" }, { status: 400 });
    }

    // ── Real Gemini-powered price lookup ──────────────────────────────────
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are a pharmaceutical pricing assistant for the Indian market.

Find indicative retail prices for: "${medicineName}"

Return ONLY a valid JSON array — no markdown, no explanation — in this exact format:
[
  {
    "id": "unique_id_1",
    "medicine_name": "${medicineName}",
    "brand": "Brand Name",
    "price": 45,
    "currency": "INR",
    "pack_size": "15 tablets",
    "retailer": "Apollo Pharmacy",
    "source": "Apollo Pharmacy (AI estimate)",
    "last_updated": "${new Date().toISOString()}"
  }
]

List 3-5 different brand/retailer combinations with realistic Indian market prices. Use real pharmacy names (Apollo, 1mg, PharmEasy, Netmeds, MedPlusMart). If the medicine is unknown, return an empty array [].

Note: These are indicative prices only. Add "(AI estimate)" to all source values.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            return NextResponse.json({ prices: parsed });
          }
        }
      } catch (err) {
        console.error("[Prices API] Gemini error:", err);
      }
    }

    // ── Fallback to mock ──────────────────────────────────────────────────
    const data = await mockGetPrices(medicineName);
    return NextResponse.json({ prices: data });
  } catch (error) {
    console.error("[Prices API] Unexpected error:", error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
