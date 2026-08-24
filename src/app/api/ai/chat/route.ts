import { NextResponse } from "next/server";
import { generateAIContent, ChatHistoryMessage } from "@/lib/ai/gemini";
import { mockChatResponse } from "@/lib/ai/mock-responses";
import { ChatMessage } from "@/lib/types";

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

    // Intent detection to selectively enable web search grounding when real-time / current info is required
    const needsSearchGrounding =
      query.includes("latest") ||
      query.includes("current") ||
      query.includes("news") ||
      query.includes("price") ||
      query.includes("today") ||
      query.includes("version") ||
      query.includes("who is the current") ||
      query.includes("prime minister") ||
      query.includes("president");

    const systemInstruction =
      role === "student"
        ? `You are PharmaAI, a clinical pharmacology tutor and versatile AI study assistant.
You possess full general knowledge (coding, science, general facts, Hindi/Hinglish, technology) in addition to clinical pharmacology.
When answering medicine/drug queries, identify the drug (handling misspellings e.g. "cetrizine" -> Cetirizine) and provide:
1. Active ingredient and drug class
2. Mechanism of action & pharmacokinetics (ADME)
3. Main therapeutic indications & side effects
For general or coding questions, answer directly and accurately without forcing medicine topics.`
        : `You are PharmaAI, an intelligent, empathetic AI assistant for patients and general users.
You can answer ANY reasonable question (medicine, general knowledge, coding, current events, Hindi/Hinglish).
When answering medicine queries, provide:
1. What the medicine is and its primary uses
2. Common side effects & precautions
Never diagnose conditions or prescribe medications. Never return generic non-specific answers when a question is asked.
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
