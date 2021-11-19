import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { throws } from 'assert';
import { uuidv4 } from 'src/common/util/common.util';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { EntityManager } from 'typeorm';
import { StaticSectionRepository } from '../static-section/static-section.repository';
import { CreateStaticSiteDto } from './dto/create-static-site.dto';
import { UpdateStaticSiteDto } from './dto/update-static-site.dto';
import { StaticSite } from './static-site.entity';
import { StaticSiteRepository } from './static-site.repository';

@Injectable()
export class StaticSiteService {
  constructor(
    private staticSiteRepository: StaticSiteRepository,
    private sectionRepo: StaticSectionRepository,
  ) {}

  /**
   *
   * @param transactionManager
   * @param createStaticSite
   * @returns
   */
  async createStaticSite(
    transactionManager: EntityManager,
    createStaticSite: CreateStaticSiteDto,
  ) {
    createStaticSite.uuid = uuidv4();
    try {
      await this.staticSiteRepository.createStaticSite(
        transactionManager,
        createStaticSite,
      );
      return { statusCode: 201, description: 'Tạo Static Site thành công' };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình tạo Static Site.`,
      );
    }
  }

  /**
   *
   * @param transactionManager
   * @param uuid
   * @returns
   */
  async getStaticSite(transactionManager: EntityManager, uuid) {
    return await transactionManager.getRepository(StaticSite).findOne({ uuid });
  }

  /**
   *
   * @param transactionManager
   * @param uuid
   * @returns
   */
  async getAll(transactionManager: EntityManager) {
    return await transactionManager.getRepository(StaticSite).find();
  }
}
