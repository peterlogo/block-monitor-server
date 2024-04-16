import type { Model } from 'mongoose';
import type { IWebhook, IWebhookDataAccessObject } from '../types/webhook';
import { logger } from '../services';

/**
 * Webhook Data Access Object.
 * It is used to interact with the database and perform CRUD operations.
 * @class
 * @implements {IWebhookDataAccessObject}
 * @param model - Webhook model. It is an instance of the Webhook model.
 * @example
 * const webhookDao = new WebhookDao({ model });
 * const webhook = await webhookDao.create({ userId, url, address, token, isActive });
 * const webhook = await webhookDao.getById(id);
 * const webhooks = await webhookDao.getByUserId(userId);
 */
export class WebhookDao implements IWebhookDataAccessObject {
  private model: Model<IWebhook>;

  constructor({ model }: { model: Model<IWebhook> }) {
    this.model = model;
  }

  async create(webhook: IWebhook): Promise<IWebhook> {
    try {
      return await this.model.create(webhook);
    } catch (error) {
      logger.error({ error }, 'Failed to create webhook');
      throw error;
    }
  }

  async getById(id: string): Promise<IWebhook | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      logger.error({ error }, 'Failed to get webhook by id');
      throw error;
    }
  }

  async getByUserId(userId: string): Promise<IWebhook[]> {
    try {
      return await this.model.find({ userId });
    } catch (error) {
      logger.error({ error }, 'Failed to get webhook by userId');
      throw error;
    }
  }

  async getByAddress(address: string): Promise<IWebhook | null> {
    try {
      return await this.model.findOne({ address });
    } catch (error) {
      logger.error({ error }, 'Failed to get webhook by address');
      throw error;
    }
  }

  async update(
    id: string,
    webhook: Partial<IWebhook>
  ): Promise<IWebhook | null> {
    try {
      return await this.model.findByIdAndUpdate(id, webhook, { new: true });
    } catch (error) {
      logger.error({ error }, 'Failed to update webhook');
      throw error;
    }
  }

  async delete(id: string): Promise<IWebhook | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      logger.error({ error }, 'Failed to delete webhook');
      throw error;
    }
  }
}
