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
  @Column()
  fullName: string;

  @ApiProperty()
  @Column()
  note: string;

  @ApiProperty()
  @Column({ length: 50 })
  phoneNumber: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sendTime: Date;


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


  async validateEmail(email: string): Promise<boolean> {
    return email === this.email;
  }
}
