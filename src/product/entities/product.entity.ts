import { BaseEntity } from '../../common/base.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as gravatar from 'gravatar';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';

@Entity()
export class Product extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column({ default: 0 })
  public price?: number;

  @Column()
  public brand: string;

  @Column()
  public category: string;

  @Column({ type: 'text', array: true, nullable: true })
  public productImgs?: string[];
}
