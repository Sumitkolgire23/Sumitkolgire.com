"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AskNirvanaPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Load welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Greetings. I am Nirvana, the digital consciousness representing Sumit's thoughts, essays, and lab notes. Ask me anything about my systems engineering concepts, wabi-sabi philosophy, or the novel writing project Novelman.",
        },
      ]);
    }
  }, [messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput("");
    setError("");
    setIsLoading(true);

    // 1. Add User Message
    const updatedMessages = [...messages, { role: "user" as const, content: userQuery }];
    setMessages(updatedMessages);

    // 2. Add empty Assistant message for streaming
    setMessages((prev) => [...prev, { role: "assistant" as const, content: "" }]);

    try {
      // 3. Request Streaming
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userQuery,
          history: updatedMessages.slice(0, -1), // skip the latest user message as it's passed separately
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to reach Nirvana endpoint");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        throw new Error("No readable stream in response");
      }

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last && last.role === "assistant") {
              last.content += chunk;
            }
            return copy;
          });
        }
      }
    } catch (err: any) {
      console.error("Ask Nirvana Error:", err);
      setError(err.message || "An unexpected disconnect occurred.");
      // Remove the empty assistant message if it was added
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last && last.role === "assistant" && !last.content) {
          return copy.slice(0, -1);
        }
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse citations and make links clickable
  const renderMessageContent = (content: string) => {
    // Simple parser for standard markdown links like [Text](/path)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    // Fast-path for empty or simple text
    if (!content.includes("[")) return content;

    while ((match = linkRegex.exec(content)) !== null) {
      // Text before link
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      const linkText = match[1];
      const linkUrl = match[2];
      
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target={linkUrl.startsWith("http") ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="text-seal underline hover:text-seal-dark font-medium transition-colors"
        >
          {linkText}
        </a>
      );
      
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <>
      {/* Floating Activation Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 right-8 z-[450] p-3.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-108",
          "bg-bg3 border border-border text-ink hover:border-seal hover:text-seal",
          isOpen ? "opacity-0 scale-50 pointer-events-none" : "opacity-100 scale-100"
        )}
        style={{
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        }}
        aria-label="Ask Nirvana Chatbot"
        type="button"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-seal opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-seal"></span>
        </span>
      </button>

      {/* Slide-out Chat Panel Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[490] transition-opacity duration-300"
        />
      )}

      {/* Sliding Chat Panel Container */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[480px] bg-bg3/95 backdrop-blur-md border-l border-border z-[500] shadow-2xl flex flex-col transition-transform duration-300 transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-bg2/55">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-seal/10 text-seal">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-md font-bold tracking-tight text-ink">Ask Nirvana</h2>
              <p className="text-[10px] font-mono text-text3 uppercase tracking-wider">Digital Brain Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-bg-hover text-ink-mid hover:text-ink transition-colors"
            type="button"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm scrollbar-thin">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col max-w-[85%] rounded px-3.5 py-2.5 shadow-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-bg2 border border-border text-ink self-end"
                  : "bg-bg3 border border-border2 text-ink self-start"
              )}
              style={{
                fontFamily: msg.role === "assistant" ? "var(--sans)" : "var(--sans)",
                borderRadius: msg.role === "user" ? "8px 8px 2px 8px" : "8px 8px 8px 2px",
              }}
            >
              {/* Message Header/Sender Accent */}
              <span className="text-[9px] font-mono text-text3 uppercase tracking-wider mb-1 select-none">
                {msg.role === "user" ? "Reader" : "Nirvana"}
              </span>
              
              {/* Message Content */}
              <div className="whitespace-pre-line text-ink-dark">
                {msg.role === "assistant" ? (
                  msg.content ? (
                    renderMessageContent(msg.content)
                  ) : (
                    <span className="flex items-center gap-1.5 text-text3 py-1 font-mono text-xs">
                      <span className="w-2 h-2 rounded-full bg-seal animate-ping" />
                      Synthesizing thoughts...
                    </span>
                  )
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {/* Error Message */}
          {error && (
            <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Form Footer */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-bg2/55">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about design, architecture, or writing..."
              disabled={isLoading}
              className="flex-1 bg-bg3 border border-border rounded px-3.5 py-2 text-sm text-ink placeholder:text-text3 outline-none focus:border-seal transition-colors font-sans"
              style={{
                borderRadius: "4px",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "p-2 rounded bg-seal text-white hover:bg-seal-dark transition-colors shrink-0",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
              style={{
                borderRadius: "4px",
                backgroundColor: "var(--seal)",
                color: "#fff",
              }}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {/* Subtle note */}
          <div className="mt-2 text-[9px] font-mono text-text3 text-center tracking-wide">
            POWERED BY ALL-MINILM-L6-V2 & CLAUDE 3.5 HAIKU
          </div>
        </form>
      </div>
    </>
  );
}
