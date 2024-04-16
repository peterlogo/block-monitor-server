import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyBcrypt from 'fastify-bcrypt';
import { config } from './config';
import { pinoLogLevel, pinoTransport } from './services';
import {
  CORS_ORIGIN,
  HOST_IP,
  JWT_COOKIE_NAME,
  JWT_EXPIRATION_TIME,
  cookieOptions
} from './utils';
import { initializeMongoDB } from './db';
import { routes } from './routes';

const server = Fastify({
  logger: {
    level: pinoLogLevel,
    stream: pinoTransport
  }
});

// Register plugins
function registerPlugins() {
  server.register(fastifyCors, {
    origin: CORS_ORIGIN,
    credentials: true
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

  server.register(fastifyHelmet);
  server.register(fastifyBcrypt);
}

// Register routes
function registerRoutes() {
  routes.forEach((route) =>
    server.register(route, { prefix: config.ROUTES_PREFIX })
  );
}

// Initialize server
async function initializeServer() {
  try {
    await initializeMongoDB();
    registerPlugins();
    registerRoutes();
    await server.listen({ port: config.PORT, host: HOST_IP });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

export { initializeServer };
