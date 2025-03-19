import { Prisma } from '@prisma/client';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import { ConversationService } from '../../../services/conversation';
import { handleTelegramStream } from '../handleStream';

export class TelegramBotInstance {
  private bot: Telegraf;
  public token: string;
  public userId: string;
  public agentId: string;
  public conversation: Prisma.ConversationGetPayload<{
    include: { messages: true };
  }> | null = null;

  constructor({
    token,
    userId,
    agentId,
  }: {
    token: string;
    userId: string;
    agentId: string;
  }) {
    this.token = token;
    this.userId = userId;
    this.agentId = agentId;
    this.bot = new Telegraf(token);

    this.bot.start((ctx) => {
      ctx.sendMessage(
        "Hi! I'm your personal assistant. How can I help you today?"
      );
    });

    this.bot.on(message('text'), async (ctx) => {
      const userMessage = ctx.message.text;
      const chatId = ctx.chat.id;

      this.conversation =
        await ConversationService.getConversationByChatId(chatId);

      const lastMessages = this.conversation?.messages.slice(-10) || [];

      const content = await handleTelegramStream({
        messages: lastMessages,
        userMessage,
        agentId: this.agentId,
        chatId,
      });

      await ctx.telegram.sendMessage(ctx.chat.id, content.slice(0, 4000));
    });

    this.bot
      .launch()
      .then(() => console.log('Bot is running...'))
      .catch((err) => console.error('Failed to launch bot:', err));

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  // Fungsi untuk set webhook
  public async setWebhook(webhookUrl: string) {
    await this.bot.telegram.setWebhook(webhookUrl);
    console.log(`Webhook untuk bot ${this.userId} diset ke ${webhookUrl}`);
  }

  // Fungsi untuk mendapatkan handler webhook
  public getWebhookHandler() {
    return this.bot.webhookCallback(
      `https://2801-103-136-59-249.ngrok-free.app/api/bot/${this.userId}`
    );
  }
}
