/** Node environment type definition. */
export type NodeEnv = 'development' | 'production';

/** Server configuration type definition. */
export interface Config {
  MONGO_URI: string;
  PORT: number;
  NODE_ENV: NodeEnv;
  ROUTES_PREFIX: string;
}
