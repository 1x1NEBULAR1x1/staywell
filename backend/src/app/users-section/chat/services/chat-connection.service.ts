import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/lib/redis';
import { Server } from 'socket.io';

@Injectable()
export class ChatConnectionService {
  constructor(
    private readonly redis: RedisService,
  ) { }

  /**
   * Add connected user to chat
   */
  async addConnectedUser(user_id: string, socket_id: string): Promise<void> {
    const key = this.getConnectedUserKey(user_id);
    await this.redis.sadd(key, socket_id);
    // Set TTL on 24 hours for automatic cleanup
    await this.redis.expire(key, 24 * 60 * 60);
  }

  /**
   * Remove connected user
   */
  async removeConnectedUser(user_id: string, socket_id: string): Promise<void> {
    const key = this.getConnectedUserKey(user_id);
    await this.redis.srem(key, socket_id);
  }

  /**
   * Get all sockets of connected user
   */
  async getConnectedUserSockets(user_id: string): Promise<string[]> {
    const key = this.getConnectedUserKey(user_id);
    return await this.redis.smembers(key);
  }

  /**
   * Check online status of user
   */
  async isUserOnline(user_id: string): Promise<boolean> {
    const sockets = await this.getConnectedUserSockets(user_id);
    return sockets.length > 0;
  }

  /**
   * Get list of all online users
   */
  async getOnlineUsers(): Promise<string[]> {
    const pattern = this.getConnectedUserKey('*');
    const keys = await this.redis.keys(pattern);
    const online_users: string[] = [];

    for (const key of keys) {
      const user_id = key.replace('chat:connected:', '');
      if (await this.isUserOnline(user_id)) {
        online_users.push(user_id);
      }
    }

    return online_users;
  }

  /**
   * Get connected user key
   */
  private getConnectedUserKey(user_id: string): string {
    return `chat:connected:${user_id}`;
  }
}
