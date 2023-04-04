import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class AppService {
  private logger: Logger = new Logger(AppService.name);
  private _users = [];

  constructor(private readonly eventEmitter: EventEmitter2) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(input: any) {
    this.logger.log('creating user', input);
    this._users.push(input);
    const userId = '123';
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(userId, input.email),
    );
  }

  @OnEvent('user.created')
  welcomingUser(payload: UserCreatedEvent) {
    this.logger.log('welcoming user', payload.email);
  }

  @OnEvent('user.created', { async: true })
  async sendingGift(payload: UserCreatedEvent) {
    this.logger.log('sending gift to user', payload.email);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    this.logger.log('gift sent to user', payload.email);
  }
}
