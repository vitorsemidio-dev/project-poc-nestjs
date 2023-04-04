import { Injectable, CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheManagerService {
  private logger: Logger = new Logger(CacheManagerService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async createUserCache(input: any) {
    this.logger.log('creating user cache', input);
    const users = (await this.cacheManager.get<string[]>('users')) || [];
    this.cacheManager.set('users', [...users, input.email]);
  }

  async listUserCache() {
    const users = (await this.cacheManager.get<string[]>('users')) ?? [];
    return users;
  }
}
