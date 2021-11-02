import { BaseEntity, Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { DBSchema } from "src/common/enum/db-schemas.enum";
import { UserRole } from "src/user-role/user-role.entity";

@Entity({ name: 'role', schema: DBSchema.SCM_ARI_PUBLIC })
export class Role extends BaseEntity {
    @PrimaryColumn()
    roleCode: string;

    @Column()
    roleName: string;

    @Column()
    roleDescription: string;

    @OneToMany(type => UserRole, userRole => userRole.role)
    user: UserRole[];
}