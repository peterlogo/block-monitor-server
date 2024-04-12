import Fastify from 'fastify';
import { config } from './config';

const server = Fastify();

server.get('/', async (_, reply) => {
  reply.code(200).send({ message: 'Hello, world!' });
});

server.listen({ port: config.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
