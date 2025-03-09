import z from 'zod';

export const createConversationSchema = z.object({
  userId: z.string(),
  agentId: z.string(),
  category: z.enum(['question', 'statement', 'command', 'other']),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['active', 'resolved', 'pending']),
});

export type CreateConversation = z.infer<typeof createConversationSchema>;
