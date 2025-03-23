// import { Conversation } from './chat';
import { KnowledgeSource } from './knowledge';

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  active: boolean;
  lastActive: string;
  // conversations: number;
  successRate: number;
  // knowledgeBases: string[];
  system_prompt: string;
  createdAt: string;
  avatar?: string;
  // conversations: Conversation[];
  _count: {
    conversations: number;
  };
  datasources: KnowledgeSource[];
  datasourceIds: string[];
}
