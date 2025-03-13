import { create } from 'zustand';

import { Conversation } from '@/types/interface/chat';

interface ConversationModalState {
  open: boolean;
  conversation?: Conversation;
  setConversation: (conversation: Conversation) => void;
  handleOpen: () => void;
  handleClose: () => void;
}

export const useDeleteConversationModalStore = create<ConversationModalState>(
  (set) => ({
    open: false,
    setConversation: (conversation) => set({ conversation }),
    handleOpen: () => set({ open: true }),
    handleClose: () => set({ open: false, conversation: undefined }),
  })
);
