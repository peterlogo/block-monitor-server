import type { JSONSchemaType } from 'ajv';
import type { Config } from '../types/config';

/**
 * JSON schema for the server configuration.
 * This schema is used to validate the server configuration.
 * @type {JSONSchemaType<Config>}
 */
export const schema: JSONSchemaType<Config> = {
  type: 'object',
  properties: {
    MONGO_URI: { type: 'string' },
    PORT: { type: 'number' },
    NODE_ENV: { type: 'string', enum: ['development', 'production'] },
    ROUTES_PREFIX: { type: 'string' },
    JWT_SECRET: { type: 'string' },
    SOLANA_RPC_URL: { type: 'string' },
    SOLANA_WS_URL: { type: 'string' },
    REDIS_URI: { type: 'string' }
  },
  required: [
    'MONGO_URI',
    'PORT',
    'NODE_ENV',
    'ROUTES_PREFIX',
    'JWT_SECRET',
    'SOLANA_RPC_URL',
    'SOLANA_WS_URL',
    'REDIS_URI'
  ],
  additionalProperties: false
};
