import {
  Body,
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';

@UseInterceptors(CacheInterceptor)
@Controller('cache')
export class CacheManagerController {
  constructor(private readonly cacheManagerService: CacheManagerService) {}

  @Post('cache-user')
  async createUserCache(@Body() body: any) {
    console.log('creating user');
    return this.cacheManagerService.createUserCache(body);
  }

  @CacheTTL(60)
  @Get('cache-user')
  async listUserCache() {
    console.log('creating user');
    return this.cacheManagerService.listUserCache();
  }
}
