import http from 'http';
import path from 'path';
import cors from 'cors';
import express, { Application } from 'express';
import { Server as SocketServer } from 'socket.io';

import { errorHandler } from '../middleware/errors';
import v1Router from '../routes';
import { WhatsappBotInstance } from '../utils/integrations/whatsapp';
import appConfig from './app';
import { limiter } from './limiter';

// Map untuk menyimpan instance bot
const botInstances: Map<string, WhatsappBotInstance> = new Map();
const MAX_INSTANCES = 3; // Batas untuk 1GB RAM

export class Server {
  public app: Application;
  public port: number;
  private io: SocketServer;
  private server: http.Server;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.server = http.createServer(this.app);
    this.io = new SocketServer(this.server, {
      cors: {
        origin: appConfig.CLIENT_ORIGIN,
      },
    });
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSocket();
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

    // Endpoint untuk memulai bot
    this.app.get('/api/start-bot', async (req, res) => {
      const { userId, agentId } = req.query;
      if (!userId || !agentId) {
        return res.status(400).json({ error: 'Missing userId or agentId' });
      }

      if (botInstances.has(userId as string)) {
        return res.json({ message: `Bot for ${userId} already running` });
      }

      if (botInstances.size >= MAX_INSTANCES) {
        const oldestUserId = botInstances.keys().next().value;
        const oldestBot = botInstances.get(oldestUserId!);
        await oldestBot?.disconnect();
        botInstances.delete(oldestUserId!); // Hapus dari Map setelah disconnect
      }

      const bot = new WhatsappBotInstance(
        { userId: userId as string, agentId: agentId as string },
        this.io
      );
      botInstances.set(userId as string, bot);
      res.json({ message: `Bot for ${userId} started. Please check QR code.` });
    });

    // V1 Routes
    this.app.use('/api', v1Router);

    // Error Handler
    this.app.use(errorHandler);

    // Catch-all route to handle client-side routing
    this.app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
    });
  }

  private initializeSocket() {
    this.io.on('connection', (socket) => {
      console.log('Client connected: ', socket.id);

      socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`Client ${socket.id} joined room ${userId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected: ', socket.id);
      });
    });
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`Server is running on ${this.getBaseUrl()}`);
    });
  }

  private getBaseUrl() {
    return `http://localhost:${this.port}`;
  }

  public getIo() {
    return this.io;
  }

  public async shutdown() {
    // for (const )
  }
}
