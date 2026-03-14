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

  // Stop all generation
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

  // Handle model response
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

  // Set up conversation engine handler
  useEffect(() => {
    conversationEngine.setResponseHandler(triggerModelResponse);
  }, [triggerModelResponse]);

  // Process which models should respond
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

  // Handle user message
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
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 glass border-r border-border/50 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold gradient-text leading-tight">Agent Debate</h1>
              <p className="text-[10px] text-muted leading-tight">Consensus</p>
            </div>
          </div>
        </div>

        {/* Participants section */}
        <div className="p-4 border-b border-border/50">
          <h2 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">
            Participants
          </h2>
          <ActiveModels />
        </div>

        {/* Available Agents section */}
        <div className="flex-1 overflow-y-auto p-4">
          <ModelSelector />
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-border/50 space-y-2">
          {messages.length > 0 && (
            <button
              onClick={() => {
                const md = messagesToMarkdown(messages);
                const date = new Date().toISOString().split("T")[0];
                downloadMarkdown(md, `debate-${date}.md`);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-muted hover:text-foreground border border-border/50 hover:border-border rounded-xl transition-all duration-200 hover:bg-surface-light/50 tracking-wide"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as .md
            </button>
          )}
          <button
            onClick={() => {
              clearChat();
              conversationEngine.reset();
            }}
            className="w-full px-4 py-2.5 text-xs font-medium text-muted hover:text-foreground border border-border/50 hover:border-border rounded-xl transition-all duration-200 hover:bg-surface-light/50 tracking-wide"
          >
            New Debate
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
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
