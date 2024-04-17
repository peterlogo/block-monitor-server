import { Redis } from 'ioredis';
import type { IAddressStore } from '../../types/solana';
import { logger } from '../logger';
import { SOLANA_ADDRESS_KEY } from '../../utils';

/**
 * AddressStore class to store and retrieve addresses from redis.
 * Uses sorted set to store addresses.
 * The score is the timestamp when the address was added.
 * @class
 * @implements {IAddressStore}
 */
export class AddressStore implements IAddressStore {
  private redis: Redis;

  constructor({ redis }: { redis: Redis }) {
    this.redis = redis;
  }

  async add(address: string): Promise<void> {
    try {
      const key = SOLANA_ADDRESS_KEY;
      const timeStamp = Date.now();
      await this.redis.zadd(key, timeStamp, address);
    } catch (error) {
      logger.error({ error, address }, 'Failed to add address to redis');
      throw error;
    }
  }

  async getAll(): Promise<string[]> {
    try {
      const key = SOLANA_ADDRESS_KEY;
      const addresses = await this.redis.zrange(key, 0, -1);
      return addresses;
    } catch (error) {
      logger.error({ error }, 'Failed to get all addresses from redis');
      throw error;
    }
  }

  async remove(address: string): Promise<void> {
    try {
      const key = SOLANA_ADDRESS_KEY;
      await this.redis.zrem(key, address);
    } catch (error) {
      logger.error({ error, address }, 'Failed to remove address from redis');
      throw error;
    }
  }
}
