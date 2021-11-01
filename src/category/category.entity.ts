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

@Entity({ name: 'category', schema: 'public' })
export class Category extends BaseEntity {
  constructor(partial: Partial<Category>) {
    super();
    Object.assign(this, partial);
  }
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  categoryName: string;

  @OneToMany(() => Post, (post: Post) => post.category)
  public posts: Post[];
}
