import type { Types } from 'mongoose';
import type { FastifyRequest, FastifyReply } from 'fastify';

/** Webhook data type definition */
export interface IWebhook {
  _id?: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  url: string;
  address: string;
  token: Token;
  isActive?: boolean;
}

/** Supported token types */
export enum Token {
  SOLANA = 'solana'
}

/** Webhook Data Access Object */
export interface IWebhookDataAccessObject {
  create(webhook: IWebhook): Promise<IWebhook>;
  getById(id: string): Promise<IWebhook | null>;
  getByUserId(userId: string): Promise<IWebhook[]>;
  getByAddress(address: string): Promise<IWebhook | null>;
  update(id: string, webhook: Partial<IWebhook>): Promise<IWebhook | null>;
  delete(id: string): Promise<IWebhook | null>;
}

/** Webhook service type definition */
export interface IWebhookService {
  create(webhook: IWebhook): Promise<IWebhook>;
  getById(id: string): Promise<IWebhook | null>;
  getByUserId(userId: string): Promise<IWebhook[]>;
  getByAddress(address: string): Promise<IWebhook | null>;
  update(id: string, webhook: Partial<IWebhook>): Promise<IWebhook | null>;
  delete(id: string): Promise<IWebhook | null>;
}

/** Webhook controller type definition */
export interface IWebhookController {
  createWebhook(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getWebhook(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getWebhooks(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  updateWebhook(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteWebhook(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  testWebhook(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

/** Create webhook body type definition */
export type CreateWebhookBody = Pick<IWebhook, 'url' | 'address' | 'token'>;
