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

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
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
      const total = await query.getCount();
      return { statusCode: 200, data: { data, total } };
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
    const findCategory = await this.getCategoryByName(
      transactionManager,
      createCategoryDto.categoryName,
    );
    if (findCategory) {
      throw new ConflictException(
        `Category đã tồn tại trong hệ thống, vui lòng sử dụng tên khác để đăng kí.`,
      );
    }
    const { categoryName } = createCategoryDto;
    const category = transactionManager.create(Category, {
      categoryName,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

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
  async getCategoryByName(transactionManager: EntityManager, name: string) {
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
      .andWhere('category.category_name = :category_name', { name })
      .andWhere('category.isDeleted = FALSE');

    const data = await query.getOne();

    if (isNullOrUndefined(data)) {
      throw new NotFoundException(`Không tìm thấy Category.`);
    }

    return { statusCode: 200, data };
  }
}
