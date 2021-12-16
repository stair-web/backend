import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
import { DBSchema } from 'src/common/enum/db-schemas.enum';
import { DayOff } from 'src/dayoff/dayoff.entity';

@Entity({name : 'staff', schema: DBSchema.SCM_ARI_PUBLIC})
export class Staff  extends BaseEntity {
    constructor(partial: Partial<Staff>) {
        super();
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uuid: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    startingDate: Date;

    @Column()
    isDeleted: boolean;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    dob: Date;

    @Column()
    phoneNumber: string;

    @Column()
    description: string;

    @Column()
    position: string;

    @Column()
    status: string;

    @Column()
    avatar: string;

    @Column()
    teamId: number;

    @OneToOne(type => DayOff, dayoff => dayoff.staff)
    staff: Staff;
    

}