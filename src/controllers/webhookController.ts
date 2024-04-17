import type { FastifyRequest, FastifyReply } from 'fastify';
import type {
  CreateWebhookBody,
  IWebhook,
  IWebhookController,
  IWebhookService
} from '../types/webhook';
import { ISolanaService } from '../types/solana';

/**
 * Webhook Controller.
 * Handles webhook related operations.
 * @class
 * @implements {IWebhookController}
 * @param {Object} dependencies - Object of dependencies.
 */
export class WebhookController implements IWebhookController {
  private webhookService: IWebhookService;
  private solanaService: ISolanaService;

  constructor({
    webhookService,
    solanaService
  }: {
    webhookService: IWebhookService;
    solanaService: ISolanaService;
  }) {
    this.webhookService = webhookService;
    this.solanaService = solanaService;
  }

  /**
   * Create a new webhook for the user.
   * POST /webhooks
   * @param request - Fastify request object
   * @param reply - Fastify reply object
   */
  async createWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.user as { id: string };
      const body = request.body as CreateWebhookBody;

      const newWebhook: IWebhook = {
        userId: id,
        ...body
      };

      if (body.token === 'solana') {
        const isValid = this.solanaService.isValidAddress(body.address);
        if (!isValid) {
          reply.code(400).send({ message: 'Invalid address' });
          return;
        }

        await this.solanaService.addAddressToSubscription(body.address);
      }

      const webhook = await this.webhookService.create(newWebhook);
      reply.code(201).send({ data: webhook });
    } catch (error) {
      reply.code(500).send({ message: 'Failed to create webhook' });
    }
  }

  /**
   * Get a webhook by its id.
   * GET /webhooks/:id
   * @param request - Fastify request object
   * @param reply - Fastify reply object
   */
  async getWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      const webhook = await this.webhookService.getById(id);
      if (!webhook) {
        reply.code(404).send({ message: 'Webhook not found' });
        return;
      }
      reply.code(200).send({ data: webhook });
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  /**
   * Get all webhooks for the user.
   * @param request - Fastify request object
   * @param reply - Fastify reply object
   */
  async getWebhooks(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.user as { id: string };
      const webhooks = await this.webhookService.getByUserId(id);
      reply.code(200).send({ data: webhooks });
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  /**
   * Update a webhook by its id.
   * @param request - Fastify request object
   * @param reply - Fastify reply object
   */
  async updateWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = request.body as Partial<IWebhook>;

      const webhook = await this.webhookService.update(id, data);
      if (!webhook) {
        reply.code(404).send({ message: 'Webhook not found' });
        return;
      }
      reply.code(200).send({ data: webhook });
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  /**
   * Delete a webhook by its id.
   * @param request - Fastify request object
   * @param reply - Fastify reply object
   */
  async deleteWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      const webhook = await this.webhookService.delete(id);
      if (!webhook) {
        reply.code(404).send({ message: 'Webhook not found' });
        return;
      }
      reply.code(200).send({ data: webhook });
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  /**
   * Test endpoint for webhook integration.
   * POST /webhooks/test
   * @param request - Fastify request object
   * @param reply - Fastify reply object
   */
  async testWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      request.log.info({ body }, 'Webhook test received');
      reply.code(200).send({ data: body });
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }
}
