import { Repository, EntityRepository } from "typeorm";
import { Team } from "./team.entity";

@EntityRepository(Team)
export class TeamRepository extends Repository<Team>{

}