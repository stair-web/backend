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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private connection: Connection,
  ) {}

  @Post()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Category.',
  })
  @ApiResponse({
    status: 409,
    description: 'Category đã tồn tại trong hệ thống',
  })
  @ApiOperation({ summary: 'Tạo Category.' })
  @ApiResponse({ status: 201, description: 'Tạo Category thành công' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.categoryService.createCategory(
        transactionManager,
        createCategoryDto,
      );
    });
  }

  @Put('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình cập nhật Category.',
  })
  @ApiResponse({
    status: 409,
    description: 'Category đã tồn tại trong hệ thống',
  })
  @ApiOperation({ summary: 'Cập nhật Category.' })
  @ApiResponse({ status: 201, description: 'Cập nhật Category thành công' })
  async updateCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('uuid') uuid: string,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.categoryService.updateCategory(
        transactionManager,
        createCategoryDto,
        uuid
      );
    });
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách Catalogue thành công.',
  })
  @ApiOperation({ summary: 'Lấy danh sách Catalogue' })
  async getCatalogue() {
    return await this.connection.transaction((transactionManager) => {
      return this.categoryService.getAllCategory(transactionManager);
    });
  }
}
