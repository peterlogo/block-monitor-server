import Redis from 'ioredis';
import type { RedisOptions } from 'ioredis';
import { URL } from 'url';
import { config } from '../config';
import { logger } from '../services';

const redisUrl = new URL(config.REDIS_URI);

const baseOptions: RedisOptions = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port, 10),
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: null
};

/** Redis connection options */
const redisOptions: RedisOptions = {
  ...baseOptions,
  password: redisUrl.password,
  ...(config.NODE_ENV !== 'development'
    ? { tls: {}, username: redisUrl.username }
    : {})
};

/** Redis client instance */
const redis = new Redis(redisOptions);

const initializeRedisListeners = (): void => {
  redis.on('connect', () => {
    logger.info('Redis connected to server');
  });
  redis.on('reconnecting', () => {
    logger.info('Redis reconnecting...');
  });
  redis.on('error', (error) => {
    logger.error({ error }, `Redis connection error: ${error.message}`);
  });
};

export { redis, initializeRedisListeners };
