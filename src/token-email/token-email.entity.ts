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
  created_at: Date;

  @Column()
  is_expired: boolean;

  @Column()
  updated_at: Date;

  @Column()
  created_by_id: number;

  @Column()
  token_email: string;

  @Column()
  user_id: number;

  @Column()
  type: TokenEmailType;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  appUser: User;
}
