import { CreateRecruitmentDto } from './dto/create-recruitment.dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { isNullOrUndefined, paramStringToJson } from 'src/lib/utils/util';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { uuidv4 } from 'src/common/utils/common.util';
import { Recruitment } from './recruitment.entity';
import { GetAllRecruitmentDto } from './dto/get-all-recruitment.dto';

@EntityRepository(Recruitment)
export class RecruitmentRepository extends Repository<Recruitment> {
  async saveRecruitment(
    transactionManager: EntityManager,
    createRecruitmentDto: CreateRecruitmentDto,
    files: { resume?: Express.Multer.File },
  ) {
    const {
      uuid,
      firstName,
      lastName,
      position,
      email,
      phoneNumber,
      address,
      resumeFile = files.resume[0].filename,
    } = createRecruitmentDto;

    
    // if (files.resume) {
    //     resumeFile = files.resume[0].filename;
    // }

    const recruitment = transactionManager.create(Recruitment, {
      uuid,
      firstName,
      lastName,
      email,
      phoneNumber,
      position,
      address,
      resumeFile,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    try {
      await transactionManager.save(recruitment);
      return {
        statusCode: 201,
        message: `Tạo Recruitment thành công.`,
      };
    } catch (error) {
      Logger.error(error);
      console.log(error);
      
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tạo, vui lòng thử lại sau.',
      );
    }
    
  }

  async getAll(
    transactionManager: EntityManager,
    getAllRecruitmentDto: GetAllRecruitmentDto,
  ) {
    try {
      let { perPage } = getAllRecruitmentDto;
      if (isNullOrUndefined(perPage)) {
        perPage = 10;
      }
      let { page } = getAllRecruitmentDto;
      if (isNullOrUndefined(page)) {
        page = 1;
      }
      const query = transactionManager
        .getRepository(Recruitment)
        .createQueryBuilder('recruitment')
        .select([
          'recruitment.uuid',
          'recruitment.firstName',
          'recruitment.lastName',
          'recruitment.position',
          'recruitment.email',
          'recruitment.phoneNumber',
          'recruitment.address',
          'recruitment.resumeFile',
          'recruitment.createdAt',
          'recruitment.updatedAt',
        ])
        .where('recruitment.isDeleted is FALSE')
        .take(perPage)
        .skip((page - 1) * perPage)
        .orderBy('recruitment.createdAt', 'DESC');

      // Filter list
        if (!isNullOrUndefined(getAllRecruitmentDto.filterFirstName)) {
          query.andWhere('LOWER(recruitment.firstName) LIKE LOWER(:firstName)', {
            firstName: `%${getAllRecruitmentDto.filterFirstName}%`,
          });
        }

        if (!isNullOrUndefined(getAllRecruitmentDto.filterLastName)) {
          query.andWhere('LOWER(recruitment.lastName) LIKE LOWER(:lastName)', {
            lastName: `%${getAllRecruitmentDto.filterLastName}%`,
          });
        }

        if (!isNullOrUndefined(getAllRecruitmentDto.filterPosition)) {
          query.andWhere(
            'LOWER(recruitment.position) LIKE LOWER(:position)',
            {
              position: `%${getAllRecruitmentDto.filterPosition}%`,
            },
          );
        }

        if (!isNullOrUndefined(getAllRecruitmentDto.filterEmail)) {
          query.andWhere(
            'LOWER(recruitment.email) LIKE LOWER(:email)',
            {
              email: `%${getAllRecruitmentDto.filterEmail}%`,
            },
          );
        }

        if (!isNullOrUndefined(getAllRecruitmentDto.filterPhoneNumber)) {
          query.andWhere(
            'LOWER(recruitment.phoneNumber) LIKE LOWER(:phoneNumber)',
            {
              phoneNumber: `%${getAllRecruitmentDto.filterPhoneNumber}%`,
            },
          );
        }

        if (!isNullOrUndefined(getAllRecruitmentDto.filterAddress)) {
          query.andWhere(
            'LOWER(recruitment.address) LIKE LOWER(:address)',
            {
              address: `%${getAllRecruitmentDto.filterAddress}%`,
            },
          );
        }
      

      // Sort list
      if (!isNullOrUndefined(getAllRecruitmentDto.sortFirstName)) {
        query.orderBy('recruitment.firstName', getAllRecruitmentDto.sortFirstName);
      }
      
      if (!isNullOrUndefined(getAllRecruitmentDto.sortLastName)) {
        query.orderBy('recruitment.lastName', getAllRecruitmentDto.sortLastName);
      }

      if (!isNullOrUndefined(getAllRecruitmentDto.sortPosition)) {
        query.orderBy('recruitment.position', getAllRecruitmentDto.sortPosition);
      }

      if (!isNullOrUndefined(getAllRecruitmentDto.sortEmail)) {
        query.orderBy('recruitment.email', getAllRecruitmentDto.sortEmail);
      }
      
      if (!isNullOrUndefined(getAllRecruitmentDto.sortPhoneNumber)) {
        query.orderBy('recruitment.phoneNumber', getAllRecruitmentDto.sortPhoneNumber);
      }

      if (!isNullOrUndefined(getAllRecruitmentDto.sortAddress)) {
        query.orderBy('recruitment.address', getAllRecruitmentDto.sortAddress);
      }

      const data = await query.getMany();
      const total = await query.getCount();
      return { statusCode: 201, data: { data, total } };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình lấy danh sách, vui lòng thử lại sau.',
      );
    }
  }

}
