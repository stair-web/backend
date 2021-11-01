import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Category } from 'src/category/category.entity';
import { Topic } from 'src/topic/topic.entity';

@Entity({ name: 'post', schema: 'public' })
export class Post extends BaseEntity {
  constructor(partial: Partial<Post>) {
    super();
    Object.assign(this, partial);
  }
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  shortDescription: string;

  @ApiProperty()
  @Column()
  dateTime: Date;

  @ApiProperty()
  @Column()
  imageSrc: string;

  @ApiProperty()
  @Column()
  priority: string;

  @ManyToOne(() => Category, (category: Category) => category.posts, {
    eager: false,
  })
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Topic, (topic: Topic) => topic.posts, {
    eager: false,
  })
  @JoinColumn()
  topic: Topic;

  @ApiProperty()
  @Column()
  status: string;

  @ApiProperty()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ApiProperty()
  @Column()
  isDeleted: boolean;
}
