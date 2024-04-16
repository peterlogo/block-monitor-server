import {
  IWebhook,
  IWebhookDataAccessObject,
  IWebhookService
} from '../../types/webhook';

export class WebhookService implements IWebhookService {
  private webhookDao: IWebhookDataAccessObject;

  constructor({ webhookDao }: { webhookDao: IWebhookDataAccessObject }) {
    this.webhookDao = webhookDao;
  }

  async create(webhook: IWebhook): Promise<IWebhook> {
    return await this.webhookDao.create(webhook);
  }

  async getById(id: string): Promise<IWebhook | null> {
    return await this.webhookDao.getById(id);
  }

  async getByUserId(userId: string): Promise<IWebhook[]> {
    return await this.webhookDao.getByUserId(userId);
  }

  async getByAddress(address: string): Promise<IWebhook | null> {
    return await this.webhookDao.getByAddress(address);
  }

  async update(
    id: string,
    webhook: Partial<IWebhook>
  ): Promise<IWebhook | null> {
    return await this.webhookDao.update(id, webhook);
  }

  async delete(id: string): Promise<IWebhook | null> {
    return await this.webhookDao.delete(id);
  }
}
