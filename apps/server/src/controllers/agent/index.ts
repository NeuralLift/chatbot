import { HTTPSTATUS } from '../../configs/http';
import { asyncHandler } from '../../middleware/async';
import { AgentService } from '../../services/agent';
import AppResponse from '../../utils/appResponse';
import {
  agentIdSchema,
  createNewAgentValidator,
  updateAgentSchema,
} from '../../validator/agent';

const createNewAgent = asyncHandler(async (req, res) => {
  const data = createNewAgentValidator.parse(req.body);

  await AgentService.createAgent(data);

  new AppResponse({
    res,
    message: 'Success creating new agent',
    success: true,
    statusCode: HTTPSTATUS.CREATED,
  });
});

const agentLists = asyncHandler(async (_, res) => {
  const agents = await AgentService.getAllAgents();

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
  await AgentService.updateAgentById(params.agentId, data);

  new AppResponse({
    res,
    message: 'Success updating agent',
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

const deleteAgent = asyncHandler(async (req, res) => {
  const data = agentIdSchema.parse(req.params);
  await AgentService.deleteAgentById(data.agentId);

  new AppResponse({
    res,
    message: 'Success deleting agent',
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

export const agentController = {
  createNewAgent,
  agentLists,
  updateAgent,
  deleteAgent,
};
