import type { FastifyRequest, FastifyReply } from 'fastify';

/** User object type definition. */
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** User Data Access Object methods type definition. */
export interface IUserDataAccessObject {
  create(user: User): Promise<User>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<User | null>;
}

/** User Service methods type definition. */
export interface IUserService {
  createUser(user: User): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, user: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<User | null>;
}

/** User Controller methods type definition. */
export interface IUserController {
  getUserById(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  updateUser(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteUser(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
