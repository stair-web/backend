import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { StaticItem } from './static-item.entity';


@EntityRepository(StaticItem)
export class StaticItemRepository extends Repository<StaticItem> {
  async saveListItem(transactionManager: EntityManager, listItem: StaticItem[]) {
    try {
      return await   transactionManager.getRepository(StaticItem).save(listItem);
    } catch (error) {
     console.log(error);
      
    }
  }
}
