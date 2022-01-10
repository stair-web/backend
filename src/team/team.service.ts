import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { CreateTeamDto } from "./dto/create-team.dto";
import { Team } from "./team.entity";
import { TeamRepository } from "./team.repository";

@Injectable()
export class TeamService {
  constructor(
    private teamRepo: TeamRepository,
  ) {
  }
  async addTeam(
    transactionManager: EntityManager,
    createTeamDto: CreateTeamDto,
  ) {
    return this.teamRepo.createTeam(transactionManager, createTeamDto);
  }
  async getListTeam(
    transactionManager: EntityManager,
  ) {
    const data = transactionManager.getRepository(Team).find({ where: { isDeleted: false }, relations: ['user'] })
    return data;
  }
}