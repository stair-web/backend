import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Connection } from 'typeorm';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private connection: Connection,
  ) {}

  @Post()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo bài viết.',
  })
  @ApiOperation({ summary: 'Tạo bài viết.' })
  @ApiResponse({ status: 201, description: 'Tạo bài viết thành công' })
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.create(transactionManager, createPostDto);
    });
    // return await this.connection.transaction((transactionEntityManager) => {
    //   return this.postService.create(transactionEntityManager, createPostDto);
    // });
  }

  @Put('/:id')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình cập nhật bài viết.',
  })
  @ApiOperation({ summary: 'Cập nhật bài viết.' })
  @ApiResponse({ status: 201, description: 'Cập nhật bài viết thành công' })
  async update(@Body() updatePostDto: UpdatePostDto, @Param('id') id: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.update(transactionManager, updatePostDto, id);
    });
    // return await this.connection.transaction((transactionEntityManager) => {
    //   return this.postService.create(transactionEntityManager, createPostDto);
    // });
  }

  @Get()
  async findAll() {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.findAll(transactionManager);
    });
  }
}
