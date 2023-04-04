import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from 'src/app.service';

@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('create-user')
  async createUser(@Body() body: any) {
    console.log('creating user');
    return this.appService.createUser(body);
  }
}
