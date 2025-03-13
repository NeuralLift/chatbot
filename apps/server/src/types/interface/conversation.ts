import z from 'zod';

export const createConversationSchema = z.object({
  userId: z.string(),
  agentId: z.string(),
  chatId: z.number().optional(),
  category: z.enum(['question', 'statement', 'command', 'other']),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['active', 'resolved', 'pending']),
});

export const updateConversationSchema = z.object({
  userId: z.string().optional(),
  agentId: z.string().optional(),
  chatId: z.number().optional(),
  category: z.enum(['question', 'statement', 'command', 'other']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['active', 'resolved', 'pending']).optional(),
});

export type CreateConversation = z.infer<typeof createConversationSchema>;

export type UpdateConversation = z.infer<typeof updateConversationSchema>;
