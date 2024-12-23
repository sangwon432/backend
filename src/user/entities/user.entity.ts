import { BaseEntity } from '../../common/base.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Provider } from './provider.enum';
import { Profile } from '../../profile/entities/profile.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  public provider: Provider;

  @OneToOne(() => Profile, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public profile: Profile;

  @BeforeInsert()
  async beforeSaveFunction(): Promise<void> {
    const saltValue = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltValue);
  }
}
