import { Router } from 'express';
import z from 'zod';

import { asyncHandler } from '../../middleware/async';
import AppResponse from '../../utils/appResponse';
import { TelegramBotInstance } from '../../utils/integrations/telegram';

const botRouter: Router = Router();

// const registerBot = asyncHandler(async (req, res) => {
//   const { userId, token } = req.body;

//   if (!userId || !token) {
//     return res.status(400).json({
//       success: false,
//       message: 'Bad request',
//       error: 'Missing required fields',
//     });
//   }

//   try {
//     const bot = BotManager.addBot(userId, token);
//     const webhookUrl = `https://2801-103-136-59-249.ngrok-free.app/api/bot/${userId}`;
//     bot.setWebhook(webhookUrl);

//     return res.status(200).json({
//       success: true,
//       message: 'Bot registered successfully',
//       data: {
//         userId,
//         webhookUrl,
//       },
//     });
//   } catch {
//     res.status(500).json({ error: 'Gagal mendaftarkan bot' });
//   }
// });

const telegramBotHandler = asyncHandler(async (req, res) => {
  const { token, userId, agentId } = createBotSchema.parse(req.body);

  new TelegramBotInstance({ token, userId, agentId });

  new AppResponse({
    res,
    message: 'Success initializing bot',
    success: true,
    statusCode: 200,
  });
});

const createBotSchema = z.object({
  token: z.string().min(1),
  userId: z.string().min(1),
  agentId: z.string().min(1),
});

// GET
botRouter.post('/telegram', telegramBotHandler);

//POST
// botRouter.post('/register', registerBot);

export default botRouter;
