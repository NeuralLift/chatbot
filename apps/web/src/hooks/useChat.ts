import { create } from 'zustand';

import { Message } from '@/types/interface/chat';

type ChatState = {
  // question: string;
  messages: Message[];

  // setQuestion: (question: string) => void;
  setMessages: (updater: Message | ((prev: Message[]) => Message[])) => void;
  resetMessages: () => void;
};

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  question: '',

  setMessages: (updater) =>
    set((state) => ({
      messages:
        typeof updater === 'function'
          ? updater(state.messages)
          : [...state.messages, updater],
    })),
  resetMessages: () => set({ messages: [] }),

  // setQuestion: (question) => set({ question }),
}));
