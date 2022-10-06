import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    OneToOne,
    JoinColumn,
    ManyToOne,
  } from 'typeorm';
  import { DBSchema } from 'src/common/enum/db-schemas.enum';
  import { UserInformation } from 'src/user-information/user-information.entity';
import { User } from 'src/user/user.entity';
  
  @Entity({ name: 'user_language', schema: DBSchema.SCM_ARI_PUBLIC })
  export class UserLanguage extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userId: number;

    @Column()
    username: string;
    
    @Column()
    profilePhotoKey: string;

    @Column()
    position: string;

    @Column()
    description: string;

    @Column()
    language: string;

    @Column()
    isDeleted: boolean;
  
  
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
  
    @ManyToOne(type => User, user => user.userLanguage)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
  
  }
  