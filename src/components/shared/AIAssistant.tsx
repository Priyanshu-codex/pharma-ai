"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { mockChatResponse } from "@/lib/ai/mock-responses";
import { MedDisclaimer } from "@/components/shared/MedDisclaimer";
import { generateId } from "@/lib/utils";
import type { ChatMessage, UserRole } from "@/lib/types";

const PATIENT_SUGGESTIONS = [
  "What is Paracetamol used for?",
  "Can I take ibuprofen with blood pressure medication?",
  "How do I manage missed doses?",
  "What are common side effects of Metformin?",
];

const STUDENT_SUGGESTIONS = [
  "Explain the mechanism of beta-blockers",
  "What is the difference between agonists and antagonists?",
  "How do ACE inhibitors work?",
  "What drugs interact with warfarin?",
];

interface AIAssistantProps {
  mode: UserRole;
}

export function AIAssistant({ mode }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      role: "assistant",
      content:
        mode === "patient"
          ? "Hello! 👋 I'm your PharmaAI health assistant. I can help you understand your medicines, explain prescriptions, and answer general pharmaceutical questions.\n\n⚠️ I'm here for information only — please consult your doctor or pharmacist for medical advice."
          : "Welcome! 🎓 I'm your PharmaAI study assistant. I can help you understand drug mechanisms, interactions, clinical pharmacology, and quiz you on pharmaceutical concepts.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content.trim(),
          history: historyPayload,
          role: mode,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const responseText = data.text || (await mockChatResponse([...messages, userMessage], mode));
      const extractedSources: string[] = data.sources
        ? data.sources.map((s: { title?: string; uri?: string }) => s.title || s.uri || "")
        : [];

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: responseText,
        timestamp: new Date().toISOString(),
        sources: extractedSources.filter(Boolean),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Something went wrong while fetching response. Click **Retry** below to resend.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function clearChat() {
    setMessages([
      {
        id: generateId(),
        role: "assistant",
        content:
          mode === "patient"
            ? "Chat cleared. How can I help you today?"
            : "Chat cleared. What would you like to study today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  const suggestions = mode === "patient" ? PATIENT_SUGGESTIONS : STUDENT_SUGGESTIONS;
  const showSuggestions = messages.length === 1;

  return (
    <div className="flex flex-col h-[calc(100vh-var(--bottom-nav-height)-var(--safe-bottom))] md:h-[calc(100vh-var(--top-nav-height))] bg-[var(--color-surface)] max-w-4xl mx-auto md:my-4 md:rounded-2xl md:border md:border-[var(--color-border)] md:shadow-lg overflow-hidden">
      {/* Header */}
      <div
        style={{
          background: "var(--color-bg)",
          padding: "14px 20px",
          borderBottom: "1px solid var(--color-border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: "var(--color-primary)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 3px var(--color-primary-100)",
            }}
          >
            <Bot size={20} style={{ color: "white" }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)" }}>
              PharmaAI Assistant
            </p>
            <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
              {mode === "patient" ? "Health information" : "Pharmacy education"} · Always online
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            padding: 6,
          }}
          aria-label="Clear chat"
        >
          <RefreshCw size={17} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {/* Suggested Questions */}
        {showSuggestions && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 500 }}>
              Suggested questions
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-full)",
                    padding: "8px 14px",
                    fontSize: 12,
                    color: "var(--color-text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--color-primary-light)";
                    (e.target as HTMLElement).style.color = "var(--color-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--color-border)";
                    (e.target as HTMLElement).style.color = "var(--color-text-secondary)";
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((message, idx) => {
          const isLast = idx === messages.length - 1;
          const isError = message.content.includes("Something went wrong");
          const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content;
          return (
            <MessageBubble
              key={message.id}
              message={message}
              onRetry={isLast && isError && lastUserMsg ? () => sendMessage(lastUserMsg) : undefined}
            />
          );
        })}

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", gap: 10 }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "var(--color-primary)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bot size={16} style={{ color: "white" }} />
            </div>
            <div
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "0 var(--radius-lg) var(--radius-lg) var(--radius-lg)",
                padding: "12px 16px",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
              aria-label="Assistant is typing"
            >
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Disclaimer */}
      <div style={{ padding: "0 16px 8px", flexShrink: 0 }}>
        <MedDisclaimer />
      </div>

      {/* Input Area */}
      <div
        style={{
          background: "var(--color-bg)",
          borderTop: "1px solid var(--color-border-light)",
          padding: "12px 16px",
          flexShrink: 0,
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            background: "var(--color-surface-alt)",
            borderRadius: "var(--radius-xl)",
            padding: "8px 8px 8px 16px",
            border: "1.5px solid var(--color-border)",
            transition: "border-color 0.2s",
          }}
          onFocus={() => {}}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "patient"
                ? "Ask about any medicine..."
                : "Ask a pharmacology question..."
            }
            rows={1}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 14,
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-sans)",
              maxHeight: 100,
              lineHeight: 1.5,
            }}
            aria-label="Message input"
          />

          {/* Voice button */}
          <button
            onClick={() => setIsListening((v) => !v)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: isListening ? "var(--color-error)" : "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              color: isListening ? "white" : "var(--color-text-muted)",
              transition: "all 0.2s",
            }}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Send button */}
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: input.trim() ? "var(--color-primary)" : "var(--color-border)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() ? "pointer" : "default",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={16} style={{ color: "white", animation: "spin 1s linear infinite" }} />
            ) : (
              <Send size={16} style={{ color: input.trim() ? "white" : "var(--color-text-muted)" }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Message Bubble Component ──────────────────────────────
function MessageBubble({ message, onRetry }: { message: ChatMessage; onRetry?: () => void }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: "flex",
        gap: 10,
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
      }}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            background: "var(--color-primary)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Bot size={16} style={{ color: "white" }} />
        </div>
      )}

      {/* Bubble */}
      <div
        style={{
          maxWidth: "78%",
          background: isUser ? "var(--color-primary)" : "var(--color-bg)",
          color: isUser ? "white" : "var(--color-text-primary)",
          borderRadius: isUser
            ? "var(--radius-lg) var(--radius-lg) 4px var(--radius-lg)"
            : "4px var(--radius-lg) var(--radius-lg) var(--radius-lg)",
          padding: "10px 14px",
          fontSize: 14,
          lineHeight: 1.6,
          border: isUser ? "none" : "1px solid var(--color-border)",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {/* Render bold & heading markdown */}
        {message.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i}>{part}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
        {/* Citations / Grounding sources */}
        {message.sources && message.sources.length > 0 && (
          <div
            style={{
              marginTop: 10,
              paddingTop: 8,
              borderTop: "1px solid var(--color-border-light)",
              fontSize: 11,
              color: "var(--color-text-muted)",
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: 4 }}>📌 Web Grounding Sources:</p>
            {message.sources.map((src, idx) => (
              <p key={idx} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                · {src}
              </p>
            ))}
          </div>
        )}
        {onRetry && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={onRetry}
              className="btn-secondary"
              style={{
                padding: "4px 10px",
                fontSize: 12,
                borderRadius: "var(--radius-sm)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            background: "var(--color-primary-100)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <User size={16} style={{ color: "var(--color-primary)" }} />
        </div>
      )}
    </motion.div>
  );
}
