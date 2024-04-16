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
   * Get user profile.
   * Uses the user id from the request
   * to get the user profile.
   * GET /users/profile
   * @param request
   * @param reply
   * @returns
   */
  async getUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.user as { id: string };

      const user = await this.userService.getUserById(id);
      if (!user) {
        reply.code(404).send({ message: 'User not found' });
        return;
      }
      reply.code(200).send({ data: user });
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  /**
   * Update user profile.
   * Uses the user id from the request
   * to update the user profile.
   * PATCH /users/profile
   * @param request
   * @param reply
   * @returns
   */
  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.user as { id: string };

      const data = request.body as User;
      const user = await this.userService.updateUser(id, data);
      if (!user) {
        reply.code(404).send({ message: 'User not found' });
        return;
      }
      reply.code(200).send({ data: user });
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  /**
   * Delete user profile.
   * Uses the user id from the request
   * to delete the user profile.
   * @param request
   * @param reply
   * @returns
   */
  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.user as { id: string };

      const user = await this.userService.deleteUser(id);
      if (!user) {
        reply.code(404).send({ message: 'User not found' });
        return;
      }
      reply.code(200).send({ data: user });
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }
}
