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
import { StaticSectionService } from './static-section.service';
import { CreateStaticSectionDto } from './dto/create-static-section.dto';
import { UpdateStaticSectionDto } from './dto/update-static-section.dto';
import { Connection } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

const controllerName = 'static-section';
@ApiTags(controllerName)
// @ApiTags('static-page')
@Controller(controllerName)
export class StaticSectionController {
  constructor(
    private readonly staticSectionService: StaticSectionService,
    private connection: Connection,
  ) {}

  /**
   *
   * @param createStaticSection
   * @returns
   */
  @Post()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Section.',
  })
  async createStaticSection(@Body() createStaticSection: CreateStaticSectionDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSectionService.createStaticSection(
        transactionManager,
        createStaticSection,
      );
    });
  }

  /**
   *
   * @param createStaticSection
   * @returns
   */
   @Put('/:uuid')
   @ApiResponse({
     status: 500,
     description: 'Lỗi hệ thống trong quá trình tạo Static Section.',
   })
   @ApiOperation({ summary: 'Update Static Section.' })
   @ApiResponse({ status: 201, description: 'Tạo Static Section thành công' })
   async updateStaticSection(@Param('uuid') uuid: string, @Body() createStaticSection: CreateStaticSectionDto) {
     return await this.connection.transaction((transactionManager) => {
       return this.staticSectionService.updateStaticSection(
         transactionManager,
         createStaticSection,
         uuid
       );
     });
   }

  /**
   *
   * @returns all static page
   */
  @Get()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Section.',
  })
  async GetStaticSection() {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSectionService.getAll(transactionManager);
    });
  }

  /**
   *
   * @param uuid
   * @returns
   */
  @Get('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Section.',
  })
  async GetAllStaticSection(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSectionService.getStaticSection(
        transactionManager,
        uuid,
      );
    });
  }

  /**
   *
   * @param uuid
   * @returns
   */
   @Delete('/:uuid')
   @ApiResponse({
     status: 500,
     description: 'Lỗi hệ thống trong quá trình xoá Static Section.',
   })
   @ApiOperation({ summary: 'Xoá Static Section.' })
   @ApiResponse({ status: 201, description: 'Xoá Static Section thành công' })
   async deletePost(@Param('uuid') uuid: string) {
     return await this.connection.transaction((transactionManager) => {
       return this.staticSectionService.deleteStaticSection(transactionManager, uuid);
     });
   }
}
