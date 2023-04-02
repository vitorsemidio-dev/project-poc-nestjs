import { randomInt } from 'crypto';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export class InMemoryRepository<T> {
  private readonly data: T[] = [];

  private _generateId(): number {
    const min = 1;
    const max = 1000;
    return randomInt(min, max);
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    if (!options) {
      return this.data;
    }

    return this.data.filter((entity) => {
      let includeEntity = true;

      if (options.where) {
        includeEntity = Object.entries(options.where).every(([key, value]) => {
          return entity[key] === value;
        });
      }

      return includeEntity;
    });
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    const result = this.data.find((item) => {
      let matches = true;
      for (const [key, value] of Object.entries(options.where || {})) {
        if (item[key] !== value) {
          matches = false;
          break;
        }
      }
      return matches;
    });
    return result ?? null;
  }

  create(entity: Partial<T>): T {
    return entity as T;
  }

  async save(entity: T): Promise<T> {
    if (entity['id']) {
      return this.update(entity['id'], entity);
    }
    entity['id'] = this._generateId();
    this.data.push(entity);
    return entity;
  }

  async update(id: number, entity: T): Promise<T> {
    const index = this.data.findIndex((item) => item['id'] === id);
    if (index >= 0) {
      this.data[index] = entity;
      return entity;
    }
    return undefined;
  }

  async delete(id: number): Promise<void> {
    const index = this.data.findIndex((item) => item['id'] === id);
    if (index >= 0) {
      this.data.splice(index, 1);
    }
  }
}
