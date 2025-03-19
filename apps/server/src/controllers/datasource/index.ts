import { Datasource } from '@prisma/client';

import { HTTPSTATUS } from '../../configs/http';
import { asyncHandler } from '../../middleware/async';
import { DatasourceService } from '../../services/datasource';
import { storeDocument } from '../../services/document';
import { AppError } from '../../utils/appError';
import AppResponse from '../../utils/appResponse';
import {
  createNewDatasouceSchema,
  datasourceIdSchema,
  updateDatasouceSchema,
} from '../../validator/datasource';

const createNewDatasource = asyncHandler(async (req, res) => {
  const data = createNewDatasouceSchema.parse(req.body);
  let datasource: Datasource = {} as Datasource;

  if (data.type === 'DOCUMENT' && data.fileUrl) {
    datasource = await DatasourceService.createDatasource(data);

    await storeDocument({
      fileUrl: data.fileUrl,
      datasourceId: datasource.id,
    });
  }

  if (data.type === 'TEXT' && data.content) {
    datasource = await DatasourceService.createDatasource(data);

    await storeDocument({
      content: data.content,
      datasourceId: datasource.id,
    });
  }

  if (data.type === 'WEB' && data.url) {
    datasource = await DatasourceService.createDatasource(data);

    await storeDocument({
      url: data.url,
      agentIds: data.agentIds,
      datasourceId: datasource.id,
    });
  }

  if (Object.keys(datasource).length === 0) {
    throw AppError.badRequest('Failed to create datasource', 'BAD_REQUEST');
  }

  new AppResponse({
    res,
    message: 'Success creating new datasource',
    success: true,
    statusCode: HTTPSTATUS.CREATED,
  });
});

const updateDatasource = asyncHandler(async (req, res) => {
  const { datasourceId } = datasourceIdSchema.parse(req.params);
  const data = updateDatasouceSchema.parse(req.body);

  await DatasourceService.updateDatasourceById(datasourceId, data);

  new AppResponse({
    res,
    message: 'Success updating datasource',
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

const datasourceLists = asyncHandler(async (_, res) => {
  const datasources = await DatasourceService.getAllDatasource();

  new AppResponse({
    res,
    data: datasources,
    message: 'Success getting all datasources',
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

const deteleDatasource = asyncHandler(async (req, res) => {
  const { datasourceId } = datasourceIdSchema.parse(req.params);

  await DatasourceService.deleteDatasourceById(datasourceId);

  new AppResponse({
    res,
    message: 'Success deleting datasource',
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

export const dataSourceController = {
  createNewDatasource,
  updateDatasource,
  datasourceLists,
  deteleDatasource,
};
