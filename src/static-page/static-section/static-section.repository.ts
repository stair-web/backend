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
      title: createStaticSection.title
    });

    try {
      await transactionManager.save(staticSection);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
