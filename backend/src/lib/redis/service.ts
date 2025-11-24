import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('REDIS_CONNECTION') private readonly redis: Redis) { }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  /**
   * Get Redis information
   */
  async getRedisInfo(): Promise<string> {
    return await this.redis.info();
  }

  /**
   * Check Redis connection
   */
  async ping(): Promise<string> {
    return await this.redis.ping();
  }

  /**
   * Set value with TTL
   */
  async setex(key: string, ttl: number, value: string): Promise<void> {
    await this.redis.setex(key, ttl, value);
  }

  /**
   * Get value
   */
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  /**
   * Delete value
   */
  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }

  /**
   * Set TTL for key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    return !!(await this.redis.expire(key, ttl)); // 1 if success, 0 if key does not exist -> true / false
  }

  /**
   * Get TTL of key
   */
  async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key);
  }

  /**
   * Add element to set
   */
  async sadd(key: string, ...members: string[]): Promise<number> {
    return await this.redis.sadd(key, ...members);
  }

  /**
   * Remove element from set
   */
  async srem(key: string, ...members: string[]): Promise<number> {
    return await this.redis.srem(key, ...members);
  }

  /**
   * Get all elements of set
   */
  async smembers(key: string): Promise<string[]> {
    return await this.redis.smembers(key);
  }

  /**
   * Find keys by pattern
   */
  async keys(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern);
  }
}
