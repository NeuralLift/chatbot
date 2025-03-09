import { create } from 'zustand';

import { Message } from '@/types/interface/chat';

type ChatState = {
  // question: string;
  messages: Message[];

  // setQuestion: (question: string) => void;
  setMessages: (updater: Message | ((prev: Message[]) => Message[])) => void;
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

  // setQuestion: (question) => set({ question }),
}));
