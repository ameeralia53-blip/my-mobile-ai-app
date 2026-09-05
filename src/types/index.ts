// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Code Generation Types
export interface GeneratedFile {
  name: string;
  path: string;
  content: string;
  language: 'html' | 'jsx' | 'tsx' | 'css' | 'json';
}

export interface GeneratedApp {
  id: string;
  title: string;
  description: string;
  files: GeneratedFile[];
  preview: string;
  createdAt: Date;
  updatedAt: Date;
}

// UI State Types
export interface UIState {
  activeTab: 'chat' | 'preview' | 'code';
  selectedFileIndex: number;
  isCopied: boolean;
}

// Store Types
export interface AppStore {
  // Chat
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  
  // Generated App
  currentApp: GeneratedApp | null;
  setCurrentApp: (app: GeneratedApp) => void;
  
  // UI
  ui: UIState;
  setActiveTab: (tab: UIState['activeTab']) => void;
  setSelectedFile: (index: number) => void;
  setCopied: (copied: boolean) => void;
}
