import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { config } from './config';
import { pinoLogLevel, pinoTransport } from './services';
import {
  HOST_IP,
  JWT_COOKIE_NAME,
  JWT_EXPIRATION_TIME,
  cookieOptions
} from './utils';
import { initializeMongoDB } from './db';

const server = Fastify({
  logger: {
    level: pinoLogLevel,
    stream: pinoTransport
  }
});

server.register(fastifyJwt, {
  secret: config.JWT_SECRET,
  cookie: {
    cookieName: JWT_COOKIE_NAME,
    signed: config.NODE_ENV !== 'development'
  },
  sign: {
    expiresIn: JWT_EXPIRATION_TIME
  }
});

server.register(fastifyCookie, {
  parseOptions: cookieOptions
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
