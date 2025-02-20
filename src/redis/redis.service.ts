import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async set(key: string, value: string): Promise<'OK'> {
    return this.redis.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async setWithTTL(key: string, value: string, ttl: number | string): Promise<'OK'> {
    if (typeof ttl === 'string') {
      ttl = this.parseTTL(ttl);
    }
    return this.redis.set(key, value, 'EX', ttl);
  }

  async exists(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async decr(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  // New method for caching
  async cache(key: string, value: string, ttl: number): Promise<'OK'> {
    return this.redis.set(key, value, 'EX', ttl);
  }

  async getCached(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  private parseTTL(ttl: string): number {
    const timeUnit = ttl.slice(-1);
    const timeValue = parseInt(ttl.slice(0, -1), 10);

    switch (timeUnit) {
      case 'd':
        return timeValue * 24 * 60 * 60; // days to seconds
      case 'h':
        return timeValue * 60 * 60; // hours to seconds
      case 'm':
        return timeValue * 60; // minutes to seconds
      case 's':
        return timeValue; // seconds
      default:
        throw new Error('Invalid TTL format');
    }
  }
}
