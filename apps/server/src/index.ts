import { Server } from './configs/server';

import 'dotenv/config';

const port = 3000;
const appServer = new Server(port);
appServer.listen();

// Graceful shutdown untuk SIGINT dan SIGTERM
process.on('SIGINT', async () => {
  await appServer.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await appServer.shutdown();
  process.exit(0);
});

export default appServer;
