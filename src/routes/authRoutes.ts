import type { FastifyInstance } from 'fastify';
import { authController } from '../controllers';
import { LoginBodySchema, RegisterBodySchema } from '../schemas';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    {
      schema: {
        body: RegisterBodySchema
      }
    },
    (request, reply) => authController.register(request, reply)
  );
  fastify.post(
    '/login',
    {
      schema: {
        body: LoginBodySchema
      }
    },
    (request, reply) => authController.login(request, reply)
  );
  fastify.post('/logout', (request, reply) =>
    authController.logout(request, reply)
  );
}
