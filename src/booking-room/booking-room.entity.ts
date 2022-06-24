import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/user.entity';
import { Room } from 'src/room/model/room.entity';

@Entity()
export class BookingRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookDate: Date;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  createdAt: Date;

  @Column()
  description: string;

  @Column()
  meetingName: string;

  @Column()
  userId: number;

  @Column()
  roomId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToOne(() => Room)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: Room;
}
