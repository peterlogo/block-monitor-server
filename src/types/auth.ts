import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IUserService, User } from './user';

/** Auth Controller methods type definition */
export interface IAuthController {
  register(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  login(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  logout(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

/** Register body type definition */
export type RegisterBody = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'password'
>;

/** Login body type definition */
export type LoginBody = Pick<User, 'email' | 'password'>;

/** Auth Controller parameters type definition */
export type AuthControllerParams = { userService: IUserService };
