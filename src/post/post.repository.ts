import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Category } from 'src/category/category.entity';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { Topic } from 'src/topic/topic.entity';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
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
        .where('(topic.id =:idTopic)', {
          idTopic,
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

      const {
        title,
        short_description,
        date_time,
        priority,
        status,
        isDeleted,
      } = updatePostDto;

      const category = await queryCat.getOne();
      if (isNullOrUndefined(category)) {
        throw new Error('Category không tồn tại');
      }

      const topic = await queryTopic.getOne();
      if (isNullOrUndefined(topic)) {
        throw new Error('Topic không tồn tại');
      }

      const post = await queryTopic.getOne();
      if (isNullOrUndefined(post)) {
        throw new Error('Topic không tồn tại');
      }
      transactionEntityManager.create(Post, {
        category,
        topic,
        title,
        short_description,
        date_time,
        priority,
        status,
        isDeleted,
      });
      await transactionEntityManager.save(post);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tạo bài viết, vui lòng thử lại sau.',
      );
    }
  }
  async findAll(transactionEntityManager: EntityManager) {
    try {
      const data2 = await transactionEntityManager
        .getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.category', 'category')
        .leftJoinAndSelect('post.topic', 'topic')
        .getMany();
      //   let data2 = await transactionEntityManager
      //     .getRepository(Category)
      //     .createQueryBuilder('category')
      //     .leftJoinAndSelect('Category.posts', 'category')
      //     .getMany();
      // const data2 = await transactionEntityManager.getRepository(Category).find({ relations: ["posts"] })

      return data2;
    } catch (error) {}
  }
  async createPost(
    transactionEntityManager: EntityManager,
    createPostDto: CreatePostDto,
  ) {
    try {
      const idCategory = createPostDto.category.id;
      const idTopic = createPostDto.category.id;

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

      const { title, short_description, date_time, priority, status } =
        createPostDto;

      const category = await queryCat.getOne();
      if (isNullOrUndefined(category)) {
        throw new Error('Category không tồn tại');
      }

      const topic = await queryTopic.getOne();
      if (isNullOrUndefined(topic)) {
        throw new Error('Topic không tồn tại');
      }

      const post = transactionEntityManager.create(Post, {
        category,
        topic,
        title,
        short_description,
        date_time: date_time,
        priority,
        status,
      });
      await transactionEntityManager.save(post);
      return post;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tạo bài viết, vui lòng thử lại sau.',
      );
    }
  }
}
