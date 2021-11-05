import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Connection } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllPostDto } from './dto/get-all-post.dto';

@ApiTags('Post')
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
      return this.postService.createPost(transactionManager, createPostDto);
    });
  }

  @Put('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình cập nhật bài viết.',
  })
  @ApiOperation({ summary: 'Cập nhật bài viết.' })
  @ApiResponse({ status: 201, description: 'Cập nhật bài viết thành công' })
  async update(@Body() createPostDto: CreatePostDto, @Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.updatePost(transactionManager, createPostDto, uuid);
    });
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách bài viết thành công.',
  })
  @ApiOperation({ summary: 'Danh sách bài viết' })
  async getAll(@Query() getAllPostDto: GetAllPostDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.getAll(transactionManager, getAllPostDto);
    });
  }

  @Get('/:uuid')
  @ApiResponse({
    status: 201,
    description: 'Lấy chi tiết bài viết thành công.',
  })
  @ApiOperation({ summary: 'Danh sách bài viết' })
  async getPostDetail(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.getPostDetail(transactionManager, uuid);
    });
  }

  @Get('category/:categoryUuid')
  @ApiResponse({
    status: 201,
    description: 'Lấy danh sách bài viết theo category thành công.',
  })
  @ApiOperation({ summary: 'Danh sách bài viết theo category.' })
  async getPostsByCategory(@Param('categoryUuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.getPostsByCategory(transactionManager, uuid);
    });
  }

  @Delete('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình xoá bài viết.',
  })
  @ApiOperation({ summary: 'Xoá bài viết.' })
  @ApiResponse({ status: 201, description: 'Xoá bài viết thành công' })
  async deletePost(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.deletePost(transactionManager, uuid);
    });
  }
}
