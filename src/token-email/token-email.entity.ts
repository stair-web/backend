import { TokenEmailType } from 'src/common/enum/token-email-type.enum';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TokenEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  isExpired: boolean;

  @Column()
  updatedAt: Date;

  @Column()
  createdById: number;

  @Column()
  tokenEmail: string;

  @Column()
  type: TokenEmailType;

  @Column()
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  appUser: User;
}
