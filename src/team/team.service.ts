import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { Team } from "./team.entity";

@Injectable()
export class TeamService {
  constructor() {
  }
  async addTeam(
    transactionManager: EntityManager,
  ) {
    return 1;
  }
  async getListTeam(
    transactionManager: EntityManager,
  ) {
     const data =  transactionManager.getRepository(Team).find({isDeleted:false})
    return data;
  }
}