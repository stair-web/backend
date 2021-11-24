import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/utils/common.util';
import { EntityManager } from 'typeorm';
import { CreateStaticItemDto } from './dto/create-static-item.dto';
import { UpdateStaticItemDto } from './dto/update-static-item.dto';
import { StaticItem } from './static-item.entity';
import { StaticItemRepository } from './static-item.repository';

@Injectable()
export class StaticItemService {
  constructor(private staticItemRepository: StaticItemRepository) {}
  /**
   *
   * @param transactionManager
   * @param createStaticItem
   * @returns
   */
  async createStaticItem(
    transactionManager: EntityManager,
    createStaticItem: CreateStaticItemDto,
  ) {
    createStaticItem.uuid = uuidv4();
    try {
      await this.staticItemRepository.saveStaticItem(
        transactionManager,
        createStaticItem,
        true
      );
      return { statusCode: 201, description: 'Tạo Static Item thành công' };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình tạo Static Item.`,
      );
    }
  }

  /**
   *
   * @param transactionManager
   * @param createStaticItem
   * @returns
   */
   async updateStaticItem(
    transactionManager: EntityManager,
    createStaticItem: CreateStaticItemDto,
    uuid
  ) {
    createStaticItem.uuid = uuid;
    try {
      await this.staticItemRepository.saveStaticItem(
        transactionManager,
        createStaticItem,
      );
      return { statusCode: 201, description: 'Update Static Item thành công' };
    } catch (error) {
      Logger.error(error);
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          `Lỗi hệ thống trong quá trình update Static Item.`,
        );
      }
    }
  }

  /**
   *
   * @param transactionManager
   * @param uuid
   * @returns
   */
  async getStaticItem(transactionManager: EntityManager, uuid) {
    return await transactionManager
      .getRepository(StaticItem)
      .findOne({ uuid });
  }

  /**
   *
   * @param transactionManager
   * @param uuid
   * @returns
   */
  async getAll(transactionManager: EntityManager) {
    return await transactionManager.getRepository(StaticItem).find();
  }

  /**
   * 
   * @param transactionEntityManager 
   * @param uuid 
   * @returns 
   */
  async deleteStaticItem(
    transactionEntityManager: EntityManager,
    uuid: string,
  ) {
    return await this.staticItemRepository.deleteStaticItem(
      transactionEntityManager,
      uuid
    );
  }
}
