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
}
