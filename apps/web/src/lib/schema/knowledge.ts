import z from 'zod';

export const createNewDatasouceSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Source name cannot be empty',
    }),
    description: z.string().optional(),
    agentIds: z.array(z.string().min(1)),
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
// .refine(
//   (data) =>
//     data.type !== 'DATABASE' || (data.type === 'DATABASE' && data.size),
//   { message: 'size is required when type is DATABASE', path: ['size'] }
// );

export const updateDatasouceSchema = z
  .object({
    datasourceId: z.string().min(1),
    name: z.string().min(1, {
      message: 'Source name cannot be empty',
    }),
    description: z.string().optional(),
    agentIds: z.array(z.string().min(1)),
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
// .refine(
//   (data) =>
//     data.type !== 'DATABASE' || (data.type === 'DATABASE' && data.size),
//   { message: 'size is required when type is DATABASE', path: ['size'] }
// );

export type CreateNewDatasourceParams = z.infer<
  typeof createNewDatasouceSchema
>;
export type UpdateDatasourceParams = z.infer<typeof updateDatasouceSchema>;
