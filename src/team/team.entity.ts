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
import { User } from 'src/user/user.entity';

  @Entity({ name: 'team', schema: DBSchema.SCM_ARI_PUBLIC })
export class Team {
    @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  uuid: string;


  @OneToOne((type) => User, (user) => user.id)
  @JoinColumn({ name: 'leader_id', referencedColumnName: 'id' })
  leader: User;

  @ApiProperty()
  @Column()
  isDeleted: boolean;

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

 
}
