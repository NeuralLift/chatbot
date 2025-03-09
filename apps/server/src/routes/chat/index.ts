import { Router } from 'express';

import { chatController } from '../../controllers/chat';

const chatRouter: Router = Router();

// GET

//POST
chatRouter.post('/', chatController.createNewMessage);

// chatRouter.post('/store', storeDocument);

export default chatRouter;
