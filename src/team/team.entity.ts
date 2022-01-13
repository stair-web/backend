import { DBSchema } from "src/common/enum/db-schemas.enum";
import { UserInformation } from "src/user-information/user-information.entity";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity({ name: 'team', schema: DBSchema.SCM_ARI_PUBLIC })
export class Team extends BaseEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    uuid: string;

    @Column()
    name: string;

    @Column()
    leaderId: number;

    @Column()
    isDeleted: boolean

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @OneToOne(type => UserInformation, user => user.team)
    @JoinColumn({ name: 'leader_id', referencedColumnName: 'userId' })
    leader: UserInformation;
}