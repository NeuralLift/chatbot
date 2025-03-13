import { Agent, AgentType, Prisma } from '@prisma/client';

export interface CreateNewAgent {
  (data: {
    name: string;
    description?: string;
    type: AgentType;
    model: string;
    system_prompt?: string;
    user_prompt?: string;
    prompt_variables?: Record<string, string>;
    datasourceIds?: string[];
  }): Promise<Agent>;
}

export interface GetAgent {
  (id?: string): Promise<Prisma.AgentGetPayload<{
    include: {
      datasources: {
        select: {
          datasource: true;
        };
      };
    };
  }> | null>;
}

export interface UpdateAgent {
  (
    agentId: string,
    data: {
      name?: string;
      description?: string;
      type?: AgentType;
      model?: string;
      system_prompt?: string;
      user_prompt?: string;
      prompt_variables?: Record<string, string>;
      datasourceIds?: string[];
      lastActive?: string;
    }
  ): Promise<Agent | null>;
}

export interface GetAllAgents {
  (): Promise<Agent[]>;
}

export interface DeleteAgent {
  (id: string): Promise<Agent | null>;
}

export type CreateNewAgentParams = Parameters<CreateNewAgent>[0];
