import { NextResponse } from "next/server";
import { generateAIContent, ChatHistoryMessage } from "@/lib/ai/gemini";
import { mockChatResponse } from "@/lib/ai/mock-responses";
import { ChatMessage } from "@/lib/types";

import { findMedicineByNameOrIngredient } from "@/lib/data/medicines";

export async function POST(req: Request) {
  try {
    const { message, history, role, userContext } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: "Message exceeds maximum length of 2000 characters" }, { status: 400 });
    }

    const query = message.trim().toLowerCase();
    const matchedMed = findMedicineByNameOrIngredient(query);

    // Intent detection to selectively enable web search grounding when real-time / current info is required
    const needsSearchGrounding =
      query.includes("latest") ||
      query.includes("current") ||
      query.includes("news") ||
      query.includes("today") ||
      query.includes("version") ||
      query.includes("who is the current") ||
      query.includes("prime minister") ||
      query.includes("president");

    const datasetContext = matchedMed
      ? `[PharmaAI Demo Database Record for "${matchedMed.name}"]:
- Category: ${matchedMed.category}
- Active Ingredient: ${matchedMed.activeIngredient}
- Strength & Form: ${matchedMed.strength} (${matchedMed.dosageForm})
- Brand / Manufacturer: ${matchedMed.brandName} (${matchedMed.manufacturer})
- Primary Uses: ${matchedMed.uses.join("; ")}
- Demo Price: ₹${matchedMed.price} (Original Brand: ₹${matchedMed.originalPrice}, Save ₹${matchedMed.savings} / ${matchedMed.savingsPercentage}%)
- Availability: ${matchedMed.availability}
- Common Side Effects: ${matchedMed.sideEffects.join("; ")}
- Warnings / Precautions: ${matchedMed.warnings.join("; ")}
- Storage: ${matchedMed.storage}
- Generic Alternatives: ${matchedMed.alternatives.map((a) => `${a.name} by ${a.manufacturer} (₹${a.price})`).join(", ")}`
      : "";

    const systemInstruction =
      role === "student"
        ? `You are PharmaAI, a clinical pharmacology tutor and versatile AI study assistant.
${datasetContext ? `Matched Database Record:\n${datasetContext}\nProvide comprehensive clinical explanations referencing this record when relevant.` : "Answer clinical pharmacology queries clearly."}
1. Active ingredient, drug class, and therapeutic category
2. Mechanism of action & pharmacokinetics (ADME)
3. Indications, side effects, and precautions`
        : `You are PharmaAI, an intelligent, empathetic AI assistant for patients and health-conscious users.
${datasetContext ? `Matched Database Record:\n${datasetContext}\nInclude relevant details from the database record above and note "[Source: PharmaAI Demo Database]".` : "Provide clear, educational medical information and note '[Source: General Medical Knowledge]'."}
Safety Rules:
1. Provide educational information clearly and helpfully.
2. Do NOT act as a prescribing physician or diagnose conditions.
3. Advise users to consult their healthcare professional for personalized medical decisions.
4. If asked about generic alternatives or prices, mention that users can view full comparison details on the Generic Alternatives page.
${userContext ? `Patient Context: ${JSON.stringify(userContext)}` : ""}`;

    // Convert client chat history to Gemini history format (max last 10 messages)
    const formattedHistory: ChatHistoryMessage[] = Array.isArray(history)
      ? history.slice(-10).map((msg: { role: string; content: string }) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }))
      : [];

    console.log(`[API Route /api/ai/chat] Request Received. Query: "${message.trim()}", Grounding: ${needsSearchGrounding}`);

    const aiResult = await generateAIContent(message.trim(), systemInstruction, formattedHistory, needsSearchGrounding);

    if (aiResult.text) {
      console.log(`[API Route /api/ai/chat] Gemini API Success. Text length: ${aiResult.text.length}`);
      return NextResponse.json({
        text: aiResult.text,
        sources: aiResult.sources || [],
        source: "gemini-live",
      });
    }

    // Smart Fallback Engine
    console.warn(`[API Route /api/ai/chat] Gemini API yielded empty response or fallback mode active.`);
    const clientHistory: ChatMessage[] = Array.isArray(history)
      ? history.map((h, i) => ({
          id: `hist-${i}`,
          role: h.role === "user" ? "user" : "assistant",
          content: h.content,
          timestamp: new Date().toISOString(),
        }))
      : [];

    const userMsg: ChatMessage = {
      id: "curr-msg",
      role: "user",
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    const fallbackText = await mockChatResponse([...clientHistory, userMsg], role || "patient");
    return NextResponse.json({ text: fallbackText, source: "fallback" });
  } catch (error: unknown) {
    console.error("AI Assistant Route Error:", error);
    return NextResponse.json({ error: "Something went wrong while processing your AI request. Please try again." }, { status: 500 });
  }
}
