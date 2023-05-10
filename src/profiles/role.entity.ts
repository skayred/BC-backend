import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'external_name' })
  public externalName: string;

  @Column({ name: 'profileId' })
  public profileID: number;

  @ManyToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
