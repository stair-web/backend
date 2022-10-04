import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { uuidv4 } from 'src/common/utils/common.util';
import { EntityManager } from 'typeorm';
import { CreateUserInformationDto } from './dto/create-user-information.dto';
import { GetAllUserInformationDto } from './dto/get-all-user-information.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { UserInformationDto } from './dto/user-information.dto';
import { UserInformationRepository } from './user-information.repository';

@Injectable()
export class UserInformationService {
  constructor(private userInformationRepository: UserInformationRepository) {}

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
    return this.userInformationRepository.getAllUserInformationCompanyWeb(
      transactionManager,
      getAllUserInformationDto,
    );
  }

  async getUserInformationDetail(
    transactionManager: EntityManager,
    uuid: string,
  ) {
    return this.userInformationRepository.getUserInformationDetail(
      transactionManager,
      uuid
    );
  }

  async updateUserInformation(
    transactionManager: EntityManager,
    createUserInformationDto: CreateUserInformationDto,
  ) {
    return this.userInformationRepository.saveUserInformation(
      transactionManager,
      createUserInformationDto,
    );
  }

  async updateUserInformationImage(
    transactionManager: EntityManager,
    updateImageDto: UpdateImageDto,
    uuid: string,
  ) {
    return this.userInformationRepository.saveUserInformationImage(
      transactionManager,
      updateImageDto,
      uuid,
    );
  }
}
