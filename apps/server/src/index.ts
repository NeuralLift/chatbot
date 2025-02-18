import cors from 'cors';
import express, { Application } from 'express';

import 'dotenv/config';

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
    this.app.use(
      cors({
        origin: 'http://localhost:5173',
      })
    );
  }

  private initializeRoutes() {
    // Add your routes here
    // this.app.get('/', (req, res) => {
    //   res.sendFile(path.join(__dirname, '../web/dist/index.html'));
    // });

    // this.app.use(express.static(path.join(__dirname, '../web/dist')));

    //V1 Routes
    this.app.use('/api/v1', v1Router);

    //Error Handler
    this.app.use(errorHandler);
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
