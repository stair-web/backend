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
          'post.refUuid',
          'category.uuid',
          'category.categoryName',
        ])
        .where('post.isDeleted = FALSE')
        
        .take(perPage)
        .skip((page - 1) * perPage)
        .orderBy('post.createdAt', 'DESC');
        if(getAllPostDto.language !== LanguageTypeEnum.All && getAllPostDto.language !== undefined){
          query.andWhere('post.language = :language', {
            language: getAllPostDto.language,
          })
        }
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

    //Case update
    if (checkPostExist.length === 0 && isCreate === false) {
      throw new ConflictException(
        `Post chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }


    //Case create
    let languageCreate = createPostDto.language === LanguageTypeEnum.English?LanguageTypeEnum.English:LanguageTypeEnum.VietNam;
    const checkPostExistLanguage = checkPostExist.find(
      (ele) => ele.language === languageCreate,
    );
      if(!isNullOrUndefined(checkPostExistLanguage)){
        throw new ConflictException(
          `Bài viết vỡi ngôn ngữ này đã tồn tại!`,
        );
      }

    const checkCategoryExist = await transactionManager
      .getRepository(Category)
      .findOne({
        uuid: createPostDto.categoryUuid,
      });

    if (isNullOrUndefined(checkCategoryExist)) {
      throw new ConflictException(
        `Category chưa tồn tại trong hệ thống. Vui lòng chọn category khác hoặc thử lại sau!`,
      );
    }
    //en
    const post = transactionManager.create(Post, {
      id: checkPostExistEn?.id,
      uuid: createPostDto.uuid,
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      imageSrc: createPostDto.imageSrc,
      content: createPostDto.content,
      category: checkCategoryExist,
      fileType: createPostDto.fileType,
      language: createPostDto.language,
      refUuid: createPostDto.refUuid,
    });

    

    try {
      await transactionManager.save(post);
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
    uuid,
  ) {
   
    const checkPostExist = await transactionManager.getRepository(Post).findOne({
      uuid: uuid,
    });

    const checkPostExistrefUuid = await transactionManager.getRepository(Post).findOne({
      refUuid: createPostDto.refUuid, isDeleted :false,
    });


    if (isNullOrUndefined(checkPostExist) ) {
      throw new ConflictException(
        `Post chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    
    // if (isNullOrUndefined(checkPostExistrefUuid) ) {
    //   throw new ConflictException(
    //     `Reference Post không tồn tại trong hệ thống!`,
    //   );
    // }

    const checkCategoryExist = await transactionManager
      .getRepository(Category)
      .findOne({
        uuid: createPostDto.categoryUuid,
      });

    if (isNullOrUndefined(checkCategoryExist)) {
      throw new ConflictException(
        `Category chưa tồn tại trong hệ thống. Vui lòng chọn category khác hoặc thử lại sau!`,
      );
    }

    
    checkPostExist.uuid = createPostDto.uuid;
    checkPostExist.title = createPostDto.title;
    checkPostExist.shortDescription = createPostDto.shortDescription;
    checkPostExist.imageSrc = createPostDto.imageSrc;
    checkPostExist.content = createPostDto.content;
    checkPostExist.category = checkCategoryExist;
    checkPostExist.fileType = createPostDto.fileType;
    // checkPostExist.language = createPostDto.language;
    // checkPostExist.refUuid = createPostDto.refUuid;

 
    try {
      await transactionManager.save(checkPostExist);
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
    checkPostExist.isDeleted = true;
   

    try {
      await transactionManager.save(checkPostExist);
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
