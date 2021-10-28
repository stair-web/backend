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

@Entity({ name: 'topic', schema: 'public' })
export class Topic extends BaseEntity {
  constructor(partial: Partial<Topic>) {
    super();
    Object.assign(this, partial);
  }
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  topicName: string;

  @OneToMany(() => Post, (post: Post) => post.category)
  public posts: Post[];
}
