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
      return await transactionManager.save(staticItem);
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
  async deleteStaticItem(transactionManager: EntityManager, uuid: string) {
    const checkStaticItemExist = await transactionManager
      .getRepository(StaticItem)
      .findOne({
        uuid,
      });

    if (isNullOrUndefined(checkStaticItemExist)) {
      throw new ConflictException(
        `StaticItem chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const item = transactionManager.create(StaticItem, {
      id: checkStaticItemExist?.id,
      isDeleted: true,
    });

    try {
      await transactionManager.save(item);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình xoà StaticItem, vui lòng thử lại sau.`,
      );
    }
    return {
      statusCode: 201,
      message: `Xoá StaticItem thành công.`,
    };
  }
}
