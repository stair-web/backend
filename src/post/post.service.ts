import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { LanguageTypeEnum } from 'src/common/enum/language-type.enum';
import { isNullOrUndefined, uuidv4 } from 'src/common/utils/common.util';
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

    const refUuid = uuidv4();
    if(isNullOrUndefined(createPostDto.refUuid)){
      createPostDto.refUuid = refUuid;

    }
    createPostDto.uuid = uuidv4();

    return await this.postRepository.savePost(
      transactionEntityManager,
      createPostDto,
      true,
      refUuid
    );
  }
  async getRef(transactionManager: EntityManager){
    const query = transactionManager
        .getRepository(Post)
        .createQueryBuilder('post')
        .select([
          'post.refUuid',
          'COUNT(post.id) as count'
        ])
        .groupBy('post.refUuid')
        .where('post.isDeleted = FALSE and post.refUuid is not null')
        .having('post.count < 2');



        const data = await query.getRawMany();

        
        if(data.length > 0){
          const  listRefUuid = data.map(ele=>ele.post_ref_uuid) ;
          
          const queryList = transactionManager
          .getRepository(Post)
          .createQueryBuilder('post')
          .select([
            'post.uuid',
            'post.title',
            'post.refUuid',
            'post.language',
          ])
          .where("post.refUuid IN (:...refUuid)", { refUuid: listRefUuid })
          .andWhere("post.isDeleted = false")
          const listData = await queryList.getMany();
          return {data: listData}
        } else {
          return {data: []}
        }
       

       

        
  }
  async updatePost(
    transactionEntityManager: EntityManager,
    createPostDto: CreatePostDto,
    refUuid: string,
  ) {
    return await this.postRepository.updatePost(
      transactionEntityManager,
      createPostDto,
      refUuid,
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

    const listPost = await  transactionEntityManager.getRepository(Post).find({
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
          'post.language',
          'post.isApproved',
          'post.refUuid',
          'category.uuid',
        ])
          .where(`post.refUuid = :postUuid`, { postUuid })
          .andWhere('post.isDeleted = :isDeleted', { isDeleted: 'false' })
      },
    });
    const vn = listPost.find(ele=> ele.language === 'vn');
    const en = listPost.find(ele=> ele.language === 'en');
    return {vn:vn,en:en}
  }


  async getPostDetailUuid(transactionEntityManager: EntityManager, postUuid) {
      
    const post = await  transactionEntityManager.getRepository(Post).findOne({
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
          'post.language',
          'post.isApproved',
          'post.refUuid',
          'category.uuid',
        ])
          .where(`post.uuid = :postUuid`, { postUuid })
          .andWhere('post.isDeleted = :isDeleted', { isDeleted: 'false' })
      },
    });
    if(isNullOrUndefined(post)){
      throw new ConflictException(
        `Post không tồn tại!`,
      );
    }
    return {data:post}
  }

  async getPostsByCategory(
    transactionEntityManager: EntityManager,
    categoryUuid,
    language: LanguageTypeEnum
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
            'post.language',
            'post.isDeleted',
            'post.fileType',
            'post.refUuid',
            'category.uuid',
          ])
            .where(`category.uuid = :categoryUuid`, { categoryUuid })
            .andWhere('post.isDeleted = :isDeleted', { isDeleted: 'false' })
            .andWhere('post.isApproved = :isApproved', { isApproved: 'true' })
            .orderBy('post.createdAt', 'DESC')
            if(language !== LanguageTypeEnum.All){               
              qb.andWhere('post.language = :language', { language: language })
            }

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
