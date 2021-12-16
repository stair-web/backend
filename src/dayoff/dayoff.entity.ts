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
import { Staff } from 'src/staff/staff.entity';

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
    type: string;

    @Column()
    status: string;

    @Column()
    reason: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    approvedById: number;

    @Column()
    approvedAt: Date;

    @OneToOne(type => Staff, staff => staff.staff)
    @JoinColumn({ name: 'staffId', referencedColumnName: 'id' })
    staff: Staff;

}