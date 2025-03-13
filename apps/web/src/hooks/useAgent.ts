import { create } from 'zustand';

type AgentState = {
  agentId: string;
  setAgent: (agentId: string) => void;
};

export const useAgentStore = create<AgentState>()((set) => ({
  agentId: window.localStorage.getItem('agent') ?? '',
  setAgent: (agentId) => {
    window.localStorage.setItem('agent', agentId);

    set({ agentId });
  },
}));
