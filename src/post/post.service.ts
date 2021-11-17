import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/util/common.util';
import { EntityManager } from 'typeorm';
import { ApprovePostDto } from './dto/approve-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { GetAllPostDto } from './dto/get-all-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async createPost(
    transactionEntityManager: EntityManager,
    createPostDto: CreatePostDto,
  ) {
    createPostDto.uuid = uuidv4();
    return await this.postRepository.savePost(
      transactionEntityManager,
      createPostDto,
      true,
    );
  }

  async updatePost(
    transactionEntityManager: EntityManager,
    createPostDto: CreatePostDto,
    uuid: string,
  ) {
    createPostDto.uuid = uuid;
    return await this.postRepository.savePost(
      transactionEntityManager,
      createPostDto,
    );
  }

  async deletePost(
    transactionEntityManager: EntityManager,
    uuid: string,
  ) {
    return await this.postRepository.deletePost(
      transactionEntityManager,
      uuid
    );
  }

  async getAll(
    transactionEntityManager: EntityManager,
    getAllPostDto: GetAllPostDto,
  ) {
    return await this.postRepository.getAll(
      transactionEntityManager,
      getAllPostDto,
    );
  }

  async getPostDetail(transactionEntityManager: EntityManager, postUuid) {
    return await transactionEntityManager.getRepository(Post).findOne({
      join: {
        alias: 'post',
        leftJoinAndSelect: {
          category: 'post.category',
        },
      },
      relations: ['category'],
      where: (qb) => {
        qb.select([
          'post.id',
          'post.uuid',
          'post.title',
          'post.shortDescription',
          'post.imageSrc',
          'post.content',
          'post.createdAt',
          'post.updatedAt',
          'post.isDeleted',
          'post.fileType',
          'category.uuid',
        ])
          .where(`post.uuid = :postUuid`, { postUuid })
          .andWhere('post.isDeleted = :isDeleted', { isDeleted: 'false' })
      },
    });
  }

  async getPostsByCategory(
    transactionEntityManager: EntityManager,
    categoryUuid,
  ) {
    try {
      const posts = await transactionEntityManager.getRepository(Post).find({
        join: {
          alias: 'post',
          leftJoinAndSelect: {
            category: 'post.category',
          },
        },
        relations: ['category'],
        where: (qb) => {
          qb.select([
            'post.uuid',
            'post.title',
            'post.shortDescription',
            'post.imageSrc',
            'post.content',
            'post.createdAt',
            'post.updatedAt',
            'post.isDeleted',
            'post.fileType',
            'category.uuid',
          ])
            .where(`category.uuid = :categoryUuid`, { categoryUuid })
            .andWhere('post.isDeleted = :isDeleted', { isDeleted: 'false' })
            .andWhere('post.isApproved = :isApproved', { isDeleted: 'true' })
            .orderBy('post.createdAt', 'DESC');
        },
      });

      return { statusCode: 201, data: { posts, total: posts.length } };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình lấy bài viết theo category, vui lòng thử lại sau.`,
      );
    }
  }
  async approvePost(transactionManager: EntityManager, approvePost: ApprovePostDto): Promise<unknown> {
    return await this.postRepository.approvePost(
      transactionManager,
      approvePost,
    );
  }
}
