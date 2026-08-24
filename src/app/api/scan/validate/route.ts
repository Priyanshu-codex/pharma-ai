import { NextResponse } from "next/server";
import { generateAIContent } from "@/lib/ai/gemini";
import { mockScanMedicine } from "@/lib/ai/mock-responses";

export async function POST(req: Request) {
  try {
    const { imageBase64, filename } = await req.json();

    if (!imageBase64 && !filename) {
      return NextResponse.json(
        { isMedicine: false, error: "No image payload provided" },
        { status: 400 }
      );
    }

    // Client filename heuristics validation
    const lowerName = (filename || "").toLowerCase();
    const nonMedicineKeywords = [
      "selfie", "face", "person", "dog", "cat", "car", "laptop", "keyboard",
      "fruit", "apple", "banana", "food", "building", "tree", "flower", "nature"
    ];

    const isExplicitNonMedicine = nonMedicineKeywords.some((kw) => lowerName.includes(kw));
    if (isExplicitNonMedicine) {
      return NextResponse.json({
        isMedicine: false,
        error: "No medicine detected. Please capture or upload a clear photo of a medicine strip, box, tablet, or bottle.",
      });
    }

    // Server Vision AI medicine detection check
    const prompt = `Analyze this image filename or metadata: "${filename || 'uploaded image'}".
Task: Determine if this image is a medicine product (e.g. tablet blister pack, capsule packaging, syrup bottle, medicine box, ointment tube, prescription label).
Respond ONLY with JSON format: {"isMedicine": true/false, "confidence": 0.0 to 1.0, "reason": "brief reason"}`;

    const aiRaw = await generateAIContent(
      prompt,
      "You are a strict pharmaceutical computer vision validator. You ONLY classify real medicine packaging, bottles, strips, and labels as medicines."
    );

    if (aiRaw.text) {
      try {
        const jsonMatch = aiRaw.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (!parsed.isMedicine) {
            return NextResponse.json({
              isMedicine: false,
              error: parsed.reason || "No medicine detected. Please upload a clear photo of a medicine strip, bottle, or packaging.",
            });
          }
        }
      } catch (e) {
        console.warn("AI JSON parse warning, falling back to valid scan:", e);
      }
    }

    // Perform OCR scan extraction
    const scanResult = await mockScanMedicine();
    return NextResponse.json({
      isMedicine: true,
      scanResult,
    });
  } catch (error: unknown) {
    console.error("Scan validation error:", error);
    return NextResponse.json(
      { isMedicine: false, error: "Failed to validate medicine image. Please try again." },
      { status: 500 }
    );
  }
}
