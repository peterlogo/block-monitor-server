/** Node environment type definition. */
export type NodeEnv = 'development' | 'production';

/** Server configuration type definition. */
export interface Config {
  MONGO_URI: string;
  PORT: number;
  NODE_ENV: NodeEnv;
  ROUTES_PREFIX: string;
}

/**
 * Synchronous callback function type definition.
 */
type SyncCallBackFunction = (...args: any[]) => void;

/**
 * Asynchronous callback function type definition.
 */
type AsyncCallBackFunction = (...args: any[]) => Promise<void>;

/**
 * Callback function type definition.
 * It can be either synchronous or asynchronous.
 */
export type CallBackFunction = SyncCallBackFunction | AsyncCallBackFunction;
