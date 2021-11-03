import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { GetAllPostDto } from './dto/get-all-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}
  async create(
    transactionEntityManager: EntityManager,
    createPostDto: CreatePostDto,
  ) {
    await this.postRepository.createPost(
      transactionEntityManager,
      createPostDto,
    );
    return { statusCode: 201, message: 'Tạo bài viết thành công.' };
  }
  async update(
    transactionEntityManager: EntityManager,
    updatePostDto: UpdatePostDto,
    id: string,
  ) {
    await this.postRepository.updatePost(
      transactionEntityManager,
      updatePostDto,
      id,
    );
    return { statusCode: 201, message: 'Cập nhật bài viết thành công.' };
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
