import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RolesEnum } from '../enums/roles.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    unique: true,
    enum: RolesEnum,
  })
  name: string;

  @Column({ nullable: true })
  description: string;
}
