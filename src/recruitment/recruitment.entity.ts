import { DBSchema } from 'src/common/enum/db-schemas.enum';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
  } from 'typeorm';


@Entity({ name: 'recruitment', schema: DBSchema.SCM_ARI_PUBLIC })
export class Recruitment {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;
  
  @Column()
  phoneNumber: string;
  
  @Column()
  position: string;
  
  @Column()
  resumeFile:string;
  
  @Column()
  address: string;
  
  @Column()
  isDeleted:boolean;

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