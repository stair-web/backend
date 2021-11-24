import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { StaticRelationService } from './static-relation.service';

const controllerName = 'static-relation';
@ApiTags(controllerName)
// @ApiTags('static-page')
@Controller(controllerName)
export class StaticRelationController {
  constructor(
    private readonly staticRelationService: StaticRelationService,
    private connection: Connection,
  ) {}

  /**
   *
   * @returns all static page
   */
  @Get()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Section.',
  })
  async getAllRelation() {
    return await this.connection.transaction((transactionManager) => {
      return this.staticRelationService.getAll(transactionManager);
    });
  }

  /**
   * @description create relation between site and section
   * @param siteUuid 
   * @param sectionUuid 
   * @returns 
   */
  @Post('site-section/:siteUuid/:sectionUuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Section.',
  })
  async addSiteSection(
    @Param('siteUuid') siteUuid: string,
    @Param('sectionUuid') sectionUuid: string,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticRelationService.addSiteSection(transactionManager, siteUuid, sectionUuid);
    });
  }
  
  /**
   * @description create relation between site and item
   * @param siteUuid 
   * @param itemUuid 
   * @returns 
   */
  @Post('site-item/:siteUuid/:itemUuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Section.',
  })
  async addSiteItem(
    @Param('siteUuid') siteUuid: string,
    @Param('itemUuid') itemUuid: string,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticRelationService.addSiteItem(transactionManager, siteUuid, itemUuid);
    });
  }

  /**
   * @description create relation between section and item
   * @param sectionUuid 
   * @param itemUuid 
   * @returns 
   */
  @Post('section-item/:sectionUuid/:itemUuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Section.',
  })
  async addSectionItem(
    @Param('sectionUuid') sectionUuid: string,
    @Param('itemUuid') itemUuid: string,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticRelationService.addSectionItem(transactionManager, sectionUuid, itemUuid);
    });
  }

  /**
   *
   * @param uuid
   * @returns
   */
   @Delete('break-up/:uuid')
   @ApiResponse({
     status: 500,
     description: 'Lỗi hệ thống trong quá trình xoá Static Relation.',
   })
   @ApiOperation({ summary: 'Xoá Static Relation.' })
   @ApiResponse({ status: 201, description: 'Xoá Static Relation thành công' })
   async deletePost(@Param('uuid') uuid: string) {
     return await this.connection.transaction((transactionManager) => {
       return this.staticRelationService.deleteStaticRelation(transactionManager, uuid);
     });
   }
}
