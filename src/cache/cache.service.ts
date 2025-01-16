/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }
}

export class MockCacheService {
  async get<T>(_key: T, override?: T): Promise<T | undefined> {
    return override ? override : undefined;
  }

  async set(_key: string, _value: any, _ttl?: number): Promise<void> {
    return;
  }

  async del(_key: string): Promise<void> {
    return;
  }

  async reset(): Promise<void> {
    return;
  }
}
