import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Category } from 'src/category/category.entity';
import { LanguageTypeEnum } from 'src/common/enum/language-type.enum';
import { isNullOrUndefined, paramStringToJson } from 'src/lib/utils/util';
import { Topic } from 'src/topic/topic.entity';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { isBuffer } from 'util';
import { ApprovePostDto } from './dto/approve-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { GetAllPostDto } from './dto/get-all-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async approvePost(
    transactionManager: EntityManager,
    approvePostDto: ApprovePostDto,
  ) {
    try {
      const post = await transactionManager
        .getRepository(Post)
        .findOne({ uuid: approvePostDto.uuid });
      if (isNullOrUndefined(post)) {
        throw new ConflictException(`Bài viết không tồn tại trong hệ thống!`);
      }
      post.isApproved = approvePostDto.isApproved;
      await transactionManager.save(post);
      return {
        statusCode: 201,
        message: `${
          approvePostDto.isApproved ? 'Phê duyệt' : 'Huỷ phê duyệt'
        } bài viết thành công.`,
      };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình ${
          approvePostDto.isApproved ? 'phê duyệt' : 'huỷ phê duyệt'
        } bài viết, vui lòng thử lại sau.`,
      );
    }
  }

  async getAll(
    transactionEntityManager: EntityManager,
    getAllPostDto: GetAllPostDto,
  ) {
    try {
      const { page, filter, sorts } = getAllPostDto;
      let { perPage } = getAllPostDto;
      if (isNullOrUndefined(perPage)) {
        perPage = 25;
      }
      const query = transactionEntityManager
        .getRepository(Post)
        .createQueryBuilder('post')
        .leftJoin('post.category', 'category')
        // .leftJoin('post.topic', 'topic')
        .select([
          'post.id',
          'post.uuid',
          'post.title',
          'post.shortDescription',
          'post.imageSrc',
          'post.content',
          'post.priority',
          'post.isApproved',
          'post.createdAt',
          'post.updatedAt',
          'post.fileType',
          'post.language',
          'category.uuid',
          'category.categoryName',
        ])
        .where('post.isDeleted = FALSE')
        .andWhere('post.language = :language', {
          language: getAllPostDto.language,
        })
        .take(perPage)
        .skip((page - 1) * perPage)
        .orderBy('post.createdAt', 'DESC');

      // Filter list
      if (!isNullOrUndefined(filter)) {
        const object = paramStringToJson(filter);
        if (!isNullOrUndefined(object.title)) {
          query.andWhere('LOWER(post.title) LIKE LOWER(:title)', {
            title: `%${object.title}%`,
          });
        }

        if (!isNullOrUndefined(object.shortDescription)) {
          query.andWhere(
            'LOWER(post.shortDescription) LIKE LOWER(:shortDescription)',
            {
              shortDescription: `%${object.shortDescription}%`,
            },
          );
        }

        if (!isNullOrUndefined(object.priority)) {
          query.andWhere('LOWER(post.priority) LIKE LOWER(:priority)', {
            priority: `%${object.priority}%`,
          });
        }

        if (!isNullOrUndefined(object.status)) {
          query.andWhere('LOWER(post.status) LIKE LOWER(:status)', {
            status: `%${object.status}%`,
          });
        }

        if (!isNullOrUndefined(object.category)) {
          query.andWhere('LOWER(category.categoryName) LIKE LOWER(:category)', {
            category: `%${object.category}%`,
          });
        }

        // if (!isNullOrUndefined(object.topic)) {
        //   query.andWhere('LOWER(topic.topicName) LIKE LOWER(:topic)', {
        //     topic: `%${object.topic}%`,
        //   });
        // }
      }
      const data = await query.getMany();
      const total = await query.getCount();

      return { statusCode: 201, data: { data, total } };
    } catch (error) {
      console.log(error);
    }
  }

  async savePost(
    transactionManager: EntityManager,
    createPostDto: CreatePostDto,
    isCreate = false,
    refUuid,
  ) {    
    const checkPostExist = await transactionManager.getRepository(Post).find({
      refUuid: refUuid,
    });

    const checkPostExistEn = checkPostExist.find(
      (ele) => ele.language === 'eng',
    );
    const checkPostExistVn = checkPostExist.find(
      (ele) => ele.language === 'vn',
    );

    if (checkPostExist.length === 0 && isCreate === false) {
      throw new ConflictException(
        `Post chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const checkCategoryExist = await transactionManager
      .getRepository(Category)
      .findOne({
        uuid: createPostDto.en.categoryUuid,
      });

    if (isNullOrUndefined(checkCategoryExist)) {
      throw new ConflictException(
        `Category chưa tồn tại trong hệ thống. Vui lòng chọn category khác hoặc thử lại sau!`,
      );
    }
    //en
    const postEn = transactionManager.create(Post, {
      id: checkPostExistEn?.id,
      uuid: createPostDto.en.uuid,
      title: createPostDto.en.title,
      shortDescription: createPostDto.en.shortDescription,
      imageSrc: createPostDto.en.imageSrc,
      content: createPostDto.en.content,
      category: checkCategoryExist,
      fileType: createPostDto.en.fileType,
      language: LanguageTypeEnum.English,
      refUuid: createPostDto.en.refUuid,
    });

    //vn
    const postVn = transactionManager.create(Post, {
      id: checkPostExistVn?.id,
      uuid: createPostDto.vn.uuid,
      title: createPostDto.vn.title,
      shortDescription: createPostDto.vn.shortDescription,
      imageSrc: createPostDto.vn.imageSrc,
      content: createPostDto.vn.content,
      category: checkCategoryExist,
      fileType: createPostDto.vn.fileType,
      language: LanguageTypeEnum.VietNam,
      refUuid: createPostDto.vn.refUuid,
    });

    try {
      await transactionManager.save(postEn);
      await transactionManager.save(postVn);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình ${
          isCreate ? 'tạo' : 'update'
        } post, vui lòng thử lại sau.`,
      );
    }
    return {
      statusCode: 201,
      message: `${isCreate ? 'Lưu' : 'Cập nhật'} bài viết thành công.`,
    };
  }
  async updatePost(
    transactionManager: EntityManager,
    createPostDto: CreatePostDto,
    refUuid,
  ) {
   
    const checkPostExist = await transactionManager.getRepository(Post).find({
      refUuid: refUuid,
    });

    const checkPostExistEn = checkPostExist.find(
      (ele) => ele.language === 'en',
    );
    const checkPostExistVn = checkPostExist.find(
      (ele) => ele.language === 'vn',
    );

    if (checkPostExist.length === 0) {
      throw new ConflictException(
        `Post chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const checkCategoryExist = await transactionManager
      .getRepository(Category)
      .findOne({
        uuid: createPostDto.en.categoryUuid,
      });

    if (isNullOrUndefined(checkCategoryExist)) {
      throw new ConflictException(
        `Category chưa tồn tại trong hệ thống. Vui lòng chọn category khác hoặc thử lại sau!`,
      );
    }

    //en    
    checkPostExistEn.uuid = createPostDto.en.uuid;
    checkPostExistEn.title = createPostDto.en.title;
    checkPostExistEn.shortDescription = createPostDto.en.shortDescription;
    checkPostExistEn.imageSrc = createPostDto.en.imageSrc;
    checkPostExistEn.content = createPostDto.en.content;
    checkPostExistEn.category = checkCategoryExist;
    checkPostExistEn.fileType = createPostDto.en.fileType;
    checkPostExistEn.language = LanguageTypeEnum.English;
    checkPostExistEn.refUuid = createPostDto.en.refUuid;

    //vn
    checkPostExistVn.uuid = createPostDto.vn.uuid;
    checkPostExistVn.title = createPostDto.vn.title;
    checkPostExistVn.shortDescription = createPostDto.vn.shortDescription;
    checkPostExistVn.imageSrc = createPostDto.vn.imageSrc;
    checkPostExistVn.content = createPostDto.vn.content;
    checkPostExistVn.category = checkCategoryExist;
    checkPostExistVn.fileType = createPostDto.vn.fileType;
    checkPostExistVn.language =  LanguageTypeEnum.VietNam;
    checkPostExistVn.refUuid = createPostDto.vn.refUuid;

    try {
      await transactionManager.save(checkPostExistEn);
      await transactionManager.save(checkPostExistVn);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình 
       update
         post, vui lòng thử lại sau.`,
      );
    }
    return {
      statusCode: 201,
      message: `Cập nhật bài viết thành công.`,
    };
  }
  async deletePost(transactionManager: EntityManager, uuid: string) {
    const checkPostExist = await transactionManager
      .getRepository(Post)
      .findOne({
        uuid,
      });

    if (isNullOrUndefined(checkPostExist)) {
      throw new ConflictException(
        `Bài viết chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const post = transactionManager.create(Post, {
      id: checkPostExist?.id,
      isDeleted: true,
    });

    try {
      await transactionManager.save(post);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình xoà bài viết, vui lòng thử lại sau.`,
      );
    }
    return {
      statusCode: 201,
      message: `Xoá bài viết thành công.`,
    };
  }
}
