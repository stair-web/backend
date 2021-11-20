import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CreateStaticItemDto } from './dto/create-static-item.dto';
import { StaticItem } from './static-item.entity';

@EntityRepository(StaticItem)
export class StaticItemRepository extends Repository<StaticItem> {
  /**
   *
   * @param transactionManager
   * @returns
   */
  async saveItem(
    transactionManager: EntityManager,
    createStaticItem: CreateStaticItemDto,
  ) {
    const staticItem = transactionManager.create(
      StaticItem,
      createStaticItem,
    );

    try {
      await transactionManager.getRepository(StaticItem).save(staticItem);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
