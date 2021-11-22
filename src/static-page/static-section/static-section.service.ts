import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/utils/common.util';
import { StaticItem } from 'src/static-page/static-item/static-item.entity';
import { EntityManager } from 'typeorm';
import { CreateStaticSectionDto } from './dto/create-static-section.dto';
import { UpdateStaticSectionDto } from './dto/update-static-section.dto';
import { StaticSection } from './static-section.entity';
import { StaticSectionRepository } from './static-section.repository';

@Injectable()
export class StaticSectionService {
  constructor(private staticSectionRepository: StaticSectionRepository) {}

  /**
   *
   * @param transactionManager
   * @param createStaticSection
   * @returns
   */
  async createStaticSection(
    transactionManager: EntityManager,
    createStaticSection: CreateStaticSectionDto,
  ) {
    createStaticSection.uuid = uuidv4();
    try {
      await this.staticSectionRepository.saveStaticSection(
        transactionManager,
        createStaticSection,
        true
      );
      return { statusCode: 201, description: 'Tạo Static Section thành công' };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình tạo Static Section.`,
      );
    }
  }

  /**
   *
   * @param transactionManager
   * @param createStaticSection
   * @returns
   */
   async updateStaticSection(
    transactionManager: EntityManager,
    createStaticSection: CreateStaticSectionDto,
    uuid
  ) {
    createStaticSection.uuid = uuid;
    try {
      await this.staticSectionRepository.saveStaticSection(
        transactionManager,
        createStaticSection,
      );
      return { statusCode: 201, description: 'Update Static Section thành công' };
    } catch (error) {
      Logger.error(error);
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          `Lỗi hệ thống trong quá trình update Static Section.`,
        );
      }
    }
  }

  /**
   *
   * @param transactionManager
   * @param uuid
   * @returns
   */
   async getStaticSection(transactionManager: EntityManager, uuid) {
    return await transactionManager.getRepository(StaticSection).findOne({ uuid });
  }

  /**
   *
   * @param transactionManager
   * @param uuid
   * @returns
   */
  async getAll(transactionManager: EntityManager) {
    return await transactionManager.getRepository(StaticSection).find();
  }
}
