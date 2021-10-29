/* eslint-disable prettier/prettier */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'customer', schema: 'public' })
export class Customer extends BaseEntity {
  constructor(partial: Partial<Customer>) {
    super();
    Object.assign(this, partial);
  }
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column(
    {name:'full_name'}
  )
  fullName: string;

  @ApiProperty()
  @Column()
  note: string;

  @ApiProperty()
  @Column({ length: 50,name:'phone_number' })
  phoneNumber: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    name:'send_time'
  })
  sendTime: Date;


  @ApiProperty()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    name:'created_at'
  })
  createdAt: Date;

  @ApiProperty()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    name:'updated_at'
  })
  updatedAt: Date;

  
  @ApiProperty()
@Column(
  {name:'is_deleted'}
  )
  isDeleted: boolean;


  async validateEmail(email: string): Promise<boolean> {
    return email === this.email;
  }
}
