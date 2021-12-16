import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/utils/common.util';
import { EntityManager } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './team.entity';

@Injectable()
export class TeamService {
  async deleteTeam(
    transactionManager: EntityManager,
    uuid: string,
  ): Promise<unknown> {
    /* check team if exists */
    const teamCheck = await transactionManager.getRepository(Team).findOne({
      where: [{ uuid, isDeleted: false }],
    });
    if (!teamCheck) {
      throw new ConflictException(`Team này không tồn tại trong hệ thống.`);
    }
    teamCheck.isDeleted = true;
    teamCheck.updatedAt = new Date();
    try {
      await transactionManager.save(teamCheck);
      return { statusCode: 201, message: 'Cập nhật team thành công.' };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình lưu team, vui lòng thử lại sau.',
      );
    }
  }
  async updateTeam(
    transactionManager: EntityManager,
    updateTeamDto: UpdateTeamDto,
  ): Promise<unknown> {
    /* check team if exists */
    const { name, uuid } = updateTeamDto;
    const teamCheck = await transactionManager.getRepository(Team).findOne({
      where: [{ uuid, isDeleted: false }],
    });
    if (!teamCheck) {
      throw new ConflictException(`Team này không tồn tại trong hệ thống.`);
    }
    teamCheck.name = name;
    teamCheck.updatedAt = new Date();

    try {
      await transactionManager.save(teamCheck);
      return { statusCode: 201, message: 'Cập nhật team thành công.' };
    } catch (error) {
      Logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình lưu team, vui lòng thử lại sau.',
      );
    }
  }
  async createTeam(
    transactionManager: EntityManager,
    createTeamDto: CreateTeamDto,
  ) {
    /* check team if exists */
    const { name } = createTeamDto;
    const teamCheck = await transactionManager.getRepository(Team).findOne({
      where: [{ name, isDeleted: false }],
    });
    if (teamCheck) {
      throw new ConflictException(`Name này đã tồn tại trong hệ thống.`);
    }
    const team = transactionManager.create(Team, {
      uuid: uuidv4(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    try {
      await transactionManager.save(team);
      return { statusCode: 201, message: 'Tạo team thành công.' };
    } catch (error) {
      Logger.error(error);
      console.log(error);

      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tạo team, vui lòng thử lại sau.',
      );
    }
  }
  async getAllTeam(transactionManager: EntityManager) {
    const team = await transactionManager.getRepository(Team).find({
      where: { isDeleted: false },
      relations: ['leader'],
    });

    return { data: team };
  }
}
