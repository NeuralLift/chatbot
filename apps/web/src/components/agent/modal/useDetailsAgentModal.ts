import { create } from 'zustand';

import { Agent } from '@/types/interface/agent';

interface AgentModalState {
  open: boolean;
  agent: Agent;
  setAgent: (agent: Agent) => void;
  handleOpen: () => void;
  handleClose: () => void;
}

export const useDetailsAgentModalStore = create<AgentModalState>((set) => ({
  open: false,
  agent: {
    id: '',
    name: '',
    description: '',
    _count: {
      conversations: 0,
    },
    datasources: [],
    model: '',
    system_prompt: '',
    lastActive: '',
    active: false,
    successRate: 0,
    temperature: 0,
    createdAt: '',
    datasourceIds: [],
  },
  setAgent: (agent: Agent) => set({ agent }),
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}));
