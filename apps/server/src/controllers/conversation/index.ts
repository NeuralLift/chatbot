import z from 'zod';

import { HTTPSTATUS } from '../../configs/http';
import { asyncHandler } from '../../middleware/async';
import { getConversationById } from '../../services/conversation';
import { AppError } from '../../utils/appError';
import AppResponse from '../../utils/appResponse';

const getConversationId = asyncHandler(async (req, res) => {
  const { conversationId } = conversationIdSchema.parse(req.params);
  const conversation = await getConversationById(conversationId);

  if (!conversation) {
    throw AppError.notFound('Conversation not found');
  }

  new AppResponse({
    res,
    message: 'Success getting conversation',
    data: conversation,
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

const conversationIdSchema = z.object({ conversationId: z.string().min(1) });

export const conversationController = {
  getConversationId,
};
