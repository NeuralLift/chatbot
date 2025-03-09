import { Router } from 'express';

import { agentController } from '../../controllers/agent';

const agentRouter: Router = Router();

// GET
agentRouter.get('/', agentController.agentLists);

// POST
agentRouter.post('/', agentController.createNewAgent);

// PUT
agentRouter.put('/:agentId', agentController.updateAgent);

// DELETE
agentRouter.delete('/:agentId', agentController.deleteAgent);

export default agentRouter;
