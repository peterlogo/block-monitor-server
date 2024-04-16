import type { FastifyInstance } from 'fastify';
import { authRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';
import { config } from '../config';
import { webhookRoutes } from './webhookRoutes';

/**
 * Array of all routes in the application.
 */
const routes = [authRoutes, userRoutes, webhookRoutes];

/**
 * Registers all routes in the application.
 * @param server - Fastify instance.
 */
export function registerRoutes(server: FastifyInstance): void {
  server.get('/', async () => {
    return { message: 'Welcome to the API' };
  });
  routes.forEach((route) =>
    server.register(route, { prefix: config.ROUTES_PREFIX })
  );
}
