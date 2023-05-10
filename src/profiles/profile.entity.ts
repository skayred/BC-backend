import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'first_name' })
  public firstName: string;

  @Column({ name: 'last_name' })
  public lastName: string;

  @OneToMany(() => Role, (role: Role) => role.profile)
  roles: Role[];
}
