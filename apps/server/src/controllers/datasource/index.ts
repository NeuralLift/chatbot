import { $Enums, Datasource } from '@prisma/client';
import z from 'zod';

import { HTTPSTATUS } from '../../configs/http';
import { asyncHandler } from '../../middleware/async';
import {
  createDatasource,
  deleteDatasourceById,
  getAllDatasource,
  updateDatasourceById,
} from '../../services/datasource';
import { storeDocument } from '../../services/document';
import { AppError } from '../../utils/appError';
import AppResponse from '../../utils/appResponse';

const createNewDatasource = asyncHandler(async (req, res) => {
  const data = createNewDatasouceSchema.parse(req.body);
  let datasource: Datasource = {} as Datasource;

  if (data.type === 'DOCUMENT' && data.fileUrl) {
    datasource = await createDatasource(data);

    await storeDocument({
      fileUrl: data.fileUrl,
      datasourceId: datasource.id,
    });
  }

  if (data.type === 'TEXT' && data.content) {
    datasource = await createDatasource(data);

    await storeDocument({
      content: data.content,
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

  await updateDatasourceById(datasourceId, data);

  new AppResponse({
    res,
    message: 'Success updating datasource',
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

const datasourceLists = asyncHandler(async (_, res) => {
  const datasources = await getAllDatasource();

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

  await deleteDatasourceById(datasourceId);

  new AppResponse({
    res,
    message: 'Success deleting datasource',
    success: true,
    statusCode: HTTPSTATUS.OK,
  });
});

const createNewDatasouceSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    agentIds: z.array(z.string().min(1)).optional(),
    fileUrl: z.string().url().optional(),
    type: z.nativeEnum($Enums.DatasourceType),
    category: z.string().optional(),
    content: z.string().optional(),
    url: z.string().optional(),
    size: z.number().optional(),
  })
  .refine(
    (data) =>
      data.type !== 'DOCUMENT' || (data.type === 'DOCUMENT' && data.fileUrl),
    { message: 'fileUrl is required when type is DOCUMENT', path: ['fileUrl'] }
  )
  .refine(
    (data) => data.type !== 'TEXT' || (data.type === 'TEXT' && data.content),
    { message: 'content is required when type is TEXT', path: ['content'] }
  )
  .refine((data) => data.type !== 'WEB' || (data.type === 'WEB' && data.url), {
    message: 'url is required when type is WEBSITE',
    path: ['url'],
  });
// .refine(
//   (data) =>
//     data.type !== 'DATABASE' || (data.type === 'DATABASE' && data.size),
//   { message: 'size is required when type is DATABASE', path: ['size'] }
// );

const datasourceIdSchema = z.object({
  datasourceId: z.string().min(1),
});

const updateDatasouceSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Source name cannot be empty',
    }),
    description: z.string().optional(),
    agentIds: z.array(z.string().min(1)).optional(),
    fileUrl: z.string().url().optional(),
    type: z.enum(['DOCUMENT', 'TEXT', 'WEB', 'DATABASE']),
    category: z.string().optional(),
    content: z.string().optional(),
    url: z.string().optional(),
    size: z.number().optional(),
  })
  .refine(
    (data) =>
      data.type !== 'DOCUMENT' || (data.type === 'DOCUMENT' && data.fileUrl),
    { message: 'fileUrl is required when type is DOCUMENT', path: ['fileUrl'] }
  )
  .refine(
    (data) => data.type !== 'TEXT' || (data.type === 'TEXT' && data.content),
    { message: 'content is required when type is TEXT', path: ['content'] }
  )
  .refine((data) => data.type !== 'WEB' || (data.type === 'WEB' && data.url), {
    message: 'url is required when type is WEBSITE',
    path: ['url'],
  });

export const dataSourceController = {
  createNewDatasource,
  updateDatasource,
  datasourceLists,
  deteleDatasource,
};
