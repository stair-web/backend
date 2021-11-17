import { CreateCandidateDto } from './dto/create-candidate.dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { isNullOrUndefined, paramStringToJson } from 'src/lib/utils/util';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { Candidate } from './candidate.entity';
import { uuidv4 } from 'src/common/util/common.util';
import { GetAllCandidateDto } from './dto/get-all-candidate.dto';

@EntityRepository(Candidate)
export class CandidateRepository extends Repository<Candidate> {
  getAll(
    transactionManager: EntityManager,
    getAllCandidateDto: GetAllCandidateDto,
  ) {
    try {
      const { page, filter, sorts } = getAllCandidateDto;
      let { perPage } = getAllCandidateDto;
      if (isNullOrUndefined(perPage)) {
        perPage = 25;
      }
      const query = transactionManager
        .getRepository(Candidate)
        .createQueryBuilder('candidate')
        .select([
          'candidate.id',
          'candidate.uuid',
          'candidate.fullName',
          'candidate.privateEmail',
          'candidate.phoneNumber',
          'candidate.experience',
          'candidate.highestEducation',
          'candidate.university',
          'candidate.courseOfStudy',
          'candidate.websiteUrl',
          'candidate.informationChannel',
          'candidate.note',
          'candidate.resumeFile',
          'candidate.coverLetterFile',
          'candidate.createdAt',
          'candidate.updatedAt',
        ])
        .where('candidate.isDeleted = FALSE')
        .take(perPage)
        .skip((page - 1) * perPage)
        .orderBy('candidate.createdAt', 'DESC');

      // Filter list
      if (!isNullOrUndefined(filter)) {
        const object = paramStringToJson(filter);
        if (!isNullOrUndefined(object.fullName)) {
          query.andWhere('LOWER(candidate.fullName) LIKE LOWER(:fullName)', {
            fullName: `%${object.fullName}%`,
          });
        }

        if (!isNullOrUndefined(object.privateEmail)) {
          query.andWhere(
            'LOWER(candidate.privateEmail) LIKE LOWER(:privateEmail)',
            {
              privateEmail: `%${object.privateEmail}%`,
            },
          );
        }

        if (!isNullOrUndefined(object.phoneNumber)) {
          query.andWhere(
            'LOWER(candidate.phoneNumber) LIKE LOWER(:phoneNumber)',
            {
              phoneNumber: `%${object.phoneNumber}%`,
            },
          );
        }

        if (!isNullOrUndefined(object.university)) {
          query.andWhere(
            'LOWER(candidate.university) LIKE LOWER(:university)',
            {
              university: `%${object.university}%`,
            },
          );
        }

        if (!isNullOrUndefined(object.courseOfStudy)) {
          query.andWhere(
            'LOWER(candidate.courseOfStudy) LIKE LOWER(:courseOfStudy)',
            {
              courseOfStudy: `%${object.courseOfStudy}%`,
            },
          );
        }

        if (!isNullOrUndefined(object.note)) {
          query.andWhere('LOWER(candidate.note) LIKE LOWER(:note)', {
            note: `%${object.note}%`,
          });
        }
      }

      // Sort list
    if (!isNullOrUndefined(sorts)) {
      const object = paramStringToJson(sorts);

      if (!isNullOrUndefined(object.fullName)) {
        query.orderBy('user.fullName', object.fullName);
      }
      
      if (!isNullOrUndefined(object.privateEmail)) {
        query.orderBy('user.privateEmail', object.privateEmail);
      }
      
      if (!isNullOrUndefined(object.phoneNumber)) {
        query.orderBy('user.phoneNumber', object.phoneNumber);
      }

      if (!isNullOrUndefined(object.university)) {
        query.orderBy('user.university', object.university);
      }

      if (!isNullOrUndefined(object.courseOfStudy)) {
        query.orderBy('user.courseOfStudy', object.courseOfStudy);
      }

      if (!isNullOrUndefined(object.note)) {
        query.orderBy('user.note', object.note);
      }
    }
    } catch (error) {
      console.log(error);
    }
  }
  async saveCandidate(
    transactionManager: EntityManager,
    createCandidateDto: CreateCandidateDto,
  ) {
    const {
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
    } = createCandidateDto;

    const candidate = transactionManager.create(Candidate, {
      uuid: uuidv4(),
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
      data: candidate,
    };
  }
}
