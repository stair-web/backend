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
import { StaticSiteService } from './static-site.service';
import { CreateStaticSiteDto } from './dto/create-static-site.dto';
import { UpdateStaticSiteDto } from './dto/update-static-site.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';

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
   @Put()
   @ApiResponse({
     status: 500,
     description: 'Lỗi hệ thống trong quá trình tạo Static Site.',
   })
   @ApiOperation({ summary: 'Tạo Static Site.' })
   @ApiResponse({ status: 201, description: 'Tạo Static Site thành công' })
   async updateStaticSite(@Body() createStaticSite: CreateStaticSiteDto) {
     return await this.connection.transaction((transactionManager) => {
       return this.staticSiteService.updateStaticSite(
         transactionManager,
         createStaticSite,
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

}
