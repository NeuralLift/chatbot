import { TelegramBotInstance } from './telegram';

class BotManager {
  private bots: Map<string, TelegramBotInstance> = new Map(); // Key: userId, Value: BotInstance

  // Tambah bot baru
  public addBot(
    userId: string,
    token: string,
    agentId: string
  ): TelegramBotInstance {
    const bot = new TelegramBotInstance({ token, userId, agentId });
    this.bots.set(userId, bot);
    return bot;
  }

  // Dapatkan bot berdasarkan userId
  public getBot(userId: string): TelegramBotInstance | undefined {
    return this.bots.get(userId);
  }

  // Hapus bot
  public removeBot(userId: string) {
    this.bots.delete(userId);
  }
}

export default new BotManager();
