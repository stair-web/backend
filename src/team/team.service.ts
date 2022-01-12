import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { CreateTeamDto } from "./dto/create-team.dto";
import { Team } from "./team.entity";
import { TeamRepository } from "./team.repository";

@Injectable()
export class TeamService {
  removeTeam(transactionManager: EntityManager, uuid: string) {
    return this.teamRepo.removeTeam(transactionManager, uuid);

  }
 

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
    const data = transactionManager.getRepository(Team).find({ where: { isDeleted: false }, relations: ['leader'] })
    return data;
  }
  async getDetail(transactionManager: EntityManager, uuid: string): Promise<unknown> {
    
    const data = await transactionManager.getRepository(Team).findOne({ where: { isDeleted: false, uuid }, relations: ['leader'] })
    
    return data;
  }
  updateTeam(transactionManager: EntityManager, createTeamDto: CreateTeamDto): Promise<unknown> {
    return this.teamRepo.updateTeam(transactionManager, createTeamDto);
  }
 
}