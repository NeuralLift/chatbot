import { Router } from 'express';

import { conversationController } from '../../controllers/conversation';

const conversationRouter: Router = Router();

// GET
conversationRouter.get(
  '/:conversationId',
  conversationController.getConversationId
);
conversationRouter.get('/', conversationController.conversationLists);

// POST

// DELETE
conversationRouter.delete(
  '/:conversationId',
  conversationController.deleteConversation
);

export default conversationRouter;
