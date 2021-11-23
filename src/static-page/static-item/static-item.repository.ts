import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { isNullOrUndefined } from 'src/common/utils/common.util';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CreateStaticItemDto } from './dto/create-static-item.dto';
import { StaticItem } from './static-item.entity';

@EntityRepository(StaticItem)
export class StaticItemRepository extends Repository<StaticItem> {
  /**
   *
   * @param transactionManager
   * @param createStaticItem
   * @returns
   */
  async saveStaticItem(
    transactionManager: EntityManager,
    createStaticItem: CreateStaticItemDto,
    isCreate = false,
  ) {
    const checkItemExist = await transactionManager
      .getRepository(StaticItem)
      .findOne({
        uuid: createStaticItem.uuid,
      });

    if (isNullOrUndefined(checkItemExist) && isCreate === false) {
      throw new ConflictException(
        `Item chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const staticItem = transactionManager.create(StaticItem, {
      id: checkItemExist?.id,
      uuid: createStaticItem.uuid,
      title: createStaticItem.title,
      url: createStaticItem.url,
      description: createStaticItem.description,
    });

    try {
      await transactionManager.save(staticItem);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
