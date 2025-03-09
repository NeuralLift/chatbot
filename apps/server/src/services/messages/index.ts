import { db } from '../../configs/database';
import { CreateMessage } from '../../types/interface/message';

export const createMessage = async (data: CreateMessage) => {
  try {
    const newMessage = await db.message.create({
      data,
    });

    return newMessage;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
