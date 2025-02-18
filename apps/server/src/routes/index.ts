import { Router } from 'express';
import { createRouteHandler } from 'uploadthing/express';

import { uploadRouter } from '../utils/uploadthing';
import appConfig from './../configs/app';
import chatRouter from './chat';

const v1Router: Router = Router();

v1Router.use('/chat', chatRouter);
v1Router.use(
  '/uploadthing',
  createRouteHandler({
    router: uploadRouter,
    config: {
      callbackUrl: `${appConfig.SERVER_ORIGIN}/api/v1/uploadthing`,
    },
  })
);

export default v1Router;
