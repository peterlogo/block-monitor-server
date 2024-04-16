import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  AuthControllerParams,
  IAuthController,
  LoginBody,
  RegisterBody
} from '../types/auth';
import { JWT_COOKIE_NAME } from '../utils';

export class AuthController implements IAuthController {
  private userService: AuthControllerParams['userService'];

  constructor({ userService }: AuthControllerParams) {
    this.userService = userService;
  }

  private async userExists(email: string): Promise<boolean> {
    const user = await this.userService.getUserByEmail(email);
    return !!user;
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as RegisterBody;
      const { email, password } = data;

      const isAlreadyRegistered = await this.userExists(email);
      if (isAlreadyRegistered) {
        reply.code(400).send({ message: 'User already registered' });
        return;
      }

      const hashPassword = await request.bcryptHash(password);
      const user = await this.userService.createUser({
        ...data,
        password: hashPassword
      });

      const token = await reply.jwtSign({ user: user._id });
      reply.setCookie(JWT_COOKIE_NAME, token);
      reply.code(201).send({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as LoginBody;
      const { email, password } = data;

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        reply.code(400).send({ message: 'Invalid credentials' });
        return;
      }

      const isPasswordValid = await request.bcryptCompare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        reply.code(400).send({ message: 'Invalid credentials' });
        return;
      }

      const token = await reply.jwtSign({ user: user._id });
      reply.setCookie(JWT_COOKIE_NAME, token);
      reply.code(200).send({ message: 'Login successful' });
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  async logout(_: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie(JWT_COOKIE_NAME);
    reply.code(200).send({ message: 'Logout successful' });
  }
}
