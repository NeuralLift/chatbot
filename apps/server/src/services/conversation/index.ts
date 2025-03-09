import { db } from '../../configs/database';
import { CreateConversation } from '../../types/interface/conversation';

export const createConversation = async (data: CreateConversation) => {
  try {
    const newConversation = await db.conversation.create({
      data: {
        agentId: data.agentId,
        userId: data.userId,
        priority: data.priority,
        category: data.category,
        status: data.status,
      },
      include: {
        messages: true,
        user: true,
      },
    });

    return newConversation;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getConversationById = async (conversationId?: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
      },
      include: {
        messages: true,
        user: true,
      },
    });

    return conversation;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
