import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../user/entities/user.entity';
import { Education } from '../../common/enums/education.enum';
import { Gender } from '../../common/enums/gender.enum';

@Entity()
export class Profile extends BaseEntity {
  @OneToOne(() => User, (user: User) => user.profile)
  @JoinColumn()
  public user: User;

  @Column()
  public addressFirstLine: string;

  @Column()
  public addressSecondLine: string;

  @Column()
  public occupation: string;

  @Column({
    type: 'enum',
    enum: Education,
    default: Education.highSchool,
  })
  public education: Education;

  @Column()
  public birthDate: Date;

  @Column()
  public age: number;

  @Column()
  public height: number;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Others,
  })
  public gender: Gender;

  //User
  //주소 1, 주소 2,
  // 직업
  //학력
  // 나이
  // 키
  // 생년월일 (나이)
  // 성별
  // 혈액형
  // MBTI
  // @BeforeInsert()
  // @BeforeUpdate()
  // calculateAge() {
  //   const today = new Date();
  //   const birthDate = new Date(this.birthDate);
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDiff = today.getMonth() - birthDate.getMonth();
  //   if (
  //     monthDiff < 0 ||
  //     (monthDiff === 0 && today.getDate() < birthDate.getDate())
  //   ) {
  //     age--;
  //   }
  //   this.age = age;
  // }
}

//
