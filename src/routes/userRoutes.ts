import type { FastifyInstance } from 'fastify';
import { userController } from '../controllers';
import { UpdateUserBodySchema } from '../schemas/userSchema';

export async function userRoutes(fastify: FastifyInstance) {
  // Add hook to verify JWT token on every request
  fastify.addHook('onRequest', (request, _) => request.jwtVerify());

  fastify.get('/users/profile', (request, reply) =>
    userController.getUser(request, reply)
  );
  fastify.patch(
    '/users/profile',
    {
      schema: { body: UpdateUserBodySchema }
    },
    (request, reply) => userController.updateUser(request, reply)
  );
  fastify.delete('/users/profile', (request, reply) =>
    userController.deleteUser(request, reply)
  );
}
