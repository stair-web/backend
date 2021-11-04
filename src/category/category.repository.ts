import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getCategoryByName(transactionManager: EntityManager, name: string) {
    try {
      const query = transactionManager
        .getRepository(Category)
        .createQueryBuilder('category')
        .select([
          'category.id',
          'category.categoryName',
          'category.createdAt',
          'category.updatedAt',
          'category.isDeleted',
        ])
        .andWhere('category.categoryName = :name', { name })
        .andWhere('category.isDeleted = FALSE');

      const data = await query.getOne();

      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tìm Category, vui lòng thử lại sau.',
      );
    }
  }
  async getCategoryById(transactionManager: EntityManager, id: number) {
    const query = transactionManager
      .getRepository(Category)
      .createQueryBuilder('category')
      .select([
        'category.id',
        'category.category_name',
        'category.created_at',
        'category.updated_at',
        'category.is_deleted',
      ])
      .andWhere('category.id = :id', { id })
      .andWhere('category.isDeleted = FALSE');

    const data = await query.getOne();

    return data;
  }

  async saveCategory(
    transactionManager: EntityManager,
    createCategoryDto: CreateCategoryDto,
    isCreate = false,
  ) {
    const { categoryName, uuid } = createCategoryDto;

    const checkCategoryExist = await transactionManager
      .getRepository(Category)
      .findOne({
        uuid,
      });

    if (isNullOrUndefined(checkCategoryExist) && isCreate === false) {
      throw new ConflictException(
        `Category chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const checkCategoryNameExist = await transactionManager
      .getRepository(Category)
      .findOne({
        categoryName,
      });

    if (!isNullOrUndefined(checkCategoryNameExist)) {
      throw new ConflictException(
        `Tên category đã tồn tại trong hệ thống. Vui lòng chọn tên mới!`,
      );
    }

    const category = transactionManager.create(Category, {
      id: checkCategoryExist?.id,
      uuid,
      categoryName,
    });
    try {
      await transactionManager.save(category);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình update category, vui lòng thử lại sau.',
      );
    }
    return {
      statusCode: 201,
      message: `${isCreate ? 'Create' : 'Update'} category successfully.`,
    };
  }
}
