import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { ChatState, Model, Message } from "@/types/chat";
import { availableModels as defaultModels } from "@/lib/models";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  activeModels: [],
  availableModels: defaultModels,
  typingModels: [],
  contextWindowSize: 20,

  addMessage: (message) => {
    const id = uuidv4();
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id, timestamp: Date.now() },
      ],
    }));
    return id;
  },

  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content } : m
      ),
    })),

  completeMessage: (id) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, isStreaming: false } : m
      ),
    })),

  setTyping: (modelId, modelName, isTyping) =>
    set((state) => ({
      typingModels: isTyping
        ? [...state.typingModels.filter((t) => t.modelId !== modelId), { modelId, modelName }]
        : state.typingModels.filter((t) => t.modelId !== modelId),
    })),

  toggleModel: (modelId) =>
    set((state) => {
      const model = state.availableModels.find((m) => m.id === modelId);
      if (!model) return state;

      const isCurrentlyActive = state.activeModels.some(
        (m) => m.id === modelId
      );
      return {
        activeModels: isCurrentlyActive
          ? state.activeModels.filter((m) => m.id !== modelId)
          : [...state.activeModels, { ...model, isActive: true }],
      };
    }),

  setContextWindowSize: (size) => set({ contextWindowSize: size }),

  clearChat: () => set({ messages: [], typingModels: [] }),

  initializeModels: (models) => set({ availableModels: models }),
}));
