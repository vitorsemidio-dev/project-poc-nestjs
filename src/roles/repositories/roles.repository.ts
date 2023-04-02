import { EntityRepository, Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {}
