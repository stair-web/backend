import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { isNullOrUndefined, uuidv4 } from 'src/common/utils/common.util';
import { StaticItem } from 'src/static-page/static-item/static-item.entity';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CreateStaticSectionDto } from './dto/create-static-section.dto';
import { StaticSection } from './static-section.entity';

@EntityRepository(StaticSection)
export class StaticSectionRepository extends Repository<StaticSection> {
  /**
   *
   * @param transactionManager
   * @param createStaticSection
   * @returns
   */
   async saveStaticSection(
    transactionManager: EntityManager,
    createStaticSection: CreateStaticSectionDto,
    isCreate = false,
  ) {
    const checkSectionExist = await transactionManager
      .getRepository(StaticSection)
      .findOne({
        uuid: createStaticSection.uuid,
      });

    if (isNullOrUndefined(checkSectionExist) && isCreate === false) {
      throw new ConflictException(
        `Section chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const staticSection = transactionManager.create(StaticSection, {
      id: checkSectionExist?.id,
      uuid: createStaticSection.uuid,
      title: createStaticSection.title,
      language:createStaticSection.language,
    });

    try {
      return await transactionManager.save(staticSection);
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
   async deleteStaticSection(transactionManager: EntityManager, uuid: string) {
    const checkStaticSectionExist = await transactionManager
      .getRepository(StaticSection)
      .findOne({
        uuid,
      });

    if (isNullOrUndefined(checkStaticSectionExist)) {
      throw new ConflictException(
        `StaticSection chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const section = transactionManager.create(StaticSection, {
      id: checkStaticSectionExist?.id,
      isDeleted: true,
    });

    try {
      await transactionManager.save(section);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình xoà StaticSection, vui lòng thử lại sau.`,
      );
    }
    return {
      statusCode: 201,
      message: `Xoá StaticSection thành công.`,
    };
  }

  /**
   * 
   * @param transactionManager 
   * @param id 
   * @returns 
   */
  async getSectionById(transactionManager: EntityManager, id: number) {
    return await transactionManager
      .getRepository(StaticSection)
      .findOne({
        id,
      });
  }
}
