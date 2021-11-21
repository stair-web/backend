import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/utils/common.util';
import { EntityManager } from 'typeorm';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  // getAll(transactionManager: EntityManager): Promise<unknown> {
  //   return this.categoryRepository.getAllCatalogue(transactionManager);
  // }

  async getAllCategory(transactionManager: EntityManager) {
    try {
      return await transactionManager.getRepository(Category).find({
        where: [{ isDeleted: false }],
        order: { categoryName: 1 },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống, vui lòng thử lại sau.',
      );
    }
  }

  async createCategory(
    transactionManager: EntityManager,
    createCategoryDto: CreateCategoryDto,
  ) {
    createCategoryDto.uuid = uuidv4();
    return await this.categoryRepository.saveCategory(
      transactionManager,
      createCategoryDto,
      true,
    );
  }

  async updateCategory(
    transactionManager: EntityManager,
    createCategoryDto: CreateCategoryDto,
    uuid
  ) {
    createCategoryDto.uuid = uuid;
    return await this.categoryRepository.saveCategory(
      transactionManager,
      createCategoryDto,
    );
  }
}
