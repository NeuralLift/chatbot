import { db } from '../../configs/database';
import {
  CreateNewDatasource,
  UpdateDataSource,
} from '../../types/interface/datasource';
import { AppError } from '../../utils/appError';
import { getAgentById } from '../agent';

const validateAgentIds = async (agentIds: string[]) => {
  await Promise.all(
    agentIds.map(async (agentId) => {
      const isAgentExists = await getAgentById(agentId);
      if (!isAgentExists) {
        throw AppError.notFound(`Agent with ID ${agentId} not found`);
      }
    })
  );
};

const manageAgentDatasourceRelations = async (
  agentIds: string[],
  datasourceId: string
) => {
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
};

export const createDatasource: CreateNewDatasource = async (data) => {
  try {
    if (Array.isArray(data.agentIds) && data.agentIds.length > 0) {
      await validateAgentIds(data.agentIds);
    }

    const { agentIds, fileUrl: _, ...datasourceData } = data;

    const newDatasource = await db.datasource.create({
      data: {
        ...datasourceData,
      },
    });

    await manageAgentDatasourceRelations(agentIds || [], newDatasource.id);

    return newDatasource;
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new Error('Failed to create datasource');
  }
};

export const updateDatasourceById: UpdateDataSource = async (
  datasourceId,
  data
) => {
  try {
    if (Array.isArray(data.agentIds) && data.agentIds.length > 0) {
      await validateAgentIds(data.agentIds);
    }

    const isDatasourceExists = await getDatasourceById(datasourceId);
    if (!isDatasourceExists) {
      throw AppError.notFound(`Datasource with ID ${datasourceId} not found`);
    }

    const { agentIds, ...datasourceData } = data;

    const updatedDatasource = await db.datasource.update({
      where: {
        id: datasourceId,
      },
      data: {
        ...datasourceData,
      },
    });

    await manageAgentDatasourceRelations(agentIds || [], datasourceId);

    return updatedDatasource;
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new Error('Failed to update datasource');
  }
};

export const getDatasourceById = async (datasourceId: string) => {
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
};

export const getAllDatasource = async () => {
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
};
