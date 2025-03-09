import { create } from 'zustand';

import { Agent } from '@/types/interface/agent';

interface AgentModalState {
  open: boolean;
  agent?: Agent;
  setAgent: (agent: Agent) => void;
  handleOpen: () => void;
  handleClose: () => void;
}

export const useDeleteAgentModalStore = create<AgentModalState>((set) => ({
  open: false,
  setAgent: (agent) => set({ agent }),
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false, agent: undefined }),
}));
