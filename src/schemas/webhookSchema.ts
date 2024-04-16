import type { JSONSchemaType } from 'ajv';
import { CreateWebhookBody, Token } from '../types/webhook';

export const CreateWebhookBodySchema: JSONSchemaType<CreateWebhookBody> = {
  type: 'object',
  required: ['url', 'address', 'token'],
  properties: {
    url: { type: 'string', format: 'uri' },
    address: { type: 'string' },
    token: { type: 'string', enum: Object.values(Token) }
  },
  additionalProperties: false
};

export const WebhookParamsSchema: JSONSchemaType<{ id: string }> = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' }
  },
  additionalProperties: false
};
