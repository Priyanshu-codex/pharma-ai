import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface ChatHistoryMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface GeminiResponseResult {
  text: string;
  sources?: GroundingSource[];
  isGrounded?: boolean;
}

export async function generateAIContent(
  prompt: string,
  systemInstruction?: string,
  history: ChatHistoryMessage[] = [],
  enableSearchGrounding: boolean = false
): Promise<GeminiResponseResult> {
  const isMockMode = process.env.NEXT_PUBLIC_AI_MODE === "mock";
  if (isMockMode || !genAI) {
    console.log("[Gemini Service] NEXT_PUBLIC_AI_MODE is 'mock' or genAI client uninitialized.");
    return { text: "" };
  }

  try {
    // Enable Google Search grounding tool if requested
    const tools = enableSearchGrounding ? [{ googleSearch: {} }] : undefined;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        systemInstruction ||
        "You are PharmaAI, an intelligent conversational AI assistant for general knowledge, coding, medicine, and clinical science.",
      // @ts-expect-error tool types
      tools,
    });

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract citations if grounding search was enabled
    const sources: GroundingSource[] = [];
    const responseObj = response as unknown as { candidates?: Array<{ groundingMetadata?: { groundingChunks?: Array<{ web?: { title?: string; uri?: string } }> } }> };
    const groundingMetadata = responseObj?.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk) => {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          });
        }
      });
    }

    return {
      text,
      sources,
      isGrounded: sources.length > 0,
    };
  } catch (error) {
    console.error("[Gemini API Error]:", error);
    return { text: "" };
  }
}
