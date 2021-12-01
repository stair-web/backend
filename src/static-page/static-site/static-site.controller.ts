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
import { StaticSiteService } from './static-site.service';
import { CreateStaticSiteDto } from './dto/create-static-site.dto';
import { UpdateStaticSiteDto } from './dto/update-static-site.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { SiteType } from './enum/site-type.enum';

const controllerName = 'static-site';
@ApiTags(controllerName)
// @ApiTags('static-page')
@Controller(controllerName)
export class StaticSiteController {
  constructor(
    private readonly staticSiteService: StaticSiteService,
    private connection: Connection,
  ) {}

  /**
   *
   * @param createStaticSite
   * @returns
   */
  @Post()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Site.',
  })
  @ApiOperation({ summary: 'Tạo Static Site.' })
  @ApiResponse({ status: 201, description: 'Tạo Static Site thành công' })
  async createStaticSite(@Body() createStaticSite: CreateStaticSiteDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSiteService.createStaticSite(
        transactionManager,
        createStaticSite,
      );
    });
  }

  /**
   *
   * @param createStaticSite
   * @returns
   */
  @Put('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình cập nhật Static Site.',
  })
  @ApiOperation({ summary: 'Update Static Site.' })
  @ApiResponse({ status: 201, description: 'cập nhật Static Site thành công' })
  async updateStaticSite(
    @Param('uuid') uuid: string,
    @Body() createStaticSite: CreateStaticSiteDto,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSiteService.updateStaticSite(
        transactionManager,
        createStaticSite,
        uuid,
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
      return this.staticSiteService.getAll(transactionManager);
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
    description: 'Lỗi hệ thống trong quá trình tạo Static Site.',
  })
  async GetAllStaticSite(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSiteService.getStaticSite(transactionManager, uuid);
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
    description: 'Lỗi hệ thống trong quá trình xoá Static Site.',
  })
  @ApiOperation({ summary: 'Xoá Static Site.' })
  @ApiResponse({ status: 201, description: 'Xoá Static Site thành công' })
  async deletePost(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSiteService.deleteStaticSite(transactionManager, uuid);
    });
  }

  /**
   * 
   * @param uuid 
   * @param type 
   * @returns 
   */
  @Post('apply-type/:uuid/:type')
  @ApiQuery({ name: 'type', enum: SiteType })
  async applySiteType(
    @Param('uuid') uuid: string,
    @Query('type') type: SiteType
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSiteService.applySiteType(transactionManager, uuid, type);
    });
  }
}
