import { DBSchema } from 'src/common/enum/db-schemas.enum';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
  } from 'typeorm';


@Entity({ name: 'candidate', schema: DBSchema.SCM_ARI_PUBLIC })
export class Candidate extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  fullName: string;

  @Column()
  privateEmail: string;

  @Column()
  phoneNumber: string;

  @Column()
  experience:string;

  @Column()
  highestEducation:string;

  @Column()
  university:string;

  @Column()
  courseOfStudy:string;

  @Column()
  websiteUrl:string;

  @Column()
  informationChannel:string;

  @Column()
  note:string;

  @Column()
  resumeFile:string;

  @Column()
  coverLetterFile:string;

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
}
