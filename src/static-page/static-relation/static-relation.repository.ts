import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { isNullOrUndefined, uuidv4 } from 'src/common/utils/common.util';
import { StaticItem } from 'src/static-page/static-item/static-item.entity';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { StaticSection } from '../static-section/static-section.entity';
import { StaticSite } from '../static-site/static-site.entity';
// import { CreateStaticRelationDto } from './dto/create-static-relation.dto';
import { StaticRelation } from './static-relation.entity';

@EntityRepository(StaticRelation)
export class StaticRelationRepository extends Repository<StaticRelation> {
  /**
   *
   * @param transactionManager
   * @param createStaticRelation
   * @returns
   */
  async saveStaticRelation(
    transactionManager: EntityManager,
    // createStaticRelation: CreateStaticRelationDto,
    isCreate = false,
  ) {
    // const checkRelationExist = await transactionManager
    //   .getRepository(StaticRelation)
    //   .findOne({
    //     uuid: createStaticRelation.uuid,
    //   });

    // if (isNullOrUndefined(checkRelationExist) && isCreate === false) {
    //   throw new ConflictException(
    //     `Relation chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
    //   );
    // }

    // const staticRelation = transactionManager.create(StaticRelation, {
    //   id: checkRelationExist?.id,
    //   title: createStaticRelation.title
    // });

    try {
      // await transactionManager.save(staticRelation);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description add relation between Site and Section
   * @param transactionManager 
   * @param site 
   * @param section 
   */
  async addSiteSection(
    transactionManager: EntityManager,
    site: StaticSite,
    section: StaticSection,
  ) {
    await this.checkRelationExists(transactionManager, site, section, null);

    const staticRelation = transactionManager.create(StaticRelation, {
      site,
      section,
      item: null,
    });
    try {
      await transactionManager.save(staticRelation);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description add relation between Site and Item
   * @param transactionManager 
   * @param site 
   * @param item 
   */
  async addSiteItem(
    transactionManager: EntityManager,
    site: StaticSite,
    item: StaticItem,
  ) {
    await this.checkRelationExists(transactionManager, site, null, item);

    const staticRelation = transactionManager.create(StaticRelation, {
      site,
      section: null,
      item,
    });
    try {
      await transactionManager.save(staticRelation);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description add relation between Section and Item
   * @param transactionManager 
   * @param section 
   * @param item 
   */
  async addSectionItem(
    transactionManager: EntityManager,
    section: StaticSection,
    item: StaticItem,
  ) {
    await this.checkRelationExists(transactionManager, null, section, item);

    const staticRelation = transactionManager.create(StaticRelation, {
      site: null,
      section,
      item,
    });
    try {
      await transactionManager.save(staticRelation);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description check relation exists
   * @param transactionManager 
   * @param site 
   * @param section 
   * @param item 
   */
  async checkRelationExists(
    transactionManager: EntityManager,
    site: StaticSite,
    section: StaticSection,
    item: StaticItem,
  ) {
    const checkRelationExist = await transactionManager
      .getRepository(StaticRelation)
      .findOne({
        site,
        section,
        item,
        isDeleted: false,
      });

    if (!isNullOrUndefined(checkRelationExist)) {
      throw new ConflictException(
        `Relation đã tồn tại trong hệ thống. Không thể tạo thêm relation!`,
      );
    } else {
      return checkRelationExist;
    }
  }
}
