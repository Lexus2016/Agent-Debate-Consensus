"use client";

import { useEffect, useCallback, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import {
  conversationEngine,
  buildSystemPrompt,
  buildContextWindow,
} from "@/lib/conversationEngine";
import { streamModelResponse, stopAllStreams } from "@/lib/streamHandler";
import { messagesToMarkdown, downloadMarkdown } from "@/lib/exportChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ModelSelector } from "./ModelSelector";
import { ActiveModels } from "./ActiveModels";
import { Message } from "@/types/chat";

export function ChatContainer() {
  const addMessage = useChatStore((state) => state.addMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const completeMessage = useChatStore((state) => state.completeMessage);
  const setTyping = useChatStore((state) => state.setTyping);
  const activeModels = useChatStore((state) => state.activeModels);
  const typingModels = useChatStore((state) => state.typingModels);
  const contextWindowSize = useChatStore((state) => state.contextWindowSize);
  const clearChat = useChatStore((state) => state.clearChat);
  const messages = useChatStore((state) => state.messages);

  const isGenerating = typingModels.length > 0 || messages.some((m) => m.isStreaming);

  const handleStop = useCallback(() => {
    stopAllStreams();
    conversationEngine.reset();
    typingModels.forEach((t) => setTyping(t.modelId, t.modelName, false));
    messages.forEach((m) => {
      if (m.isStreaming) {
        completeMessage(m.id);
      }
    });
  }, [typingModels, messages, setTyping, completeMessage]);

  const triggerModelResponse = useCallback(
    async (modelId: string) => {
      const state = useChatStore.getState();
      const model = state.activeModels.find((m) => m.id === modelId);
      if (!model) {
        conversationEngine.completeResponse(modelId);
        return;
      }

      setTyping(modelId, model.name, true);

      const systemPrompt = buildSystemPrompt(model, state.activeModels);
      const contextMessages = buildContextWindow(
        state.messages,
        contextWindowSize,
        model
      );

      const apiMessages = [
        { role: "system" as const, content: systemPrompt },
        ...contextMessages,
      ];

      const messageId = addMessage({
        role: "assistant",
        content: "",
        modelId: model.id,
        modelName: model.name,
        isStreaming: true,
      });

      setTyping(modelId, model.name, false);

      let content = "";
      let reasoning = "";
      await streamModelResponse(modelId, apiMessages, {
        onToken: (token, reasoningToken) => {
          if (token) content += token;
          if (reasoningToken) reasoning += reasoningToken;
          updateMessage(messageId, content, reasoning);
        },
        onComplete: () => {
          completeMessage(messageId);
          conversationEngine.completeResponse(modelId);

          const latestState = useChatStore.getState();
          const latestMessage = latestState.messages.find(
            (m) => m.id === messageId
          );
          if (latestMessage) {
            processModelResponses(latestMessage);
          }
        },
        onError: (error) => {
          console.error("Stream error:", error);
          updateMessage(messageId, content || "[Error: Failed to get response]", reasoning);
          completeMessage(messageId);
          conversationEngine.completeResponse(modelId);
        },
      });
    },
    [addMessage, updateMessage, completeMessage, setTyping, contextWindowSize]
  );

  useEffect(() => {
    conversationEngine.setResponseHandler(triggerModelResponse);
  }, [triggerModelResponse]);

  const processModelResponses = useCallback(
    (latestMessage: Message) => {
      const state = useChatStore.getState();

      for (const model of state.activeModels) {
        const decision = conversationEngine.analyzeForResponse(
          model,
          state.messages,
          latestMessage,
          state.activeModels
        );

        if (decision.shouldRespond) {
          conversationEngine.queueResponse(model.id, decision.delay, decision.priority);
        }
      }
    },
    []
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      if (activeModels.length === 0) {
        return;
      }

      const messageId = addMessage({
        role: "user",
        content,
      });

      setTimeout(() => {
        const state = useChatStore.getState();
        const userMessage = state.messages.find((m) => m.id === messageId);
        if (userMessage) {
          processModelResponses(userMessage);
        }
      }, 0);
    },
    [addMessage, activeModels, processModelResponses]
  );

  return (
    <div className="h-screen flex overflow-hidden">
      {/* macOS-style sidebar */}
      <div className="w-[260px] flex-shrink-0 vibrancy border-r border-white/[0.06] flex flex-col">
        {/* App header */}
        <div className="h-[52px] flex items-center gap-2.5 px-4 border-b border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold tracking-[-0.01em]">Agent Debate</span>
        </div>

        {/* Participants */}
        <div className="px-3 pt-4 pb-2">
          <h2 className="px-2 text-[11px] font-medium text-muted uppercase tracking-[0.05em] mb-2.5">
            Participants
          </h2>
          <ActiveModels />
        </div>

        {/* Agents list */}
        <div className="flex-1 overflow-y-auto px-3 pt-1">
          <ModelSelector />
        </div>

        {/* Bottom toolbar */}
        <div className="px-3 py-3 border-t border-white/[0.06] flex gap-1.5">
          {messages.length > 0 && (
            <button
              onClick={() => {
                const md = messagesToMarkdown(messages);
                const date = new Date().toISOString().split("T")[0];
                downloadMarkdown(md, `debate-${date}.md`);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 h-[30px] text-[12px] text-muted hover:text-foreground rounded-lg hover:bg-white/[0.05] transition-colors duration-150"
              title="Export debate as Markdown"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Export
            </button>
          )}
          <button
            onClick={() => {
              clearChat();
              conversationEngine.reset();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 h-[30px] text-[12px] text-muted hover:text-foreground rounded-lg hover:bg-white/[0.05] transition-colors duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Debate
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <MessageList />
        <ChatInput
          onSend={handleSendMessage}
          onStop={handleStop}
          disabled={activeModels.length === 0}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
