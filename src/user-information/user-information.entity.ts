import { BaseEntity, Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from "src/user/user.entity";
import { DBSchema } from "src/common/enum/db-schemas.enum";
import { DayOff } from "src/dayoff/dayoff.entity";

@Entity({ name: 'user_information', schema: DBSchema.SCM_ARI_PUBLIC })
export class UserInformation extends BaseEntity {

    @PrimaryColumn()
    id: number;

    @Column()
    uuid: string;

    @Column()
    userId: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    profilePhotoKey: string;

    @Column()
    phoneNumber: string;

    @Column()
    dob: Date;

    @Column()
    shortDescription: string;

    @Column()
    position: string;

    @Column()
    staffId: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    startingDate: Date;

    @Column()
    remain: number;

    @OneToOne(type => User, user => user.id)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @OneToOne(type => DayOff, dayoff => dayoff.staff)
    dayoff: DayOff;


}