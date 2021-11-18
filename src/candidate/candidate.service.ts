import { CandidateRepository } from './candidate.repository';
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { UploadedFileCandidateDto } from './dto/upload-file-candidate.dto';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { throws } from 'assert';
import { Candidate } from './candidate.entity';
import { GetAllCandidateDto } from './dto/get-all-candidate.dto';

@Injectable()
export class CandidateService {
  async deleteCandidate(transactionManager: EntityManager, uuid: string): Promise<unknown> {
    let candidate = await transactionManager
    .getRepository(Candidate)
    .findOne({ uuid, isDeleted: false });
    if(isNullOrUndefined(candidate)){
      throw new ConflictException('Ứng viên không tồn tại!');
    }
    candidate.updatedAt = new Date();
    candidate.isDeleted = true;

    try {
      await transactionManager.save(candidate);
      return {
        statusCode: 201,
        message: `Cập nhật ứng viên thành công.`,
      };
    } catch (error) {
      throw new InternalServerErrorException("Đã xảy ra lỗi trong quá trình cập nhật ứng viên, vui lòng thử lại sau!");
    }
    throw new Error('Method not implemented.');
  }
  constructor(private candidateRepository: CandidateRepository) {}
  async updateCandidate(
    transactionManager: EntityManager,
    updateCandidateDto: UpdateCandidateDto,
    uuid: string,
  ): Promise<unknown> {
    let candidate = await transactionManager
      .getRepository(Candidate)
      .findOne({ uuid, isDeleted: false });
      if(isNullOrUndefined(candidate)){
        throw new ConflictException('Ứng viên không tồn tại!');
      }
      const {fullName, privateEmail, phoneNumber, experience, highestEducation, university, courseOfStudy, websiteUrl, informationChannel, note} = candidate;
    candidate.fullName = fullName;
    candidate.privateEmail = privateEmail;
    candidate.phoneNumber = phoneNumber;
    candidate.experience = experience;
    candidate.highestEducation = highestEducation;
    candidate.university = university;
    candidate.courseOfStudy = courseOfStudy;
    candidate.websiteUrl = websiteUrl;
    candidate.informationChannel = informationChannel;
    candidate.note = note;
    candidate.updatedAt = new Date();
    try {
      await transactionManager.save(candidate);
      return {
        statusCode: 201,
        message: `Cập nhật ứng viên thành công.`,
      };
    } catch (error) {
      throw new InternalServerErrorException("Đã xảy ra lỗi trong quá trình cập nhật ứng viên, vui lòng thử lại sau!");
    }
      
  }
  async uploadCandidateFile(
    transactionManager: EntityManager,
    uploadedFileCandidateDto: UploadedFileCandidateDto,
    files: { coverletter?: Express.Multer.File; resume?: Express.Multer.File },
  ) {
    const { uuid } = uploadedFileCandidateDto;
    const candidate = await transactionManager
      .getRepository(Candidate)
      .findOne({ uuid });
    if (isNullOrUndefined(candidate)) {
      throw new ConflictException('Candidate không tồn tại!');
    }

    if (files.coverletter) {
      candidate.coverLetterFile = files.coverletter[0].filename;
    }
    if (files.resume) {
      candidate.resumeFile = files.resume[0].filename;
    }

    candidate.updatedAt = new Date();
    await transactionManager.save(candidate);

    return {
      statusCode: 201,
      message: `Lưu file thành công.`,
    };
  }
  async createCandidate(
    transactionManager: EntityManager,
    createCandidateDto: CreateCandidateDto,
  ): Promise<unknown> {
    return await this.candidateRepository.saveCandidate(
      transactionManager,
      createCandidateDto,
    );
  }
  async getAll(
    transactionManager: EntityManager,
    getAllCandidateDto: GetAllCandidateDto,
  ): Promise<unknown> {
    return await this.candidateRepository.getAll(
      transactionManager,
      getAllCandidateDto,
    );
  }
}
