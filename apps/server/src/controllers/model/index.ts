import { asyncHandler } from '../../middleware/async';
import { getAllGroqModels } from '../../services/model';
import AppResponse from '../../utils/appResponse';

const groqModelLists = asyncHandler(async (_req, res) => {
  const models = await getAllGroqModels();

  new AppResponse({
    res,
    data: models.data,
    message: 'Success getting all models',
    success: true,
    statusCode: 200,
  });
});

export const modelController = { groqModelLists };
