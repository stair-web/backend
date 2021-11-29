import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4, isNullOrUndefined } from 'src/common/utils/common.util';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CreateStaticSiteDto } from './dto/create-static-site.dto';
import { SiteType } from './enum/site-type.enum';
import { StaticSite } from './static-site.entity';

@EntityRepository(StaticSite)
export class StaticSiteRepository extends Repository<StaticSite> {
  /**
   *
   * @param transactionManager
   * @param createStaticSite
   * @returns
   */
  async saveStaticSite(
    transactionManager: EntityManager,
    createStaticSite: CreateStaticSiteDto,
    isCreate = false,
  ) {
    const checkSiteExist = await transactionManager
      .getRepository(StaticSite)
      .findOne({
        uuid: createStaticSite.uuid,
      });

    if (isNullOrUndefined(checkSiteExist) && isCreate === false) {
      throw new ConflictException(
        `Site chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const staticSite = transactionManager.create(StaticSite, {
      id: checkSiteExist?.id,
      uuid: createStaticSite.uuid,
      title: createStaticSite.title,
    });

    try {
      await transactionManager.save(staticSite);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   *
   * @param transactionManager
   * @param uuid
   * @returns
   */
  async deleteStaticSite(transactionManager: EntityManager, uuid: string) {
    const checkStaticSiteExist = await transactionManager
      .getRepository(StaticSite)
      .findOne({
        uuid,
      });

    if (isNullOrUndefined(checkStaticSiteExist)) {
      throw new ConflictException(
        `StaticSite chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const site = transactionManager.create(StaticSite, {
      id: checkStaticSiteExist?.id,
      isDeleted: true,
    });

    try {
      await transactionManager.save(site);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình xoà StaticSite, vui lòng thử lại sau.`,
      );
    }
    return {
      statusCode: 201,
      message: `Xoá StaticSite thành công.`,
    };
  }

  /**
   * 
   * @param transactionManager 
   * @param uuid 
   * @param type 
   */
  async applySiteType(
    transactionManager: EntityManager,
    uuid: string,
    type: SiteType,
  ) {
    const checkSiteExist = await transactionManager
      .getRepository(StaticSite)
      .findOne({
        uuid,
      });

    if (isNullOrUndefined(checkSiteExist)) {
      throw new ConflictException(
        `Site chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    await this.shiftSiteType(transactionManager,type);

    const staticSite = transactionManager.create(StaticSite, {
      id: checkSiteExist?.id,
      type,
    });

    try {
      await transactionManager.save(staticSite);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async shiftSiteType(
    transactionManager: EntityManager,
    type: SiteType,
  ) {
    const checkSiteHasType = await transactionManager
      .getRepository(StaticSite)
      .findOne({
        type,
      });

    if (checkSiteHasType) {
      const staticSite = transactionManager.create(StaticSite, {
        id: checkSiteHasType?.id,
        type: SiteType.UNKNOWN,
      });

      try {
        await transactionManager.save(staticSite)
      } catch (error) {
        Logger.error(error);
      }
    }
  }
}
