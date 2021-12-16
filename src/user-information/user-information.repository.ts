import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { Team } from 'src/team/team.entity';
import { Repository, EntityRepository, EntityManager } from 'typeorm';
import { CreateUserInformationDto } from './dto/create-user-information.dto';
import { GetAllUserInformationDto } from './dto/get-all-user-information.dto';
import { UserInformationDto } from './dto/user-information.dto';
import { UserInformation } from './user-information.entity';

@EntityRepository(UserInformation)
export class UserInformationRepository extends Repository<UserInformation> {
  /**
   *
   * @param transactionManager
   * @param getAllUserInformationDto
   * @returns
   */
  async getAllUserInformation(
    transactionManager: EntityManager,
    getAllUserInformationDto: GetAllUserInformationDto,
  ) {
    const { page, filter, sorts, fullTextSearch } = getAllUserInformationDto;
    let { perPage } = getAllUserInformationDto;
    if (isNullOrUndefined(perPage)) {
      perPage = 25;
    }

    const table = 'userInformation';
    const query = transactionManager
      .getRepository(UserInformation)
      .createQueryBuilder(table)
      .select([
        `${table}.uuid`,
        `${table}.firstName`,
        `${table}.lastName`,
        `${table}.profilePhotoKey`,
        `${table}.phoneNumber`,
        `${table}.dob`,
        `${table}.shortDescription`,
        `${table}.position`,
        `${table}.staffId`,
        `${table}.createdAt`,
        `${table}.updatedAt`,
      ])
      .take(perPage)
      .skip((page - 1) * perPage || 0)
      .orderBy(`${table}.createdAt`, 'ASC');

    // Full text search
    if (!isNullOrUndefined(fullTextSearch) && fullTextSearch !== '') {
      for (let key in new UserInformationDto()) {
        let column = `${table}.${key}`;
        let searchingObject = {};
        searchingObject[key] = `%${fullTextSearch}%`;
        query.orWhere(
          `LOWER('${column}') LIKE LOWER(:${key})`,
          searchingObject,
        );
      }
    }

    try {
      return await query.getMany();
    } catch (error) {
      console.log(error);
    }
  }

  async getUserInformationDetail(
    transactionManager: EntityManager,
    uuid: string,
  ) {
    try {
      const checkUserInformationExist = await transactionManager
      .getRepository(UserInformation)
      .findOne({
        where: { uuid },
        select: ['uuid', 'staffId','team','firstName', 'lastName', 'phoneNumber', 'profilePhotoKey', 'shortDescription', 'dob', 'createdAt'],
      });
      console.log(checkUserInformationExist);
      
    if (isNullOrUndefined(checkUserInformationExist)) {
      throw new NotFoundException(
        `Hiện không tìm thấy User Information này. Vui lòng thử lại sau!`,
      );
    }

    return {
      statusCode: 201,
      data: { userInformationDetail: checkUserInformationExist },
    };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Vui lòng thử lại sau!`,
      );
    }    
    
  }

  async saveUserInformation(
    transactionManager: EntityManager,
    createUserInformationDto: CreateUserInformationDto,
    isCreate = false,
  ) {
    const {
      uuid,
      firstName,
      lastName,
      profilePhotoKey,
      phoneNumber,
      shortDescription,
      position,
      dob,
      teamUuid,
    } = createUserInformationDto;

    const checkUserInformationExist = await transactionManager
      .getRepository(UserInformation)
      .findOne({
        uuid,
      });

      const checkTeam = await transactionManager
      .getRepository(Team)
      .findOne({
        uuid:teamUuid,
      });

    if (isNullOrUndefined(checkUserInformationExist) && isCreate === false) {
      throw new ConflictException(
        `User Information chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    if (isNullOrUndefined(checkTeam) && isCreate === false) {
      throw new ConflictException(
        `Team chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }


    const userInformation = transactionManager.create(UserInformation, {
      id: checkUserInformationExist?.id,
      uuid,
      firstName,
      lastName,
      profilePhotoKey,
      phoneNumber,
      shortDescription,
      position,
      dob,
      team:checkTeam
    });

    try {
      await transactionManager.save(userInformation);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình ${
          isCreate ? 'tạo' : 'update'
        } User Information, vui lòng thử lại sau.`,
      );
    }
    return {
      statusCode: 201,
      message: `${
        isCreate ? 'Create' : 'Update'
      } User Information successfully.`,
    };
  }
}
