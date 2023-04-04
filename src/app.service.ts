import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { UserCreatedEvent } from 'src/events/user-created.event';

@Injectable()
export class AppService {
  private logger: Logger = new Logger(AppService.name);
  private _users = [];

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async getHello(): Promise<string> {
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
    const establishWsTimeout = setTimeout(() => {
      this.establishingWsConnection(new UserCreatedEvent(userId, input.email));
    }, 5000);
    this.schedulerRegistry.addTimeout(
      'establish-ws-connection',
      establishWsTimeout,
    );
  }

  private establishingWsConnection(payload: UserCreatedEvent) {
    this.logger.log('establishing ws connection', payload.userId);
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

  @Cron(CronExpression.EVERY_10_HOURS, { name: 'delete-users' })
  async cron() {
    const date = new Date();
    this.logger.log('deleting all users', this.formatDatePtBr(date));
  }

  formatDatePtBr(date: Date) {
    const dateFormatter = Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return dateFormatter.format(date);
  }
}
