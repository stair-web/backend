import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/util/common.util';
import { StaticItem } from 'src/static-page/static-item/static-item.entity';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CreateStaticSectionDto } from './dto/create-static-section.dto';
import { StaticSection } from './static-section.entity';

@EntityRepository(StaticSection)
export class StaticSectionRepository extends Repository<StaticSection> {
  /**
   *
   * @param transactionManager
   * @returns
   */
  async saveSection(
    transactionManager: EntityManager,
    createStaticSection: CreateStaticSectionDto,
  ) {
    const staticSection = transactionManager.create(
      StaticSection,
      createStaticSection,
    );

    try {
      await transactionManager.getRepository(StaticSection).save(staticSection);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
