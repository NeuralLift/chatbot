import { db } from '../../configs/database';
import {
  CreateNewDatasource,
  UpdateDataSource,
} from '../../types/interface/datasource';
import { AppError } from '../../utils/appError';
import { AgentService } from '../agent';

export class DatasourceService {
  static async validateAgentIds(agentIds: string[]) {
    await Promise.all(
      agentIds.map(async (agentId) => {
        const isAgentExists = await AgentService.getAgentById(agentId);
        if (!isAgentExists) {
          throw AppError.notFound(`Agent with ID ${agentId} not found`);
        }
      })
    );
  }

  static async manageAgentDatasourceRelations(
    agentIds: string[],
    datasourceId: string
  ) {
    if (agentIds.length > 0) {
      await Promise.all(
        agentIds.map(async (agentId) => {
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
          datasourceId,
        },
      });
    }
  }

  static createDatasource: CreateNewDatasource = async (data) => {
    try {
      if (Array.isArray(data.agentIds) && data.agentIds.length > 0) {
        await this.validateAgentIds(data.agentIds);
      }

      const { agentIds, ...datasourceData } = data;

      const newDatasource = await db.datasource.create({
        data: {
          ...datasourceData,
        },
      });

      await this.manageAgentDatasourceRelations(
        agentIds || [],
        newDatasource.id
      );

      return newDatasource;
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error('Failed to create datasource');
    }
  };

  static updateDatasourceById: UpdateDataSource = async (
    datasourceId,
    data
  ) => {
    try {
      if (Array.isArray(data.agentIds) && data.agentIds.length > 0) {
        await this.validateAgentIds(data.agentIds);
      }

      const isDatasourceExists = await this.getDatasourceById(datasourceId);
      if (!isDatasourceExists) {
        throw AppError.notFound(`Datasource with ID ${datasourceId} not found`);
      }

      /** (not used maybe deleted in the future)
      const vectorStore = await PineconeStore.fromExistingIndex(
        getEmbeddings(),
        {
          pineconeIndex: getPineconeIndex(),
          maxConcurrency: 5,
        }
      );

      if (
        data.type === 'DOCUMENT' &&
        data.fileUrl &&
        data.fileUrl !== isDatasourceExists.fileUrl
      ) {
        await vectorStore.delete({
          ids: [isDatasourceExists.id],
        });

        await storeDocument({
          fileUrl: data.fileUrl,
          datasourceId: datasourceId,
        });
      }

      if (
        data.type === 'TEXT' &&
        data.content &&
        data.content !== isDatasourceExists.content
      ) {
        await vectorStore.delete({
          filter: {
            datasourceId,
          },
        });

        await storeDocument({
          content: data.content,
          datasourceId: datasourceId,
        });
      }

      if (
        data.type === 'WEB' &&
        data.url &&
        data.url !== isDatasourceExists.url
      ) {
        await vectorStore.delete({
          filter: {
            datasourceId,
          },
        });

        await storeDocument({
          url: data.url,
          datasourceId: datasourceId,
        });
      }
        */

      const { agentIds, ...datasourceData } = data;

      const updatedDatasource = await db.datasource.update({
        where: {
          id: datasourceId,
        },
        data: {
          ...datasourceData,
        },
      });

      await this.manageAgentDatasourceRelations(agentIds || [], datasourceId);

      return updatedDatasource;
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error('Failed to update datasource');
    }
  };

  static async getDatasourceById(datasourceId: string) {
    try {
      const datasource = await db.datasource.findFirst({
        where: {
          id: datasourceId,
        },
        include: {
          agents: {
            select: {
              agent: true,
              agentId: true,
            },
          },
        },
      });

      return datasource;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get datasource');
    }
  }

  static async deleteDatasourceById(datasourceId: string) {
    try {
      const isDatasourceExists = await this.getDatasourceById(datasourceId);
      if (!isDatasourceExists) {
        throw AppError.notFound(`Datasource with ID ${datasourceId} not found`);
      }

      /** (not used maybe deleted in the future)
      const vectorStore = await PineconeStore.fromExistingIndex(getEmbeddings(), {
        pineconeIndex: getPineconeIndex(),
        maxConcurrency: 5,
      });
      
      await vectorStore.delete({
        filter: {
          datasourceId,
        },
      });
      */

      const deletedDatasource = await db.datasource.delete({
        where: {
          id: datasourceId,
        },
      });

      return deletedDatasource;
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error('Failed to delete datasource');
    }
  }

  static async getAllDatasource() {
    try {
      const datasources = await db.datasource.findMany({
        include: {
          agents: {
            select: {
              agent: true,
              agentId: true,
            },
          },
        },
      });

      const remappedDatasources = datasources.map((datasource) => ({
        ...datasource,
        agentIds: datasource.agents.map((agent) => agent.agentId),
        agents: datasource.agents.map((agent) => agent.agent),
      }));

      return remappedDatasources;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get datasource');
    }
  }
}
