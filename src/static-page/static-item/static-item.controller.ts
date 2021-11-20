import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaticItemService } from './static-item.service';
import { CreateStaticItemDto } from './dto/create-static-item.dto';
import { UpdateStaticItemDto } from './dto/update-static-item.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';

const controllerName = 'static-item';
@ApiTags(controllerName)
// @ApiTags('static-page')
@Controller(controllerName)
export class StaticItemController {
  constructor(
    private readonly staticItemService: StaticItemService,
    private connection: Connection,
  ) {}

  /**
   * 
   * @param createStaticItem 
   * @returns 
   */
  @Post()
  async createStaticItem(@Body() createStaticItem: CreateStaticItemDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticItemService.createStaticItem(
        transactionManager,
        createStaticItem,
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
       return this.staticItemService.getAll(transactionManager);
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
     description: 'Lỗi hệ thống trong quá trình tạo Static Item.',
   })
   async GetAllStaticSite(@Param('uuid') uuid: string) {
     return await this.connection.transaction((transactionManager) => {
       return this.staticItemService.getStaticItem(
         transactionManager,
         uuid,
       );
     });
   }
}
