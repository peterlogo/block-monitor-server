import type { FastifyInstance } from 'fastify';
import { webhookController } from '../controllers';
import { CreateWebhookBodySchema, WebhookParamsSchema } from '../schemas';

export async function webhookRoutes(fastify: FastifyInstance) {
  // test route as a webhook url
  fastify.post('/webhooks/test', (request, reply) =>
    webhookController.testWebhook(request, reply)
  );

  // Webhook routes
  fastify.post(
    '/webhooks',
    {
      onRequest: (request, _) => request.jwtVerify(),
      schema: {
        body: CreateWebhookBodySchema
      }
    },
    (request, reply) => webhookController.createWebhook(request, reply)
  );
  fastify.get(
    '/webhooks/:id',
    {
      onRequest: (request, _) => request.jwtVerify(),
      schema: { params: WebhookParamsSchema }
    },
    (request, reply) => webhookController.getWebhook(request, reply)
  );
  fastify.delete(
    '/webhooks/:id',
    {
      onRequest: (request, _) => request.jwtVerify(),
      schema: { params: WebhookParamsSchema }
    },
    (request, reply) => webhookController.deleteWebhook(request, reply)
  );
  fastify.get(
    '/webhooks',
    {
      onRequest: (request, _) => request.jwtVerify(),
      schema: { params: WebhookParamsSchema }
    },
    (request, reply) => webhookController.getWebhooks(request, reply)
  );
  fastify.patch(
    '/webhooks/:id',
    {
      onRequest: (request, _) => request.jwtVerify(),
      schema: { params: WebhookParamsSchema }
    },
    (request, reply) => webhookController.updateWebhook(request, reply)
  );
}
