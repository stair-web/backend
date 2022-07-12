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
export class Customer  {
 
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
    uuid: string;

  @Column()
  note: string;

  @Column()
  message: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sendTime: Date;

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

  
@Column(
  )
  isDeleted: boolean;


  async validateEmail(email: string): Promise<boolean> {
    return email === this.email;
  }
}
