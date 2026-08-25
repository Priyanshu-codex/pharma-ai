import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockGetAlternatives } from "@/lib/ai/mock-responses";

const genAI = process.env.GOOGLE_GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const { ingredient, strength } = await req.json();

    if (!ingredient?.trim()) {
      return NextResponse.json({ error: "ingredient is required" }, { status: 400 });
    }

    // ── Real Gemini-powered alternatives lookup ────────────────────────────
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are a pharmaceutical pricing and generic alternative database assistant for the Indian market.

Find generic alternatives and price comparison data for: "${ingredient}${strength ? ` ${strength}` : ""}"

Return ONLY a valid JSON array — no markdown, no explanation — in this exact format:
[
  {
    "id": "unique_id_1",
    "name": "Brand/Generic Name",
    "manufacturer": "Manufacturer Name",
    "active_ingredient": "${ingredient}",
    "strength": "${strength || ""}",
    "dosage_form": "Tablet/Capsule/Syrup",
    "price": 18,
    "original_price": 45,
    "savings": 27,
    "savings_percentage": 60,
    "currency": "INR",
    "pack_size": "10 tablets",
    "availability": "Available",
    "data_source": "Indian Pharmacopoeia / CDSCO",
    "last_updated": "${new Date().toISOString()}",
    "retailers": [
      { "name": "Apollo Pharmacy", "price": 18 },
      { "name": "1mg", "price": 16 },
      { "name": "PharmEasy", "price": 17 }
    ]
  }
]

List 3-5 real Indian-market generic alternatives with realistic prices and estimated brand savings. Use accurate manufacturer names. If the ingredient is unknown, return an empty array [].`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            return NextResponse.json({ alternatives: parsed });
          }
        }
      } catch (err) {
        console.error("[Alternatives API] Gemini error:", err);
      }
    }

    // ── Fallback to mock ──────────────────────────────────────────────────
    const data = await mockGetAlternatives(ingredient, strength || "");
    return NextResponse.json({ alternatives: data });
  } catch (error) {
    console.error("[Alternatives API] Unexpected error:", error);
    return NextResponse.json({ error: "Failed to fetch alternatives" }, { status: 500 });
  }
}
