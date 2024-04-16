import Fastify from 'fastify';
import { config } from './config';
import { pinoLogLevel, pinoTransport } from './services';
import { HOST_IP } from './utils';
import { initializeMongoDB } from './db';
import { registerRoutes } from './routes';
import { registerPlugins } from './plugin';

const server = Fastify({
  logger: {
    level: pinoLogLevel,
    stream: pinoTransport
  }
});

// Initialize server
async function initializeServer() {
  try {
    await initializeMongoDB();
    registerPlugins(server);
    registerRoutes(server);
    await server.listen({ port: config.PORT || 3001, host: HOST_IP });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

export { initializeServer };
