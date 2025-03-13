import z from 'zod';

export const createTelegramIntegration = z.object({
  token: z.string().min(1),
  userId: z.string().min(1),
  agentId: z.string().min(1),
});

export type CreateTelegramIntegration = z.infer<
  typeof createTelegramIntegration
>;
