import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { isUuid, uuidv4 } from 'src/common/utils/common.util';
import { EntityManager } from 'typeorm';
import { StaticItem } from '../static-item/static-item.entity';
import { StaticSection } from '../static-section/static-section.entity';
import { StaticSite } from '../static-site/static-site.entity';
import { StaticRelation } from './static-relation.entity';
import { StaticRelationRepository } from './static-relation.repository';

@Injectable()
export class StaticRelationService {
  constructor(private staticRelationRepository: StaticRelationRepository) {}

  /**
   *
   * @param transactionManager
   * @param uuid
   * @returns
   */
  async getAll(transactionManager: EntityManager) {
    return await transactionManager.getRepository(StaticRelation).find({
      join: {
        alias: 'staticTablesRelation',
        leftJoinAndSelect: {
          site: 'staticTablesRelation.site',
          section: 'staticTablesRelation.section',
          item: 'staticTablesRelation.item',
        },
      },
      relations: ['site', 'section', 'item'],
    });
  }

  async addSiteSection(
    transactionManager: EntityManager,
    siteUuid: string,
    sectionUuid: string,
  ) {
    let site, section;
    if (isUuid(siteUuid)) {
      site = await transactionManager
        .getRepository(StaticSite)
        .findOne({ uuid: siteUuid });
    } else {
      throw new InternalServerErrorException(
        'Site Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    if (isUuid(sectionUuid)) {
      section = await transactionManager
        .getRepository(StaticSection)
        .findOne({ uuid: sectionUuid });
    } else {
      throw new InternalServerErrorException(
        'Section Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    if (!site || !section) {
      throw new InternalServerErrorException(
        `${
          !site ? 'Site' : 'Section'
        } này không tồn tại nên không thể thiết lập mối quan hệ. Vui lòng kiểm tra và thử lại sau!`,
      );
    }

    try {
      await this.staticRelationRepository.addSiteSection(
        transactionManager,
        site,
        section,
      );
      return { statusCode: 201, description: 'Tạo Static Relation thành công' };
    } catch (error) {
      Logger.error(error);
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Lỗi hệ thống trong quá trình tạo Static Relation.',
        );
      }
    }
  }

  async addSiteItem(
    transactionManager: EntityManager,
    siteUuid: string,
    itemUuid: string,
  ) {
    let site, item;
    if (isUuid(siteUuid)) {
      site = await transactionManager
        .getRepository(StaticSite)
        .findOne({ uuid: siteUuid });
    } else {
      throw new InternalServerErrorException(
        'Site Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    if (isUuid(itemUuid)) {
      item = await transactionManager
        .getRepository(StaticItem)
        .findOne({ uuid: itemUuid });
    } else {
      throw new InternalServerErrorException(
        'Item Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    if (!site || !item) {
      throw new InternalServerErrorException(
        `${
          !site ? 'Site' : 'Item'
        } này không tồn tại nên không thể thiết lập mối quan hệ. Vui lòng kiểm tra và thử lại sau!`,
      );
    }

    try {
      await this.staticRelationRepository.addSiteItem(
        transactionManager,
        site,
        item,
      );
      return { statusCode: 201, description: 'Tạo Static Relation thành công' };
    } catch (error) {
      Logger.error(error);
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Lỗi hệ thống trong quá trình tạo Static Relation.',
        );
      }
    }
  }

  /**
   *
   * @param transactionManager
   * @param sectionUuid
   * @param itemUuid
   * @returns
   */
  async addSectionItem(
    transactionManager: EntityManager,
    sectionUuid: string,
    itemUuid: string,
  ) {
    let section, item;
    if (isUuid(sectionUuid)) {
      section = await transactionManager
        .getRepository(StaticSection)
        .findOne({ uuid: sectionUuid });
    } else {
      throw new InternalServerErrorException(
        'Section Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    if (isUuid(itemUuid)) {
      item = await transactionManager
        .getRepository(StaticItem)
        .findOne({ uuid: itemUuid });
    } else {
      throw new InternalServerErrorException(
        'Item Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    if (!item || !section) {
      throw new InternalServerErrorException(
        `${
          !item ? 'Item' : 'Section'
        } này không tồn tại nên không thể thiết lập mối quan hệ. Vui lòng kiểm tra và thử lại sau!`,
      );
    }

    try {
      await this.staticRelationRepository.addSectionItem(
        transactionManager,
        section,
        item,
      );
      return { statusCode: 201, description: 'Tạo Static Relation thành công' };
    } catch (error) {
      Logger.error(error);
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Lỗi hệ thống trong quá trình tạo Static Relation.',
        );
      }
    }
  }

  /**
   *
   * @param transactionEntityManager
   * @param uuid
   * @returns
   */
  async deleteStaticRelation(
    transactionEntityManager: EntityManager,
    uuid: string,
  ) {
    try {
      await this.staticRelationRepository.deleteStaticRelation(
        transactionEntityManager,
        uuid,
      );
      return {
        statusCode: 201,
        message: `Xoá Static Relation thành công!`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình xoá Static Relation. Vui lòng thử lại sau!`,
      );
    }
  }

  /**
   * @description delete a section-item relation with section uuid & item uuid
   * @param transactionManager 
   * @param sectionUuid 
   * @param itemUuid 
   * @returns 
   */
  async deleteRelationSectionItem(
    transactionManager: EntityManager,
    sectionUuid: string,
    itemUuid: string,
  ) {
    let section, item;
    if (isUuid(sectionUuid)) {
      section = await transactionManager
        .getRepository(StaticSection)
        .findOne({ uuid: sectionUuid });
    } else {
      throw new InternalServerErrorException(
        'Section Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    if (isUuid(itemUuid)) {
      item = await transactionManager
        .getRepository(StaticItem)
        .findOne({ uuid: itemUuid });
    } else {
      throw new InternalServerErrorException(
        'Item Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    if (!item || !section) {
      throw new InternalServerErrorException(
        `${
          !item ? 'Item' : 'Section'
        } này không tồn tại nên không thể xoá mối quan hệ. Vui lòng kiểm tra và thử lại sau!`,
      );
    }

    try {
      await this.staticRelationRepository.deleteRelationSectionItem(
        transactionManager,
        section,
        item,
      );
      return {
        statusCode: 201,
        message: `Xoá Static Relation thành công!`,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          `Lỗi hệ thống trong quá trình xoá Static Relation. Vui lòng thử lại sau!`,
        );
      }
    }
  }
}
