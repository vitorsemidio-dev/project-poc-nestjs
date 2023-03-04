import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const defaultConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
};

export const testConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.test.sqlite',
  synchronize: true,
};

export const databaseConfig =
  process.env.NODE_ENV === 'test' ? testConfig : defaultConfig;
