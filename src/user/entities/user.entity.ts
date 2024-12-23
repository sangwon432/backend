import { BaseEntity } from '../../common/base.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Provider } from './provider.enum';
import { Profile } from '../../profile/entities/profile.entity';
import { AgreeOfTerm } from '../../agree-of-terms/entities/agree-of-term.entity';
import { InternalServerErrorException } from '@nestjs/common';
import * as gravatar from 'gravatar';

@Entity()
export class User extends BaseEntity {
  @Column()
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ type: 'text', array: true, nullable: true })
  public profileImg?: string[];

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  public provider: Provider;

  @OneToOne(() => AgreeOfTerm, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public agree: AgreeOfTerm;

  @OneToOne(() => Profile, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public profile: Profile;

  @BeforeInsert()
  async beforeSaveFunction(): Promise<void> {
    try {
      this.profileImg = [
        gravatar.url(this.email, {
          s: '200',
          r: 'pg',
          d: 'mm',
          protocol: 'https',
        }),
      ];

      const saltValue = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltValue);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
