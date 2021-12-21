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

@Entity({ name: 'user', schema: DBSchema.SCM_ARI_PUBLIC })
export class User extends BaseEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column()
  uuid: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  isDeleted: boolean;

  @ApiProperty()
  @Column()
  isActive: boolean;

  @ApiProperty()
  @Column()
  isFirstLogin: boolean;

  @ApiHideProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiHideProperty()
  @Column()
  @Exclude()
  salt: string;

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

  @Column()
  staffId: number;

  @OneToMany((type) => UserRole, (role) => role.user)
  role: UserRole[];

  @OneToOne((type) => UserInformation, (userInformation) => userInformation.user)
  userInformation: UserInformation;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  async validateEmail(email: string): Promise<boolean> {
    return email === this.email;
  }
}
