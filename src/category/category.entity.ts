import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Post } from 'src/post/post.entity';
import { DBSchema } from 'src/common/enum/db-schemas.enum';

@Entity({ name: 'category',  schema: DBSchema.SCM_ARI_PUBLIC })
export class Category extends BaseEntity {
  constructor(partial: Partial<Category>) {
    super();
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  categoryName: string;

  @Column()
  isDeleted: boolean;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Post, (post: Post) => post.category)
  public posts: Post[];
}
