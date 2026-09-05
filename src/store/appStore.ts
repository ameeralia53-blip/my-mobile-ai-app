import { create } from 'zustand'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: number
}

export interface GeneratedCode {
  html: string
  css: string
  js: string
}

interface AppStore {
  messages: Message[]
  generatedCode: GeneratedCode
  loading: boolean
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setGeneratedCode: (code: GeneratedCode) => void
  setLoading: (loading: boolean) => void
  clearChat: () => void
  clearCode: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  messages: [
    {
      id: '1',
      text: 'مرحباً! 👋 أنا مُنشئ التطبيقات الذكي. صف لي فكرة تطبيقك وسأقوم بإنشاء واجهة عمل كاملة لك!\n\nHello! 👋 I\'m your AI app builder. Describe your app idea and I\'ll generate a fully working interface for you!',
      sender: 'assistant',
      timestamp: Date.now(),
    },
  ],
  generatedCode: {
    html: '',
    css: '',
    js: '',
  },
  loading: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
        },
      ],
    })),
  setGeneratedCode: (code) => set({ generatedCode: code }),
  setLoading: (loading) => set({ loading }),
  clearChat: () =>
    set({
      messages: [
        {
          id: '1',
          text: 'Chat cleared. Ready for a new app idea! 🚀',
          sender: 'assistant',
          timestamp: Date.now(),
        },
      ],
    }),
  clearCode: () =>
    set({
      generatedCode: {
        html: '',
        css: '',
        js: '',
      },
    }),
}))
