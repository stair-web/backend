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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  dateTime: Date;

  @Column()
  imageSrc: string;

  @Column()
  priority: string;


  @Column()
  language: string;

  @ManyToOne(() => Category, (category: Category) => category.posts, {
    eager: false,
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @ManyToOne(() => Topic, (topic: Topic) => topic.posts, {
    eager: false,
  })
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic: Topic;

  @Column()
  status: string;

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

  @Column()
  isDeleted: boolean;

  @Column()
  isApproved: boolean;

  @Column()
  content: string;

  @Column()
  otherLanguageContent: string;

  @Column()
  otherLanguageTitle: string;

  @Column()
  uuid: string;

  @Column()
  refUuid: string;

  @Column()
  fileType: string;
}
