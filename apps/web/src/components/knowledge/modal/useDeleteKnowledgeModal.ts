import { create } from 'zustand';

import { KnowledgeSource } from '@/types/interface/knowledge';

interface KnowledgeModalState {
  open: boolean;
  source?: KnowledgeSource;
  setSource: (source: KnowledgeSource) => void;
  handleOpen: () => void;
  handleClose: () => void;
}

export const useDeleteKnowledgeModalStore = create<KnowledgeModalState>(
  (set) => ({
    open: false,
    setSource: (source) => set({ source }),
    handleOpen: () => set({ open: true }),
    handleClose: () => set({ open: false, source: undefined }),
  })
);
