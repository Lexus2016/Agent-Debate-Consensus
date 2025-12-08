"use client";

import { useEffect, useCallback, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import {
  conversationEngine,
  buildSystemPrompt,
  buildContextWindow,
} from "@/lib/conversationEngine";
import { streamModelResponse, stopAllStreams } from "@/lib/streamHandler";
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
    // Clear all typing indicators
    typingModels.forEach((t) => setTyping(t.modelId, t.modelName, false));
    // Mark all streaming messages as complete
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

      // Build messages for API
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

      // Create streaming message
      const messageId = addMessage({
        role: "assistant",
        content: "",
        modelId: model.id,
        modelName: model.name,
        isStreaming: true,
      });

      setTyping(modelId, model.name, false);

      let content = "";
      await streamModelResponse(modelId, apiMessages, {
        onToken: (token) => {
          content += token;
          updateMessage(messageId, content);
        },
        onComplete: () => {
          completeMessage(messageId);
          conversationEngine.completeResponse(modelId);

          // After response, check if other models should respond
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
          updateMessage(messageId, content || "[Error: Failed to get response]");
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

      // Get the message we just added
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
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-72 bg-surface border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-bold text-primary">AI Group Chat</h1>
        </div>

        <div className="p-4 border-b border-border">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            In This Chat
          </h2>
          <ActiveModels />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ModelSelector />
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => {
              clearChat();
              conversationEngine.reset();
            }}
            className="w-full px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-light rounded-lg transition-colors"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
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
