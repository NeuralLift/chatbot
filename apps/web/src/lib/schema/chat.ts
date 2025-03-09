import z from 'zod';

export const createNewMessage = z.object({
  messages: z.array(
    z.object({ role: z.enum(['human', 'ai']), content: z.string().min(1) })
  ),
  agentId: z.string().min(1),
  userId: z.string().min(1),
});

export type CreateNewMessageParams = z.infer<typeof createNewMessage>;
