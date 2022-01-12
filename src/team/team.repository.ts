import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/utils/common.util';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { UserInformation } from 'src/user-information/user-information.entity';
import { User } from 'src/user/user.entity';
import { Repository, EntityRepository, EntityManager, Not } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
  async removeTeam(transactionManager: EntityManager, uuid: string) {
    const team = await transactionManager
      .getRepository(Team)
      .findOne({ uuid: uuid });
    if (isNullOrUndefined(team)) {
      throw new ConflictException('Team này không tồn tại.!');
    }
    const  listUserInfo = await transactionManager.getRepository(UserInformation).find({teamId:team.id})
    listUserInfo.forEach(ele=>{
        ele.teamId = null;
    })
    await  transactionManager.getRepository(UserInformation).save(listUserInfo);
    return {message:"Xoá team thành công!"}
  }
  async updateTeam(
    transactionManager: EntityManager,
    createTeamDto: CreateTeamDto,
  ) {
    const team = await transactionManager
      .getRepository(Team)
      .findOne({ uuid: createTeamDto.uuid });
    if (isNullOrUndefined(team)) {
      throw new ConflictException('Team này không tồn tại.!');
    }
    const findDup = await transactionManager
      .getRepository(Team)
      .findOne({ name: createTeamDto.name, uuid:Not(createTeamDto.uuid) });
    if (!isNullOrUndefined(findDup)) {
      throw new ConflictException('Team này đã tồn tại.!');
    }
    if (createTeamDto.leaderId) {
      const findLeader = await transactionManager
        .getRepository(User)
        .findOne({   where:{id: createTeamDto.leaderId}, relations: ['userInformation'] });
      if (isNullOrUndefined(findLeader)) {
        throw new ConflictException('Leader này không tồn tại.!');
      }
      if(findLeader.userInformation.teamId != team.id){
        throw new ConflictException('Leader này không thuộc về team này.!');
      }
      
      team.leaderId = createTeamDto.leaderId;
    }
    team.name = createTeamDto.name;
    team.updatedAt = new Date();
    await team.save();
    return { data: team, message: 'Cập nhật team thành công!' };
  }
  async createTeam(
    transactionManager: EntityManager,
    createTeamDto: CreateTeamDto,
  ) {
    const findDup = await transactionManager
      .getRepository(Team)
      .findOne({ name: createTeamDto.name });
    if (!isNullOrUndefined(findDup)) {
      throw new ConflictException('Team này đã tồn tại.!');
    }
    let leaderId;
    if (createTeamDto.leaderId) {
      const findLeader = await transactionManager
        .getRepository(User)
        .findOne({ id: createTeamDto.leaderId });
      if (!isNullOrUndefined(findLeader)) {
        throw new ConflictException('Leader không tồn tại.!');
      }
      leaderId = createTeamDto.leaderId;
    }
    try {
      const team = await transactionManager.getRepository(Team).save({
        uuid: uuidv4(),
        name: createTeamDto.name,
        isDeleted: false,
        updatedAt: new Date(),
        createdAt: new Date(),
        leaderId,
      });
      return { statusCode: 201, message: 'Tạo team thành công', data: team };
    } catch (error) {
      throw new InternalServerErrorException('Lỗi trong quá trình tạo team!');
    }
  }
}
