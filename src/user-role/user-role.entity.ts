import { BaseEntity, Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/user.entity";
import { Role } from "src/role/role.entity";
import { DBSchema } from "src/common/enum/db-schemas.enum";

@Entity({ name: 'user_role', schema: DBSchema.SCM_ARI_PUBLIC })
export class UserRole extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    roleCode: string;

    @Column()
    isActive: boolean;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    isDeleted: boolean;

    @ManyToOne(type => User, user => user.role)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @ManyToOne(type => Role, role => role.user)
    @JoinColumn({ name: 'role_code', referencedColumnName: 'roleCode' })
    role: Role;
}