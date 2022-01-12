import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { uuidv4 } from "src/common/utils/common.util";
import { isNullOrUndefined } from "src/lib/utils/util";
import { User } from "src/user/user.entity";
import { Repository, EntityRepository, EntityManager } from "typeorm";
import { CreateTeamDto } from "./dto/create-team.dto";
import { Team } from "./team.entity";

@EntityRepository(Team)
export class TeamRepository extends Repository<Team>{
  async createTeam(transactionManager: EntityManager, createTeamDto: CreateTeamDto) {
   const findDup =  await transactionManager.getRepository(Team).findOne({name:createTeamDto.name})
   if(! isNullOrUndefined(findDup)){
       throw new ConflictException('Team này đã tồn tại.!');
   }
   let leaderId;
   if(createTeamDto.leaderId){
    const findLeader = await transactionManager.getRepository(User).findOne({id:createTeamDto.leaderId});
    if(! isNullOrUndefined(findLeader)){
        throw new ConflictException('Leader không tồn tại.!');
    }
    leaderId = createTeamDto.leaderId;
   }
   try {
    const team = await transactionManager.getRepository(Team).save({
        uuid:uuidv4(),
        name:createTeamDto.name,
        isDeleted:false,
        updatedAt:new Date(),
        createdAt: new Date(),
        leaderId,
    })
    return {statusCode:201, message:"Tạo team thành công", data:team}
   } catch (error) {
       throw new InternalServerErrorException("Lỗi trong quá trình tạo team!");
   }
   
  }

}