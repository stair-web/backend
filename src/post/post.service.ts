import { Injectable } from '@nestjs/common';
import { uuidv4 } from 'src/common/util/common.util';
import { EntityManager } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { GetAllPostDto } from './dto/get-all-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
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
      true
    );
  }
  
  async updatePost(
    transactionEntityManager: EntityManager,
    createPostDto: CreatePostDto,
    uuid: string
  ) {
    createPostDto.uuid = uuid;
    return await this.postRepository.savePost(
      transactionEntityManager,
      createPostDto
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
}
