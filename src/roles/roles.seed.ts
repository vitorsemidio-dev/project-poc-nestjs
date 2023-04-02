import { INestApplication } from '@nestjs/common';
import { RolesEnum } from './enums/roles.enum';
import { RoleRepository } from './repositories/roles.repository';

export async function rolesSeed(app: INestApplication) {
  try {
    const repository = app.get<RoleRepository>(RoleRepository.name);
    const rolesToAdd = Object.values(RolesEnum).map((role) => ({ name: role }));
    await repository.upsert(rolesToAdd, { conflictPaths: ['name'] });
  } catch (err) {
    console.log(err);
  }
}
