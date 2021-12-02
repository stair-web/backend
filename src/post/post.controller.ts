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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllPostDto } from './dto/get-all-post.dto';
import { ApprovePostDto } from './dto/approve-post.dto';
import { LanguageTypeEnum } from 'src/common/enum/language-type.enum';

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

  @Put('/:refUuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình cập nhật bài viết.',
  })
  @ApiOperation({ summary: 'Cập nhật bài viết.' })
  @ApiResponse({ status: 201, description: 'Cập nhật bài viết thành công' })
  async update(@Body() createPostDto: CreatePostDto, @Param('refUuid') refUuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.updatePost(transactionManager, createPostDto, refUuid);
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

  @Get('/:refUuid')
  @ApiResponse({
    status: 201,
    description: 'Lấy chi tiết bài viết thành công.',
  })
  @ApiOperation({ summary: 'Chi tiết bài viết' })
  async getPostDetail(@Param('refUuid') refUuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.getPostDetail(transactionManager, refUuid);
    });
  }

  @Get('category/:categoryUuid/:language')
  @ApiResponse({
    status: 201,
    description: 'Lấy danh sách bài viết theo category thành công.',
  })
  @ApiParam({name:'language',enum:LanguageTypeEnum})
  @ApiOperation({ summary: 'Danh sách bài viết theo category.' })
  async getPostsByCategory(@Param('categoryUuid') uuid: string, @Param('language') language: LanguageTypeEnum) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.getPostsByCategory(transactionManager, uuid,language);
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

  @Post('/approve-post')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình huỷ/phê duyệt bài viết.',
  })
  @ApiOperation({ summary: 'Huỷ/Phê duyệt bài viết.' })
  @ApiResponse({ status: 201, description: 'Huỷ/Phê duyệt viết thành công.' })
  async approvePost(@Body() approvePost: ApprovePostDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.postService.approvePost(transactionManager, approvePost);
    });
  }
}
