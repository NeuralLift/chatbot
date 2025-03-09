import { create } from 'zustand';

import { KnowledgeSource } from '@/types/interface/knowledge';

interface KnowledgeModalState {
  open: boolean;
  source?: KnowledgeSource;
  setSource: (source: KnowledgeSource) => void;
  handleOpen: () => void;
  handleClose: () => void;
}

export const useKnowledgeModalStore = create<KnowledgeModalState>((set) => ({
  open: false,
  source: undefined,
  setSource: (source: KnowledgeSource) => set({ source }),
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false, source: undefined }),
}));
