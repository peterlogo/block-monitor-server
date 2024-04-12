import Fastify from 'fastify';
import { config } from './config';
import { pinoLogLevel, pinoTransport } from './services';
import { HOST_IP } from './utils';
import { initializeMongoDB } from './db';

const server = Fastify({
  logger: {
    level: pinoLogLevel,
    stream: pinoTransport
  }
});

server.get('/', async (_, reply) => {
  reply.code(200).send({ message: 'Hello, world!' });
});

// Initialize MongoDB connection before starting the server.
// This is to ensure that the server does not start if the MongoDB connection fails.
Promise.all([initializeMongoDB()]).then(() => {
  server.listen({ port: config.PORT, host: HOST_IP }, (err, __) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  });
});
