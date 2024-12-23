import { BaseEntity } from '../../common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public price: number;

  @Column()
  public brand: string;

  @Column()
  public category: string;
}
