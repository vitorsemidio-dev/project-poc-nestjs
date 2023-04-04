import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create-user')
  async createUser(@Body() body: any) {
    console.log('creating user');
    return this.appService.createUser(body);
  }
}
