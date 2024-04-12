import Fastify from 'fastify';
import { config } from './config';
import { pinoLogLevel, pinoTransport } from './services';

const server = Fastify({
  logger: {
    level: pinoLogLevel,
    stream: pinoTransport
  }
});

server.get('/', async (_, reply) => {
  reply.code(200).send({ message: 'Hello, world!' });
});

server.listen({ port: config.PORT, host: '0.0.0.0' }, (err, __) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
