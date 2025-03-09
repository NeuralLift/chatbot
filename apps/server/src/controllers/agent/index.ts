import { AgentType } from '@prisma/client';
import z from 'zod';

import { HTTPSTATUS } from '../../configs/http';
import { asyncHandler } from '../../middleware/async';
import {
  createAgent,
  deleteAgentById,
  getAllAgents,
  updateAgentById,
} from '../../services/agent';
import AppResponse from '../../utils/appResponse';

const createNewAgent = asyncHandler(async (req, res) => {
  const data = createNewAgentValidator.parse(req.body);

  await createAgent(data);

  new AppResponse({
    res,
    message: 'Success creating new agent',
    success: true,
    statusCode: HTTPSTATUS.CREATED,
  });
});

const agentLists = asyncHandler(async (_, res) => {
  const agents = await getAllAgents();

  new AppResponse({
    res,
    message: 'Success getting all agents',
    data: agents,
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

const updateAgent = asyncHandler(async (req, res) => {
  const params = agentIdSchema.parse(req.params);
  const data = updateAgentSchema.parse(req.body);
  await updateAgentById(params.agentId, data);

  new AppResponse({
    res,
    message: 'Success updating agent',
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

const deleteAgent = asyncHandler(async (req, res) => {
  const data = agentIdSchema.parse(req.params);
  await deleteAgentById(data.agentId);

  new AppResponse({
    res,
    message: 'Success deleting agent',
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

const createNewAgentValidator = z.object({
  datasourceIds: z.array(z.string().min(1)).optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum([AgentType.AI, AgentType.HUMAN]),
  model: z.string().min(1),
  system_prompt: z
    .string({
      message: 'System prompt is required',
    })
    .optional(),
  user_prompt: z
    .string({
      message: 'System prompt is required',
    })
    .optional(),
  prompt_variables: z.record(z.string()).optional(),
});

const updateAgentSchema = z.object({
  datasourceIds: z.array(z.string().min(1)).optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum([AgentType.AI, AgentType.HUMAN]),
  model: z.string().min(1),
  system_prompt: z
    .string({
      message: 'System prompt is required',
    })
    .optional(),
  user_prompt: z
    .string({
      message: 'System prompt is required',
    })
    .optional(),
  prompt_variables: z.record(z.string()).optional(),
});

const agentIdSchema = z.object({
  agentId: z.string().min(1),
});

export const agentController = {
  createNewAgent,
  agentLists,
  updateAgent,
  deleteAgent,
};
