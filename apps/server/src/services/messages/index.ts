import { db } from '../../configs/database';
import { CreateMessage } from '../../types/interface/message';

class MessageService {
  async createMessage(data: CreateMessage) {
    try {
      const newMessage = await db.message.create({
        data,
      });

      return newMessage;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }
}

export const messageService = new MessageService();
