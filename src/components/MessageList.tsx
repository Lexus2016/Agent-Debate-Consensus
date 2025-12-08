"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

export function MessageList() {
  const messages = useChatStore((state) => state.messages);
  const typingModels = useChatStore((state) => state.typingModels);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingModels]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted text-center">
          <div>
            <p className="text-lg mb-2">Welcome to AI Group Chat</p>
            <p className="text-sm">
              Select models from the sidebar and start chatting!
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </>
      )}
      <TypingIndicator />
      <div ref={bottomRef} />
    </div>
  );
}
