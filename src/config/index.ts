import envSchema from 'env-schema';
import { schema } from './schema';
import type { Config } from '../types/config';

/**
 * Validate the server configuration.
 * This function validates the server configuration against the schema.
 * @type {Config}
 */
export const config: Config = envSchema({
  schema,
  data: process.env,
  dotenv: true
});
