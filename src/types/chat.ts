export interface Model {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  color: string;
  isActive: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelId?: string;
  modelName?: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface TypingState {
  modelId: string;
  modelName: string;
}

export interface ChatState {
  messages: Message[];
  activeModels: Model[];
  availableModels: Model[];
  typingModels: TypingState[];
  contextWindowSize: number;

  addMessage: (message: Omit<Message, "id" | "timestamp">) => string;
  updateMessage: (id: string, content: string) => void;
  completeMessage: (id: string) => void;
  setTyping: (modelId: string, modelName: string, isTyping: boolean) => void;
  toggleModel: (modelId: string) => void;
  setContextWindowSize: (size: number) => void;
  clearChat: () => void;
  initializeModels: (models: Model[]) => void;
}
