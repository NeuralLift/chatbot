import { Router } from 'express';

import { createMessage, storeDocument } from '../../services/chat';

const chatRouter: Router = Router();

chatRouter.post('/', createMessage);

chatRouter.post('/store', storeDocument);

export default chatRouter;
