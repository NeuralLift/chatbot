import { HTTPSTATUS } from '../../configs/http';
import { asyncHandler } from '../../middleware/async';
import { ConversationService } from '../../services/conversation';
import { AppError } from '../../utils/appError';
import AppResponse from '../../utils/appResponse';
import { conversationIdSchema } from '../../validator/chat';

const getConversationId = asyncHandler(async (req, res) => {
  const { conversationId } = conversationIdSchema.parse(req.params);
  const conversation =
    await ConversationService.getConversationById(conversationId);

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

const conversationLists = asyncHandler(async (_req, res) => {
  const conversations = await ConversationService.getAllConversations();

  new AppResponse({
    res,
    message: 'Success getting conversations',
    data: conversations,
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

const deleteConversation = asyncHandler(async (req, res) => {
  const { conversationId } = conversationIdSchema.parse(req.params);

  await ConversationService.deleteConversationById(conversationId);

  new AppResponse({
    res,
    message: 'Success deleting conversation',
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

export const conversationController = {
  getConversationId,
  conversationLists,
  deleteConversation,
};
