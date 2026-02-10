import React, { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat";
import MessageUser from "./MessageUser";
import MessageAssistant from "./MessageAssistant";

export default function ChatThread({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-4 h-[calc(100vh-2rem)] overflow-auto">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-zinc-500 text-sm">
            Paste code on the left and click <b>Dissect</b>.
          </div>
        ) : (
          messages.map((m) =>
            m.role === "user" ? (
              <MessageUser key={m.id} code={m.code} level={m.level} />
            ) : (
              <MessageAssistant key={m.id} data={m.data} />
            )
          )
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
