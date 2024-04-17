import { Redis } from 'ioredis';
import type { ISignatureStore, SignatureParams } from '../../types/solana';
import { SOLANA_SIGNATURE_PREFIX } from '../../utils';
import { logger } from '../logger';

/**
 * SignatureStore class to store and retrieve signatures from redis.
 * Uses sorted set to store signatures.
 * The score is the block time when the signature was added.
 * @class
 * @implements {ISignatureStore}
 */
export class SignatureStore implements ISignatureStore {
  private redis: Redis;

  constructor({ redis }: { redis: Redis }) {
    this.redis = redis;
  }

  async add(params: SignatureParams): Promise<void> {
    try {
      const { address, signature, blockTime } = params;
      const key = `${SOLANA_SIGNATURE_PREFIX}${address}`;
      await this.redis.zadd(key, blockTime, signature);
    } catch (error) {
      logger.error({ error }, 'Failed to add signature to redis');
      throw error;
    }
  }

  async get(address: string, count: number): Promise<string[]> {
    try {
      const key = `${SOLANA_SIGNATURE_PREFIX}${address}`;
      const amount = count - 1;
      const response = await this.redis.zrevrange(key, 0, amount, 'WITHSCORES');
      return response;
    } catch (error) {
      logger.error({ error }, 'Failed to get signature from redis');
      throw error;
    }
  }

  async remove(address: string): Promise<void> {
    try {
      const key = `${SOLANA_SIGNATURE_PREFIX}:${address}`;
      await this.redis.del(key);
    } catch (error) {
      logger.error({ error }, 'Failed to remove signature from redis');
      throw error;
    }
  }
}
