/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
import { Prisma } from '@prisma/client';
import QRCode from 'qrcode';
import { Server as SocketServer } from 'socket.io';
import { Client } from 'whatsapp-web.js';

// import { ConversationService } from '../../../services/conversation';
// import { handleTelegramStream } from '../handleStream';

export class WhatsappBotInstance {
  private client: Client | null = null;
  public userId: string;
  public agentId: string;
  public conversation: Prisma.ConversationGetPayload<{
    include: { messages: true };
  }> | null = null;
  private isActive: boolean = false;
  private idleTimeout: NodeJS.Timeout | null = null;

  constructor(
    { userId, agentId }: { userId: string; agentId: string },
    io: SocketServer
  ) {
    this.userId = userId;
    this.agentId = agentId;
    this.initializeBot(io);
  }

  private async initializeBot(io: SocketServer) {
    this.client = new Client({
      // authStrategy: new LocalAuth({ clientId: this.userId }),
      // puppeteer: {
      //   headless: true,
      //   args: [
      //     '--no-sandbox',
      //     '--disable-setuid-sandbox',
      //     '--disable-dev-shm-usage',
      //     '--disable-accelerated-2d-canvas',
      //     '--no-first-run',
      //     '--no-zygote',
      //     '--disable-gpu',
      //   ],
      // },
    });

    this.client.on('qr', async (qr) => {
      console.log(`QR for ${this.userId} generated`);

      const qrCode = await QRCode.toDataURL(qr);

      io.to(this.userId).emit('qr', qrCode); // Kirim QR ke React via WebSocket
    });

    this.client.on('ready', () => {
      console.log(`Bot ${this.userId} connected`);
      this.isActive = true;
      this.resetIdleTimeout();
      io.to(this.userId).emit('authenticated', 'Bot connected');
    });

    this.client.on('disconnected', (reason) => {
      console.log(`Bot ${this.userId} disconnected: ${reason}`);
      this.isActive = false;
    });

    this.client.on('message_create', async (msg) => {
      console.log(msg.body);
      if (msg.fromMe) return;

      // const chatId = msg.from;
      // const userMessage = msg.body;

      // if (
      //   userMessage.toLowerCase() === 'hi' ||
      //   userMessage.toLowerCase() === 'hello'
      // ) {
      //   await this.client?.sendMessage(
      //     chatId,
      //     "Hi! I'm your personal assistant. How can I help you today?"
      //   );
      //   this.resetIdleTimeout();
      //   return;
      // }

      // this.conversation =
      //   await ConversationService.getConversationByChatId(chatId);
      // const lastMessages = this.conversation?.messages.slice(-10) || [];

      // const content = await handleTelegramStream({
      //   messages: lastMessages,
      //   userMessage,
      //   agentId: this.agentId,
      //   chatId,
      // });

      // await this.client?.sendMessage(chatId, content.slice(0, 4000));
      this.resetIdleTimeout();
    });

    await this.client.initialize();
  }

  private resetIdleTimeout() {
    if (this.idleTimeout) clearTimeout(this.idleTimeout);
    this.idleTimeout = setTimeout(() => this.disconnect(), 5 * 60 * 1000); // 5 menit idle
  }

  public async disconnect() {
    if (this.isActive) {
      await this.client?.destroy();
      this.isActive = false;
      console.log(`Bot ${this.userId} disconnected`);
    }
  }
}
