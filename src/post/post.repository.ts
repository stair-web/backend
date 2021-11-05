import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Category } from 'src/category/category.entity';
import { isNullOrUndefined, paramStringToJson } from 'src/lib/utils/util';
import { Topic } from 'src/topic/topic.entity';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { GetAllPostDto } from './dto/get-all-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async updatePost(
    transactionEntityManager: EntityManager,
    updatePostDto: UpdatePostDto,
    id: string,
  ) {
    try {
      const idCategory = updatePostDto.category.id;
      const idTopic = updatePostDto.category.id;

      const queryPost = transactionEntityManager
        .getRepository(Topic)
        .createQueryBuilder('topic')
        .where('(topic.id =:id)', {
          id,
        });

      const queryCat = transactionEntityManager
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('(category.id =:idCategory)', {
          idCategory,
        });

      const queryTopic = transactionEntityManager
        .getRepository(Topic)
        .createQueryBuilder('topic')
        .where('(topic.id =:idTopic)', {
          idTopic,
        });

      const category = await queryCat.getOne();
      if (isNullOrUndefined(category)) {
        throw new Error('Category không tồn tại');
      }

      // const topic = await queryTopic.getOne();
      // if (isNullOrUndefined(topic)) {
      //   throw new Error('Topic không tồn tại');
      // }

      const post = await queryPost.getOne();
      if (isNullOrUndefined(post)) {
        throw new Error('Bài viết không tồn tại');
      }

      const {
        title,
        shortDescription,
        dateTime,
        priority,
        status,
        isDeleted,
        imageSrc,
      } = updatePostDto;

      transactionEntityManager.update(
        Post,
        { id: id },
        {
          category,
          // topic,
          title,
          shortDescription,
          dateTime,
          priority,
          status,
          isDeleted,
          imageSrc,
        },
      );
      await transactionEntityManager.save(post);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình cập nhật bài viết, vui lòng thử lại sau.',
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
          'post.status',
          'post.createdAt',
          'post.updatedAt',
          'category.uuid',
        ])
        .where('post.isDeleted = FALSE')
        .take(perPage)
        .skip((page - 1) * perPage)
        .orderBy('post.createdAt', 'DESC');
      // Filter list
      console.log(filter);

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

  // async createPost(
  //   transactionEntityManager: EntityManager,
  //   createPostDto: CreatePostDto,
  // ) {
  //   try {
  //     const idCategory = createPostDto.category.id;
  //     const idTopic = createPostDto.category.id;

  //     const queryCat = transactionEntityManager
  //       .getRepository(Category)
  //       .createQueryBuilder('category')
  //       .where('(category.id =:idCategory)', {
  //         idCategory,
  //       });

  //     const queryTopic = transactionEntityManager
  //       .getRepository(Topic)
  //       .createQueryBuilder('topic')
  //       .where('(topic.id =:idTopic)', {
  //         idTopic,
  //       });

  //     const { title, shortDescription, dateTime, priority, status, imageSrc } =
  //       createPostDto;

  //     const category = await queryCat.getOne();
  //     if (isNullOrUndefined(category)) {
  //       throw new Error('Category không tồn tại');
  //     }

  //     // const topic = await queryTopic.getOne();
  //     // if (isNullOrUndefined(topic)) {
  //     //   throw new Error('Topic không tồn tại');
  //     // }

  //     const post = transactionEntityManager.create(Post, {
  //       category,
  //       // topic,
  //       title,
  //       shortDescription,
  //       dateTime,
  //       priority,
  //       status,
  //       imageSrc,
  //     });
  //     await transactionEntityManager.save(post);
  //     return post;
  //   } catch (error) {
  //     Logger.error(error);
  //     throw new InternalServerErrorException(
  //       'Lỗi hệ thống trong quá trình tạo bài viết, vui lòng thử lại sau.',
  //     );
  //   }
  // }

  async savePost(
    transactionManager: EntityManager,
    createPostDto: CreatePostDto,
    isCreate = false,
  ) {
    const { uuid, title, shortDescription, content, imageSrc, categoryUuid } =
      createPostDto;

    const checkPostExist = await transactionManager
      .getRepository(Post)
      .findOne({
        uuid
      });
      
    if (isNullOrUndefined(checkPostExist) && isCreate === false) {
      throw new ConflictException(
        `Post chưa tồn tại trong hệ thống. Vui lòng tạo mới!`,
      );
    }

    const checkCategoryExist = await transactionManager
      .getRepository(Category)
      .findOne({
        uuid: categoryUuid,
      });

    if (isNullOrUndefined(checkCategoryExist)) {
      throw new ConflictException(
        `Category chưa tồn tại trong hệ thống. Vui lòng chọn category khác hoặc thử lại sau!`,
      );
    }

    const post = transactionManager.create(Post, {
      id: checkPostExist?.id,
      uuid,
      title,
      shortDescription,
      imageSrc,
      content,
      category:checkCategoryExist
    });

    try {
      await transactionManager.save(post);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình ${isCreate ? 'tạo' : 'update'} post, vui lòng thử lại sau.`,
      );
    }
    return {
      statusCode: 201,
      message: `${isCreate ? 'Create' : 'Update'} post successfully.`,
    };
  }
}
