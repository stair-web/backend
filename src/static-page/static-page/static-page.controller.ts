import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { StaticRelationService } from '../static-relation/static-relation.service';
import { SiteType } from '../static-site/enum/site-type.enum';
import { StaticPageDto } from './dto/static-page.dto';
import { StaticPageService } from './static-page.service';

const controllerName = 'static-page';
@ApiTags(controllerName)
// @ApiTags('static-page')
@Controller(controllerName)
export class StaticPageController {
  constructor(
    private readonly staticPageService: StaticPageService,
    private connection: Connection,
  ) {}

  /**
   *
   * @returns all static page
   */
  @Get('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình get Static Page.',
  })
  async getPageByUuid(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticPageService.getPageByUuid(transactionManager, uuid);
    });
  }

  @Get('type/:siteType')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình get Static Page.',
  })
  @ApiQuery({ name: 'siteType', enum: SiteType })
  async getPageBySiteType(@Query('siteType') siteType: SiteType) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticPageService.getPageBySiteType(transactionManager, siteType);
    });
  }

  @Post()
  async updatePage(@Body() updateStaticPageDto: StaticPageDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticPageService.updateStaticPage(transactionManager, updateStaticPageDto);
    });
  }
}
