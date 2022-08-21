import { RecruitmentRepository } from './recruitment.repository';
import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';
import { UploadFileRecruitmentDto } from './dto/upload-file-recruitment.dto';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { throws } from 'assert';
import { Recruitment } from './recruitment.entity';
import { DownloadFileTypeRecruitmentEnum } from './enum/download-file-type-recruitment.enum';
import { DownloadFileRecruitmentDto } from './dto/download-file-recruitment.dto';
import { EmailRecruitmentDto } from 'src/email/dto/email-recruitment.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class RecruitmentService {
    constructor(
      private recruitmentRepository: RecruitmentRepository,
      private emailService: EmailService,
    ) {}
  
//   async getDetailCandidate(transactionManager: EntityManager, uuid: string): Promise<unknown> {

//       const query = transactionManager
//         .getRepository(Recruitment)
//         .createQueryBuilder('candidate')
//         .select([
//           'candidate.uuid',
//           'candidate.firstName',
//           'candidate.lastName',
//           'candidate.position',
//           'candidate.privateEmail',
//           'candidate.phoneNumber',
//           'candidate.address',
//           // 'candidate.note',
//           // 'candidate.experience',
//           // 'candidate.highestEducation',
//           // 'candidate.university',
//           // 'candidate.courseOfStudy',
//           // 'candidate.websiteUrl',
//           // 'candidate.informationChannel',
//           'candidate.resumeFile',
//           // 'candidate.coverLetterFile',
//           'candidate.createdAt',
//           'candidate.updatedAt',
//         ])
//         .andWhere('candidate.uuid = :uuid', { uuid })
//         .andWhere('candidate.isDeleted = FALSE');
    
//       const data = await query.getOne();
    
//       if (isNullOrUndefined(data)) {
//         throw new NotFoundException(`Không tìm thấy ứng viên.`);
//       }
    
//       return { statusCode: 200, data };
    
//   }

  async downloadRecruitmentFile(transactionManager: EntityManager, downloadFileRecruitmentDto: DownloadFileRecruitmentDto, uuid: any, res: any) {
    let recruitment = await transactionManager
    .getRepository(Recruitment)
    .findOne({ uuid, isDeleted: false });
    if(isNullOrUndefined(recruitment)){
      throw new ConflictException('Ứng viên không tồn tại!');
    }
    let filename;
    // if(downloadFileCandidateDto.type === DownloadFileTypeCandidateEnum.CoverLetter){
    //   filename = candidate.coverLetterFile;
    // }
    if(downloadFileRecruitmentDto.type === DownloadFileTypeRecruitmentEnum.Resume){
      filename = recruitment.resumeFile;
    }
    if(isNullOrUndefined(filename)){
      throw new ConflictException('Ứng viên chưa có file này!');
    }

    return res.sendFile(filename, { root: process.env.UPLOAD_FILE_FOLDER });
    // return res;
    
  }

  async deleteRecruitment(transactionManager: EntityManager, uuid: string) {
    let recruitment = await transactionManager
    .getRepository(Recruitment)
    .findOne({ uuid, isDeleted: false });
    if(isNullOrUndefined(recruitment)){
      throw new ConflictException('Ứng viên không tồn tại!');
    }
    recruitment.updatedAt = new Date();
    recruitment.isDeleted = true;

    try {
      await transactionManager.save(recruitment);
      return {
        statusCode: 201,
        message: `Xoá ứng viên thành công.`,
      };
    } catch (error) {
      throw new InternalServerErrorException("Đã xảy ra lỗi trong quá trình cập nhật ứng viên, vui lòng thử lại sau!");
    }
  }

//   async updateCandidate(
//     transactionManager: EntityManager,
//     updateCandidateDto: UpdateCandidateDto,
//     uuid: string,
//   ): Promise<unknown> {
//     let candidate = await transactionManager
//       .getRepository(Candidate)
//       .findOne({ uuid, isDeleted: false });
//       if(isNullOrUndefined(candidate)){
//         throw new ConflictException('Ứng viên không tồn tại!');
//       }
//       const {firstName, lastName, position, privateEmail, phoneNumber, address} = updateCandidateDto;
//     candidate.firstName = firstName;
//     candidate.lastName = lastName;
//     candidate.position = position;
//     candidate.privateEmail = privateEmail;
//     candidate.phoneNumber = phoneNumber;
//     candidate.address = address;
//     // candidate.experience = experience;
//     // candidate.highestEducation = highestEducation;
//     // candidate.university = university;
//     // candidate.courseOfStudy = courseOfStudy;
//     // candidate.websiteUrl = websiteUrl;
//     // candidate.informationChannel = informationChannel;
//     // candidate.note = note;
//     candidate.updatedAt = new Date();
//     try {
//       await transactionManager.save(candidate);
//       return {
//         statusCode: 201,
//         message: `Cập nhật ứng viên thành công.`,
//       };
//     } catch (error) {
//       throw new InternalServerErrorException("Đã xảy ra lỗi trong quá trình cập nhật ứng viên, vui lòng thử lại sau!");
//     }
      
//   }

  async uploadRecruitemntFile(
    transactionManager: EntityManager,
    uploadFileRecruitmentDto: UploadFileRecruitmentDto,
    files: { resume?: Express.Multer.File },
  ) {
    const { uuid } = uploadFileRecruitmentDto;
    const recruitment = await transactionManager
      .getRepository(Recruitment)
      .findOne({ uuid });
    if (isNullOrUndefined(recruitment)) {
      throw new ConflictException('Ứng viên không tồn tại!');
    }

    if (files.resume) {
      recruitment.resumeFile = files.resume[0].filename;
    }

    recruitment.updatedAt = new Date();
    await transactionManager.save(recruitment);

    return {
      statusCode: 201,
      message: `Lưu file thành công.`,
    };
  }

  async createRecruitment(
    transactionManager: EntityManager,
    createRecruitmentDto: CreateRecruitmentDto,
    files: { resume?: Express.Multer.File },
  ): Promise<unknown> {
    await this.recruitmentRepository.saveRecruitment(
      transactionManager,
      createRecruitmentDto,
      files,
    );

    let emailRecruitmentDto = new EmailRecruitmentDto();
    emailRecruitmentDto.email = 'contact@ari.com.vn';
    emailRecruitmentDto.username = createRecruitmentDto.lastName + ' ' + createRecruitmentDto.firstName;
    emailRecruitmentDto.privateEmail = createRecruitmentDto.email;
    emailRecruitmentDto.phoneNumber = createRecruitmentDto.phoneNumber;
    emailRecruitmentDto.position = createRecruitmentDto.position;
    emailRecruitmentDto.address = createRecruitmentDto.address;
    // emailRecruitmentDto.resume = createRecruitmentDto.resumeFile;
    
    // let downloadFileRecruitmentDto = new DownloadFileRecruitmentDto();
    // downloadFileRecruitmentDto.type = DownloadFileTypeRecruitmentEnum.Resume;
    // let res: any;
    // emailRecruitmentDto.activeLink = this.downloadRecruitmentFile(transactionManager, downloadFileRecruitmentDto, createRecruitmentDto.uuid, res)
    // emailRecruitmentDto.activeLink = `recruitment/download/${createRecruitmentDto.uuid}?type=resume`;

    await this.emailService.sendRecruitmentEmail(emailRecruitmentDto, '');

    return {
      statusCode: 201,
      message: 'Ứng tuyển thành công!',
    };
  }

//   async getAll(
//     transactionManager: EntityManager,
//     getAllCandidateDto: GetAllCandidateDto,
//   ): Promise<unknown> {
//     return await this.candidateRepository.getAll(
//       transactionManager,
//       getAllCandidateDto,
//     );
//   }

}