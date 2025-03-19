import { AgentType } from '@prisma/client';
import z from 'zod';

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
  lastActive: z.string().optional(),
});

const agentIdSchema = z.object({
  agentId: z.string().min(1),
});

export { createNewAgentValidator, updateAgentSchema, agentIdSchema };
