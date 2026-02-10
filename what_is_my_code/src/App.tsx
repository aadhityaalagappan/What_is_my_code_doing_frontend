import React, { useState } from "react";
import CodeInputPanel from "./components/CodeInputPanel";
import ChatThread from "./components/ChatThread";
import { explainCode } from "./api/explainApi";
import type { ChatMessage, ExplainLevel } from "./types/chat";

function uid(): string {
  return `${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(payload: { code: string; level: ExplainLevel }) {
    const { code, level } = payload;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      code,
      level,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    try {
      const data = await explainCode({ code, level });

      const assistantMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        data,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      const assistantMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        data: {
          explanation: `### Error\n\n${msg}`,
          timecomplexity: `-`,
          commonerrors: `-`,
        },
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    setMessages([]);
    setLoading(false);
  }

  return (
    <div className="h-full bg-zinc-100">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodeInputPanel loading={loading} onSubmit={handleSubmit} onClear={handleClear} />
          <ChatThread messages={messages} />
        </div>
      </div>
    </div>
  );
}
