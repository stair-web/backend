import { Repository, EntityRepository } from "typeorm";
import { UserRole } from "./user-role.entity";

@EntityRepository(UserRole)
export class UserRoleRepository extends Repository<UserRole>{

}