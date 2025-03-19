import { db } from '../../configs/database';
import {
  CreateConversation,
  UpdateConversation,
} from '../../types/interface/conversation';
import { AppError } from '../../utils/appError';

export class ConversationService {
  public static async createConversation(data: CreateConversation) {
    try {
      const newConversation = await db.conversation.create({
        data,
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
  }

  public static async updateConversationById(
    conversationId: string,
    data: UpdateConversation
  ) {
    try {
      const updatedConversation = await db.conversation.update({
        where: {
          id: conversationId,
        },
        data,
      });

      return updatedConversation;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public static async getConversationById(conversationId?: string) {
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
  }

  public static async getConversationByChatId(chatId: number) {
    try {
      const conversation = await db.conversation.findFirst({
        where: {
          chatId,
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
  }

  public static async getAllConversations() {
    try {
      const conversations = await db.conversation.findMany({
        include: {
          messages: {
            take: 1,
          },
          user: true,
        },
      });

      return conversations;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public static async deleteConversationById(conversationId: string) {
    try {
      const isConversationExits =
        await this.getConversationById(conversationId);

      if (!isConversationExits) {
        throw AppError.notFound('Conversation not found');
      }

      const deletedConversation = await db.conversation.delete({
        where: {
          id: conversationId,
        },
      });

      return deletedConversation;
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error('Failed to delete conversation');
    }
  }
}
