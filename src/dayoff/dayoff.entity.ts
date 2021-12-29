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
import { UserInformation } from 'src/user-information/user-information.entity';

@Entity({name : 'dayoff', schema: DBSchema.SCM_ARI_PUBLIC})
export class DayOff  extends BaseEntity {
    constructor(partial: Partial<DayOff>) {
        super();
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uuid: string;

    @Column()
    dateLeave: Date;

    @Column()
    staffId: number

    @Column()
    time: number

    @Column()
    type: number;

    @Column()
    status: string;

    @Column()
    reason: string;

    @Column()
    timeNumber: number;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    approvedById: number;

    @Column()
    approvedAt: Date;

    @Column()
    isDeleted: Date;

    @OneToOne(type => UserInformation, staff => staff.dayoff)
    @JoinColumn({ name: 'staff_id', referencedColumnName: 'userId' })
    staff: UserInformation;

    

}