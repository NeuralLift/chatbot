import { Agent } from '@/types/interface/agent';
import { Conversation } from '@/types/interface/chat';
import { KnowledgeSource } from '@/types/interface/knowledge';
import {
  CreateNewAgentParams,
  DeleteAgentParams,
  UpdateAgentParams,
} from './schema/agent';
import {
  CreateNewMessageParams,
  DeleteConversationParams,
} from './schema/chat';
import { CreateTelegramIntegration } from './schema/integration';
import {
  CreateNewDatasourceParams,
  DeleteDatasourceParams,
  UpdateDatasourceParams,
} from './schema/knowledge';
import { fetcher } from './utils';

/**
 * API class.
 * @class
 */
export class API {
  /**
   * User related API endpoints.
   * @namespace
   */
  static user = {
    getUserId: async (id: string) => await fetcher(`/api/user/${id}`),
  };

  /**
   * Conversation related API endpoints.
   * @namespace
   */
  static conversation = {
    getConversationId: async (id: string) =>
      await fetcher<Conversation>(`/api/conversation/${id}`).then(
        (r) => r.data
      ),

    getAllConversations: async () =>
      await fetcher<Conversation[]>('/api/conversation').then((r) => r.data),

    deleteConversation: async (data: DeleteConversationParams) =>
      await fetcher(`/api/conversation/${data.conversationId}`, {
        method: 'DELETE',
      }),
  };

  /**
   * Chat related API endpoints.
   * @namespace
   */
  static chat = {
    createNewMessage: async (data: CreateNewMessageParams) =>
      await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
  };

  /**
   * Agent related API endpoints.
   * @namespace
   */
  static agent = {
    getAllAgents: async () =>
      await fetcher<Agent[]>('/api/agent').then((r) => r.data),

    getAgentId: async (agentId: string) =>
      await fetcher(`/api/agent/${agentId}`).then((r) => r.data),

    createAgent: async (data: CreateNewAgentParams) =>
      await fetcher('/api/agent', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateAgent: async (data: UpdateAgentParams) =>
      await fetcher(`/api/agent/${data.agentId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteAgent: async (data: DeleteAgentParams) =>
      await fetcher(`/api/agent/${data.agentId}`, {
        method: 'DELETE',
      }),
  };

  /**
   * Datasource related API endpoints.
   * @namespace
   */
  static datasource = {
    getAllDatasources: async () =>
      await fetcher<KnowledgeSource[]>('/api/datasource').then((r) => r.data),

    getDatasourceId: async (id: string) =>
      await fetcher(`/api/datasource/${id}`).then((r) => r.data),

    createDatasource: async (data: CreateNewDatasourceParams) =>
      await fetcher('/api/datasource', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    editDatasource: async (data: UpdateDatasourceParams) =>
      await fetcher(`/api/datasource/${data.datasourceId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteDatasource: async (data: DeleteDatasourceParams) =>
      await fetcher(`/api/datasource/${data.datasourceId}`, {
        method: 'DELETE',
      }),
  };

  /**
   * Integration related API endpoints.
   * @namespace
   * */
  static integration = {
    createTelegramIntegration: async (data: CreateTelegramIntegration) =>
      await fetcher('/api/integration/telegram', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };
}
