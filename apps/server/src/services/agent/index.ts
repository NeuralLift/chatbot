import { db } from '../../configs/database';
import {
  CreateNewAgent,
  DeleteAgent,
  GetAgent,
  GetAllAgents,
  UpdateAgent,
} from '../../types/interface/agent';
import { AppError } from '../../utils/appError';
import { SYSTEM_PROMPT, USER_PROMPT } from '../../utils/prompt';
import { DatasourceService } from '../datasource';

export class AgentService {
  static async validateDatasourceIds(datasourceIds: string[]) {
    await Promise.all(
      datasourceIds.map(async (datasourceId) => {
        const isDatasourceExists =
          await DatasourceService.getDatasourceById(datasourceId);
        if (!isDatasourceExists) {
          throw AppError.notFound(
            `Datasource with ID ${datasourceId} not found`
          );
        }
      })
    );
  }

  static async manageAgentDatasourceRelations(
    agentId: string,
    datasourceIds: string[]
  ) {
    if (datasourceIds.length > 0) {
      await Promise.all(
        datasourceIds.map(async (datasourceId) => {
          const agentDatasource = await db.agentOnDatasource.findFirst({
            where: {
              agentId,
              datasourceId,
            },
          });
          if (!agentDatasource) {
            await db.agentOnDatasource.create({
              data: {
                agentId,
                datasourceId,
              },
            });
          }
        })
      );
    } else {
      await db.agentOnDatasource.deleteMany({
        where: {
          agentId,
        },
      });
    }
  }

  static createAgent: CreateNewAgent = async (data) => {
    try {
      if (Array.isArray(data.datasourceIds) && data.datasourceIds.length > 0) {
        await this.validateDatasourceIds(data.datasourceIds);
      }

      const { datasourceIds, ...agentData } = data;

      const newAgent = await db.agent.create({
        data: {
          ...agentData,
          model: agentData.model ?? 'llama-3.3-70b-versatile',
          successRate: 0,
          active: true,
          lastActive: new Date().toISOString(),
          system_prompt: agentData.system_prompt ?? SYSTEM_PROMPT,
          user_prompt: agentData.user_prompt ?? USER_PROMPT,
          prompt_variables: agentData.prompt_variables ?? {},
        },
      });

      await this.manageAgentDatasourceRelations(
        newAgent.id,
        datasourceIds ?? []
      );

      return newAgent;
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error('Failed to create agent');
    }
  };

  static getAgentById: GetAgent = async (agentId) => {
    try {
      const agent = await db.agent.findFirst({
        where: {
          id: agentId,
        },
        include: {
          datasources: {
            select: {
              datasource: true,
              datasourceId: true,
            },
          },
        },
      });

      return agent;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get agent');
    }
  };

  static updateAgentById: UpdateAgent = async (agentId, data) => {
    try {
      if (Array.isArray(data.datasourceIds) && data.datasourceIds.length > 0) {
        await this.validateDatasourceIds(data.datasourceIds);
      }

      const isAgentExists = await this.getAgentById(agentId);
      if (!isAgentExists) {
        throw AppError.notFound(`Agent with ID ${agentId} not found`);
      }

      const { datasourceIds, ...agentData } = data;

      const updatedAgent = await db.agent.update({
        where: {
          id: agentId,
        },
        data: {
          ...agentData,
        },
      });

      await this.manageAgentDatasourceRelations(agentId, datasourceIds || []);

      return updatedAgent;
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error('Failed to update agent');
    }
  };

  static getAllAgents: GetAllAgents = async () => {
    try {
      const agents = await db.agent.findMany({
        include: {
          conversations: true,
          datasources: {
            select: {
              datasource: true,
              datasourceId: true,
            },
          },
        },
      });

      const remappedAgents = agents.map((agent) => ({
        ...agent,
        datasourceIds: agent.datasources.map(
          (datasource) => datasource.datasourceId
        ),
        datasources: agent.datasources.map(
          (datasource) => datasource.datasource
        ),
      }));

      return remappedAgents;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get agents');
    }
  };

  static deleteAgentById: DeleteAgent = async (agentId) => {
    try {
      const isAgentExists = await this.getAgentById(agentId);
      if (!isAgentExists) {
        throw AppError.notFound('Agent not found');
      }

      const deletedAgent = await db.agent.delete({
        where: {
          id: agentId,
        },
      });

      return deletedAgent;
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error('Failed to delete agent');
    }
  };
}
