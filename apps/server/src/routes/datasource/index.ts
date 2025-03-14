import { Router } from 'express';

import { dataSourceController } from '../../controllers/datasource';

const datasourceRouter: Router = Router();

// GET
datasourceRouter.get('/', dataSourceController.datasourceLists);

// POST
datasourceRouter.post('/', dataSourceController.createNewDatasource);

// PUT
datasourceRouter.put('/:datasourceId', dataSourceController.updateDatasource);

// DELETE
datasourceRouter.delete(
  '/:datasourceId',
  dataSourceController.deteleDatasource
);

export default datasourceRouter;
