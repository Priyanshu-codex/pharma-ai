import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockScanMedicine } from "@/lib/ai/mock-responses";

const genAI = process.env.GOOGLE_GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
  : null;

const MEDICINE_VISION_PROMPT = `You are an expert pharmaceutical AI trained to extract structured information from medicine packaging images.

Analyze this image and extract medicine information. The image should show medicine packaging, a pill strip/blister pack, a medicine bottle, box, or label.

Respond ONLY with a valid JSON object in the following exact format — no explanation, no markdown, just raw JSON:

{
  "isMedicine": true,
  "confidence": 0.85,
  "medicine": {
    "name": "Full medicine name with strength e.g. Paracetamol 500mg",
    "generic_name": "Generic/INN drug name",
    "brand_name": "Brand name if visible",
    "manufacturer": "Manufacturer name if visible",
    "active_ingredient": "Active ingredient(s)",
    "strength": "Strength e.g. 500mg",
    "dosage_form": "Tablet/Capsule/Syrup/Injection etc.",
    "description": "Brief one-sentence description of what this medicine is for",
    "uses": ["Use 1", "Use 2"],
    "side_effects": ["Side effect 1", "Side effect 2"],
    "warnings": ["Warning 1"],
    "data_source": "Gemini Vision OCR"
  }
}

If the image is NOT a medicine (e.g. food, person, object, landscape), respond with:
{"isMedicine": false, "confidence": 0.0, "reason": "Not a medicine image"}

If the image IS a medicine but text is unclear, still return isMedicine: true with the best guesses and a lower confidence (0.5–0.7).`;

export async function POST(req: Request) {
  try {
    const { imageBase64, filename } = await req.json();

    if (!imageBase64 && !filename) {
      return NextResponse.json(
        { isMedicine: false, error: "No image payload provided" },
        { status: 400 }
      );
    }

    // ── Filename pre-filter heuristic (quick reject for obvious non-medicines) ──
    const lowerName = (filename || "").toLowerCase();
    const nonMedicineKeywords = [
      "selfie", "face", "person", "dog", "cat", "car", "laptop", "keyboard",
      "fruit", "apple", "banana", "food", "building", "tree", "flower", "nature",
    ];
    const isExplicitNonMedicine = nonMedicineKeywords.some((kw) => lowerName.includes(kw));
    if (isExplicitNonMedicine) {
      return NextResponse.json({
        isMedicine: false,
        error: "No medicine detected. Please capture or upload a clear photo of a medicine strip, box, tablet, or bottle.",
      });
    }

    // ── Real Gemini Vision Analysis ──────────────────────────────────────────
    if (genAI && imageBase64) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Strip the data: prefix if present (e.g. "data:image/jpeg;base64,...")
        const base64Data = imageBase64.includes(",")
          ? imageBase64.split(",")[1]
          : imageBase64;

        // Detect MIME type from data URL or default to jpeg
        const mimeType = imageBase64.startsWith("data:image/png")
          ? "image/png"
          : imageBase64.startsWith("data:image/webp")
          ? "image/webp"
          : "image/jpeg";

        const result = await model.generateContent([
          MEDICINE_VISION_PROMPT,
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
        ]);

        const responseText = result.response.text();

        if (process.env.NODE_ENV === "development") {
          console.log("[Scan API] Gemini Vision raw response:", responseText.substring(0, 300));
        }

        // Parse JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);

          if (!parsed.isMedicine) {
            return NextResponse.json({
              isMedicine: false,
              error: parsed.reason || "No medicine detected. Please upload a clear photo of a medicine strip, bottle, or packaging.",
            });
          }

          // Build a full ScanResult from the AI response
          const medicine = parsed.medicine || {};
          const confidence = Math.min(Math.max(parsed.confidence || 0.8, 0), 1);

          return NextResponse.json({
            isMedicine: true,
            scanResult: {
              confidence,
              medicine: {
                id: `scan_${Date.now()}`,
                name: medicine.name || "Unknown Medicine",
                generic_name: medicine.generic_name || medicine.name || "",
                brand_name: medicine.brand_name || "",
                manufacturer: medicine.manufacturer || "",
                active_ingredient: medicine.active_ingredient || medicine.generic_name || "",
                strength: medicine.strength || "",
                dosage_form: medicine.dosage_form || "Tablet",
                description: medicine.description || "",
                uses: Array.isArray(medicine.uses) ? medicine.uses : [],
                side_effects: Array.isArray(medicine.side_effects) ? medicine.side_effects : [],
                warnings: Array.isArray(medicine.warnings) ? medicine.warnings : [],
                data_source: "Gemini Vision OCR",
              },
            },
          });
        }
      } catch (visionError) {
        console.error("[Scan API] Gemini Vision error:", visionError);
        // Fall through to mock below
      }
    }

    // ── Fallback: filename-based AI text analysis (if no imageBase64) ────────
    if (genAI && !imageBase64 && filename) {
      const prompt = `Analyze this medicine filename: "${filename}". Is it likely a medicine image? Respond ONLY with JSON: {"isMedicine": true/false, "confidence": 0.0-1.0, "reason": "brief reason"}`;
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (!parsed.isMedicine) {
            return NextResponse.json({
              isMedicine: false,
              error: parsed.reason || "No medicine detected.",
            });
          }
        }
      } catch (e) {
        console.warn("[Scan API] Filename AI fallback warning:", e);
      }
    }

    // ── Final fallback: mock scan response ───────────────────────────────────
    console.warn("[Scan API] Using mock scan fallback (no image provided or Gemini unavailable).");
    const scanResult = await mockScanMedicine();
    return NextResponse.json({ isMedicine: true, scanResult });
  } catch (error: unknown) {
    console.error("[Scan API] Unexpected error:", error);
    return NextResponse.json(
      { isMedicine: false, error: "Failed to validate medicine image. Please try again." },
      { status: 500 }
    );
  }
}
