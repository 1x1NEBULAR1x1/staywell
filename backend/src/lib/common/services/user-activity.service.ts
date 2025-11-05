import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/lib/redis';

@Injectable()
export class UserActivityService {
  constructor(private readonly redis: RedisService) {}

  /**
   * Update last seen time for user
   */
  async updateLastSeen(user_id: string): Promise<void> {
    const key = this.getLastSeenKey(user_id);
    const now = new Date().toISOString();
    // Keep last seen for 30 days
    await this.redis.setex(key, 30 * 24 * 60 * 60, now);
  }

  /**
   * Get last seen time for user
   */
  async getLastSeen(user_id: string): Promise<Date | null> {
    const key = this.getLastSeenKey(user_id);
    const lastSeenStr = await this.redis.get(key);
    return lastSeenStr ? new Date(lastSeenStr) : null;
  }

  /**
   * Get last seen key
   */
  private getLastSeenKey(user_id: string): string {
    return `user:last_seen:${user_id}`;
  }
}
