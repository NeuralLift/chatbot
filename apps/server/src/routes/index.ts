import { Router } from 'express';
import { createRouteHandler } from 'uploadthing/express';

import { uploadRouter } from '../utils/uploadthing';
import appConfig from './../configs/app';
import agentRouter from './agent';
import chatRouter from './chat';
import conversationRouter from './conversation';
import datasourceRouter from './datasource';
import integration from './integration';

const v1Router: Router = Router();

v1Router.use('/chat', chatRouter);
v1Router.use('/agent', agentRouter);
v1Router.use('/datasource', datasourceRouter);
v1Router.use('/conversation', conversationRouter);
v1Router.use('/integration', integration);
v1Router.use(
  '/uploadthing',
  createRouteHandler({
    router: uploadRouter,
    config: {
      callbackUrl: `${appConfig.SERVER_ORIGIN}/api/uploadthing`,
    },
  })
);

export default v1Router;
