import { Router } from 'express';

import { modelController } from '../../controllers/model';

const modelRouter: Router = Router();

// GET
modelRouter.get('/groq', modelController.groqModelLists);

export default modelRouter;
