import { CreateCandidateDto } from './dto/create-candidate.dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { Candidate } from './candidate.entity';
import { uuidv4 } from 'src/common/util/common.util';

@EntityRepository(Candidate)
export class CandidateRepository extends Repository<Candidate> {
  async saveCandidate(
    transactionManager: EntityManager,
    createCandidateDto: CreateCandidateDto,
  ) {
    const { fullName, privateEmail, phoneNumber, experience, highestEducation, university, courseOfStudy,
    websiteUrl, informationChannel, note,  } = createCandidateDto;


    const candidate = transactionManager.create(Candidate, {
     uuid:uuidv4(),
     fullName,
     privateEmail,
     phoneNumber,
     experience,
     highestEducation,
     university,
     courseOfStudy,
     websiteUrl,
     informationChannel,
     note,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    try {
      await transactionManager.save(candidate);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tạo, vui lòng thử lại sau.',
      );
    }
    return {
      statusCode: 201,
      message: `Tạo Candidate thành công.`,
      data:candidate,
    };
  }
}
