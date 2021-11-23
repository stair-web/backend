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
import { uuidv4 } from 'src/common/utils/common.util';
import { GetAllCandidateDto } from './dto/get-all-candidate.dto';

@EntityRepository(Candidate)
export class CandidateRepository extends Repository<Candidate> {
  async getAll(
    transactionManager: EntityManager,
    getAllCandidateDto: GetAllCandidateDto,
  ) {
    try {
      let { perPage } = getAllCandidateDto;
      if (isNullOrUndefined(perPage)) {
        perPage = 10;
      }
      let { page } = getAllCandidateDto;
      if (isNullOrUndefined(page)) {
        page = 1;
      }
      const query = transactionManager
        .getRepository(Candidate)
        .createQueryBuilder('candidate')
        .select([
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
        .where('candidate.isDeleted is FALSE')
        .take(perPage)
        .skip((page - 1) * perPage)
        .orderBy('candidate.createdAt', 'DESC');

      // Filter list
        if (!isNullOrUndefined(getAllCandidateDto.filterFullName)) {
          query.andWhere('LOWER(candidate.fullName) LIKE LOWER(:fullName)', {
            fullName: `%${getAllCandidateDto.filterFullName}%`,
          });
        }

        if (!isNullOrUndefined(getAllCandidateDto.filterPrivateEmail)) {
          query.andWhere(
            'LOWER(candidate.privateEmail) LIKE LOWER(:privateEmail)',
            {
              privateEmail: `%${getAllCandidateDto.filterPrivateEmail}%`,
            },
          );
        }

        if (!isNullOrUndefined(getAllCandidateDto.filterPhoneNumber)) {
          query.andWhere(
            'LOWER(candidate.phoneNumber) LIKE LOWER(:phoneNumber)',
            {
              phoneNumber: `%${getAllCandidateDto.filterPhoneNumber}%`,
            },
          );
        }

        if (!isNullOrUndefined(getAllCandidateDto.filterExperience)) {
          query.andWhere(
            'LOWER(candidate.experience) LIKE LOWER(:experience)',
            {
              experience: `%${getAllCandidateDto.filterExperience}%`,
            },
          );
        }

        if (!isNullOrUndefined(getAllCandidateDto.filterUniversity)) {
          query.andWhere(
            'LOWER(candidate.university) LIKE LOWER(:university)',
            {
              university: `%${getAllCandidateDto.filterUniversity}%`,
            },
          );
        }

        if (!isNullOrUndefined(getAllCandidateDto.filterHighestEducation)) {
          query.andWhere(
            'LOWER(candidate.university) LIKE LOWER(:highestEducation)',
            {
              highestEducation: `%${getAllCandidateDto.filterHighestEducation}%`,
            },
          );
        }

        if (!isNullOrUndefined(getAllCandidateDto.filterInformationChannel)) {
          query.andWhere(
            'LOWER(candidate.university) LIKE LOWER(:informationChannel)',
            {
              informationChannel: `%${getAllCandidateDto.filterInformationChannel}%`,
            },
          );
        }

        if (!isNullOrUndefined(getAllCandidateDto.filterCourseOfStudy)) {
          query.andWhere(
            'LOWER(candidate.courseOfStudy) LIKE LOWER(:courseOfStudy)',
            {
              courseOfStudy: `%${getAllCandidateDto.filterCourseOfStudy}%`,
            },
          );
        }

        if (!isNullOrUndefined(getAllCandidateDto.filterWebsiteUrl)) {
          query.andWhere('LOWER(candidate.note) LIKE LOWER(:websiteUrl)', {
            websiteUrl: `%${getAllCandidateDto.filterWebsiteUrl}%`,
          });
        }

        if (!isNullOrUndefined(getAllCandidateDto.filterNote)) {
          query.andWhere('LOWER(candidate.note) LIKE LOWER(:note)', {
            note: `%${getAllCandidateDto.filterNote}%`,
          });
        }
      

      // Sort list
      if (!isNullOrUndefined(getAllCandidateDto.sortFullName)) {
        query.orderBy('candidate.fullName', getAllCandidateDto.sortFullName);
      }
      
      if (!isNullOrUndefined(getAllCandidateDto.sortPrivateEmail)) {
        query.orderBy('candidate.privateEmail', getAllCandidateDto.sortPrivateEmail);
      }
      
      if (!isNullOrUndefined(getAllCandidateDto.sortPhoneNumber)) {
        query.orderBy('candidate.phoneNumber', getAllCandidateDto.sortPhoneNumber);
      }

      if (!isNullOrUndefined(getAllCandidateDto.sortExperience)) {
        query.orderBy('candidate.experience', getAllCandidateDto.sortExperience);
      }

      if (!isNullOrUndefined(getAllCandidateDto.sortExperience)) {
        query.orderBy('candidate.experience', getAllCandidateDto.sortExperience);
      }

      if (!isNullOrUndefined(getAllCandidateDto.sortHighestEducation)) {
        query.orderBy('candidate.highestEducation', getAllCandidateDto.sortHighestEducation);
      }

      if (!isNullOrUndefined(getAllCandidateDto.sortCourseOfStudy)) {
        query.orderBy('candidate.courseOfStudy', getAllCandidateDto.sortCourseOfStudy);
      }

      if (!isNullOrUndefined(getAllCandidateDto.sortWebsiteUrl)) {
        query.orderBy('candidate.websiteUrl', getAllCandidateDto.sortWebsiteUrl);
      }

      if (!isNullOrUndefined(getAllCandidateDto.sortInformationChannel)) {
        query.orderBy('candidate.informationChannel', getAllCandidateDto.sortInformationChannel);
      }

      if (!isNullOrUndefined(getAllCandidateDto.sortNote)) {
        query.orderBy('candidate.note', getAllCandidateDto.sortNote);
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
      return {
        statusCode: 201,
        message: `Tạo Candidate thành công.`,
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
