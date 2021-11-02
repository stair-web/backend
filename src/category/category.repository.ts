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
  async updateCategory(
    transactionManager: EntityManager,
    updateCategoryDto: UpdateCategoryDto,
    id: number,
  ) {
    const findCategoryByName = await this.getCategoryByName(
      transactionManager,
      updateCategoryDto.categoryName,
    );
    if (findCategoryByName) {
      throw new ConflictException(
        `Category đã tồn tại trong hệ thống, vui lòng sử dụng tên khác.`,
      );
    }

    const findCategoryById = await this.getCategoryById(
      transactionManager,
      id,
    );
    if (isNullOrUndefined(findCategoryById)) {
      throw new ConflictException(`Category không tồn tại trong hệ thống.`);
    }

    const { categoryName, isDeleted } = updateCategoryDto;
    const category = transactionManager.update(
      Category,
      { id },
      {
        categoryName,
        isDeleted,
      },
    );

    try {
      await transactionManager.save(category);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tạo Category, vui lòng thử lại sau.',
      );
    }

    return category;
  }
  async getAllCatalogue(transactionManager: EntityManager): Promise<unknown> {
    try {
      const query = transactionManager
        .getRepository(Category)
        .createQueryBuilder('category')
        .select([
          'category.id',
          'category.categoryName',
          'category.isDeleted',
          'category.createdAt',
          'category.updatedAt',
        ])
        .orderBy('category.categoryName', 'ASC')
        .andWhere('category.isDeleted = FALSE');
      const data = await query.getMany();
      return data;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình lấy danh sách Category, vui lòng thử lại sau.',
      );
    }
  }
  async createCategory(
    transactionManager: EntityManager,
    createCategoryDto: CreateCategoryDto,
  ) {
    try {
      const findCategory = await this.getCategoryByName(
        transactionManager,
        createCategoryDto.categoryName,
      );

      if (findCategory) {
        throw new ConflictException(
          `Category đã tồn tại trong hệ thống, vui lòng sử dụng tên khác.`,
        );
      }
      const { categoryName } = createCategoryDto;
      const category = transactionManager.create(Category, {
        categoryName,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

      await transactionManager.save(category);
      return category;
    } catch (error) {
      Logger.error(error);
      Logger.log(error);
      console.log(error);

      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tạo Category, vui lòng thử lại sau.',
      );
    }
  }
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
}
