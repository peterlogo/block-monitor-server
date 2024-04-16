import type { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyBcrypt from 'fastify-bcrypt';
import { config } from './config';
import {
  CORS_ORIGIN,
  JWT_COOKIE_NAME,
  JWT_EXPIRATION_TIME,
  cookieOptions
} from './utils';

export function registerPlugins(server: FastifyInstance): void {
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
