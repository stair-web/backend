import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaticSectionService } from './static-section.service';
import { CreateStaticSectionDto } from './dto/create-static-section.dto';
import { UpdateStaticSectionDto } from './dto/update-static-section.dto';
import { Connection } from 'typeorm';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

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
   * @returns all static page
   */
  @Get()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Site.',
  })
  async GetStaticSite() {
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
  async GetAllStaticSite(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSectionService.getStaticSection(
        transactionManager,
        uuid,
      );
    });
  }
}
