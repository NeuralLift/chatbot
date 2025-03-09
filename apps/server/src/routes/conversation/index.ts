import { Router } from 'express';

import { conversationController } from '../../controllers/conversation';

const conversationRouter: Router = Router();

// GET
conversationRouter.get(
  '/:conversationId',
  conversationController.getConversationId
);

// POST

export default conversationRouter;
