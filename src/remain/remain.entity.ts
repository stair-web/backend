import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
  import { Exclude } from 'class-transformer';
  import { DBSchema } from 'src/common/enum/db-schemas.enum';
  import { UserRole } from 'src/user-role/user-role.entity';
  import { UserInformation } from 'src/user-information/user-information.entity';
  
  @Entity({ name: 'remain', schema: DBSchema.SCM_ARI_PUBLIC })
  export class Remain extends BaseEntity {
    constructor(partial: Partial<Remain>) {
      super();
      Object.assign(this, partial);
    }
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    uuid: string;

    @Column()
    staffId: number;

    @Column()
    year: number;

    @Column()
    remain: number;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    
  }
  