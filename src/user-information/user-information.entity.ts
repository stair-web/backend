import { BaseEntity, Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from "src/user/user.entity";
import { DBSchema } from "src/common/enum/db-schemas.enum";
import { DayOff } from "src/dayoff/dayoff.entity";
import { Team } from "src/team/team.entity";

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
    startDate?: Date;

    @Column()
    shortDescription: string;

    @Column()
    position: string;

    @Column()
    staffId: string;

    @Column()
    priority: number;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    startingDate: Date;

    @Column()
    remain: number;

    @Column()
    remote_remain_in_month: number;

    @Column()
    remote_day_in_year: number;

    @Column()
    dateOffNextYear: number;

    @Column()
    teamId: number;

    @OneToOne(type => Team, team => team.id)
    @JoinColumn({ name: 'team_id', referencedColumnName: 'id' })
    team: Team;

    @OneToOne(type => User, user => user.id)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @OneToOne(type => DayOff, dayoff => dayoff.staff)
    dayoff: DayOff;
  userInformation: any;


}