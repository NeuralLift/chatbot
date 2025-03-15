import path from 'path';
import cors from 'cors';
import express, { Application } from 'express';

import 'dotenv/config';

import { limiter } from './configs/limiter';
import { errorHandler } from './middleware/errors';
import v1Router from './routes';

export class Server {
  public app: Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    // Add your middlewares here
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(limiter);
  }

  private initializeRoutes() {
    // Add your routes here

    // Serve the static files from the React app
    this.app.get('/', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
    });
    this.app.use(
      express.static(path.join(__dirname, '../../web/dist'), {
        maxAge: '1d',
      })
    );

    // V1 Routes
    this.app.use('/api', v1Router);

    // Error Handler
    this.app.use(errorHandler);

    // Catch-all route to handle client-side routing
    this.app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on ${this.getBaseUrl()}`);
    });
  }

  private getBaseUrl() {
    return `http://localhost:${this.port}`;
  }
}

const port = 3000;
const server = new Server(port);
server.listen();
