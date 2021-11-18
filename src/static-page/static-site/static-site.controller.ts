import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaticSiteService } from './static-site.service';
import { CreateStaticSiteDto } from './dto/create-static-site.dto';
import { UpdateStaticSiteDto } from './dto/update-static-site.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';

@Controller('static-site')
@ApiTags('static-site')
export class StaticSiteController {
  constructor(private readonly staticSiteService: StaticSiteService,
    private connection: Connection,
    ) {}
  @Post()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Site.',
  })
  @ApiResponse({
    status: 409,
    description: 'Static Site đã tồn tại trong hệ thống.',
  })
  @ApiOperation({ summary: 'Tạo Static Site.' })
  @ApiResponse({ status: 201, description: 'Tạo Static Site thành công' })
  async createStaticSite(@Body() createStaticSite: CreateStaticSiteDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSiteService.createStaticSite(transactionManager, createStaticSite);
    });
  }
  @Get('/:id')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Static Site.',
  })
  @ApiResponse({
    status: 409,
    description: 'Static Site đã tồn tại trong hệ thống.',
  })
  @ApiOperation({ summary: 'Tạo Static Site.' })
  @ApiResponse({ status: 201, description: 'Tạo Static Site thành công' })
  async GetStaticSite(@Param()id) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSiteService.getStaticSite(transactionManager, id);
    });
  }
  
}
