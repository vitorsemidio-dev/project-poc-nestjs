import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  avatar?: string;
}
