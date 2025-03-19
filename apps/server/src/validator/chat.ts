import z from 'zod';

const createNewMessageValidator = z.object({
  messages: z.array(
    z.object({ role: z.enum(['human', 'ai']), content: z.string().min(1) })
  ),
  userId: z.string().min(1),
  agentId: z.string().min(1),
  chatId: z.number().min(1).optional().describe('Telegram chat id'),
  conversationId: z.string().min(1).optional(),
});

const conversationIdSchema = z.object({ conversationId: z.string().min(1) });

export { createNewMessageValidator, conversationIdSchema };
