import { SenderType } from '@prisma/client';
import z from 'zod';

export const createMessageSchema = z.object({
  role: z.nativeEnum(SenderType),
  content: z.string().min(1),
  conversationId: z.string().min(1),
});

export type CreateMessage = z.infer<typeof createMessageSchema>;
