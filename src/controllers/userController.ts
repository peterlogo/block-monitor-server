import type { FastifyRequest, FastifyReply } from 'fastify';
import type { IUserController, IUserService, User } from '../types/user';

/**
 * User Controller.
 * Handles user related operations.
 * @class
 * @implements {IUserController}
 * @param {Object} dependencies - Object of dependencies.
 */
export class UserController implements IUserController {
  private userService: IUserService;

  constructor({ userService }: { userService: IUserService }) {
    this.userService = userService;
  }

  /**
   * Get user by id.
   * GET /users/:id
   * @param request
   * @param reply
   * @returns
   */
  async getUserById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const user = await this.userService.getUserById(id);
      if (!user) {
        reply.status(404).send({ message: 'User not found' });
        return;
      }
      reply.status(200).send({ data: user });
    } catch (error) {
      reply.status(500).send({ message: 'Internal Server Error' });
    }
  }

  /**
   * Update user by id.
   * PATCH /users/:id
   * @param request
   * @param reply
   * @returns
   */
  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = request.body as User;
      const user = await this.userService.updateUser(id, data);
      if (!user) {
        reply.status(404).send({ message: 'User not found' });
        return;
      }
      reply.status(200).send({ data: user });
    } catch (error) {
      reply.status(500).send({ message: 'Internal Server Error' });
    }
  }

  /**
   * Delete user by id.
   * DELETE /users/:id
   * @param request
   * @param reply
   * @returns
   */
  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const user = await this.userService.deleteUser(id);
      if (!user) {
        reply.status(404).send({ message: 'User not found' });
        return;
      }
      reply.status(200).send({ data: user });
    } catch (error) {
      reply.status(500).send({ message: 'Internal Server Error' });
    }
  }
}
