import z from 'zod';

export const createNewAgentSchema = z.object({
  name: z
    .string({
      message: 'Agent name cannot be empty',
    })
    .min(1, {
      message: 'Agent name cannot be empty',
    }),
  datasourceIds: z.array(z.string().min(1)),
  description: z.string().optional(),
  type: z.enum(['AI', 'HUMAN'], {
    message: 'Agent type is required',
  }),
  model: z.string(),
  system_prompt: z.string().optional(),
  user_prompt: z.string().optional(),
  prompt_variables: z.record(z.string()).optional(),
});

export const updateAgentSchema = z.object({
  agentId: z.string().min(1),
  name: z
    .string({
      message: 'Agent name cannot be empty',
    })
    .min(1, {
      message: 'Agent name cannot be empty',
    })
    .optional(),
  datasourceIds: z.array(z.string().min(1)),
  description: z.string().optional(),
  type: z.enum(['AI', 'HUMAN'], {
    message: 'Agent type is required',
  }),
  model: z.string().optional(),
  system_prompt: z.string().optional(),
  user_prompt: z.string().optional(),
  prompt_variables: z.record(z.string()).optional(),
});

export const deleteAgentSchema = z.object({
  agentId: z.string().min(1),
});

export type CreateNewAgentParams = z.infer<typeof createNewAgentSchema>;
export type DeleteAgentParams = z.infer<typeof deleteAgentSchema>;
export type UpdateAgentParams = z.infer<typeof updateAgentSchema>;
