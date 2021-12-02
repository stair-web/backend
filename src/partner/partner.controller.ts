import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { GetDetailPartnerDto } from './dto/get-detail-partner.dto';
import { Partner } from './partner.entity';
import { PartnerType } from './enum/TypePartner.enum';
import { LanguagerPartnerEnum } from './enum/LanguagePartner.enum';
import { GetDetailParterByType } from './dto/get-detail-partner-by-type.dto';
import { LanguageTypeEnum } from 'src/common/enum/language-type.enum';

@Controller('partner')
@ApiTags('Partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService,
    private connection: Connection,
    ) {}

  @Post()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo Partner.',
  })
  @ApiOperation({ summary: 'Tạo Partner.' })
  @ApiResponse({ status: 201, description: 'Tạo Partner thành công' })
  async createCandidate(@Body() createPartnerDto: CreatePartnerDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.partnerService.createPartner(
        transactionManager,
        createPartnerDto,
      );
    });
  }
  
  
  // @Get('/:uuid')
  // @ApiResponse({
  //   status: 500,
  //   description: 'Lỗi hệ thống trong quá trình lấy thông tin Partner.',
  // })
  // @ApiResponse({
  //   status: 100,
  //   description: 'uuid của page doxa: fb0d9229-a832-421e-9ac8-3da2d1f526cb',
  // })
  // @ApiResponse({
  //   status: 101,
  //   description: 'uuid của page ans: c0fd9c50-c237-4b1b-a877-1cfcf8366d9f',
  // })
  // @ApiOperation({ summary: 'Lấy thông tin Partner. ' })
  // @ApiResponse({ status: 201, type: GetDetailPartnerDto })
  // async getDetailByUuid(@Param('uuid') uuid: string) {
  //   return await this.connection.transaction((transactionManager) => {
  //     return this.partnerService.getDetailPartnerByUuid(transactionManager, uuid);
  //   });
  // }


  @Get('/:type')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình lấy thông tin Partner.',
  })
  @ApiResponse({
    status: 100,
    description: 'type của page doxa: DOXA',
  })
  @ApiResponse({
    status: 101,
    description: 'type của page ans: ANS',
  })
  @ApiOperation({ summary: 'Lấy thông tin Partner by Type. ' })
  @ApiResponse({ status: 201, type: GetDetailPartnerDto })
  async getDetailbyType(@Param('type') type: PartnerType,@Query('language') language:LanguageTypeEnum) {
    return await this.connection.transaction((transactionManager) => {
      return this.partnerService.getDetailPartnerByType(transactionManager, type, language);
    });
  }


  @Get('/:type/:language')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình lấy thông tin Partner.',
  })
  @ApiResponse({
    status: 100,
    description: 'type của page doxa: DOXA',
  })
  @ApiResponse({
    status: 101,
    description: 'type của page ans: ANS',
  })
  @ApiOperation({ summary: 'Lấy thông tin Partner by Type. ' })
  @ApiParam({ name: 'type', enum: PartnerType })
  @ApiParam({ name: 'language', enum: LanguageTypeEnum })
  @ApiResponse({ status: 201, type: GetDetailPartnerDto })
  async getDetailbyTypeAndLanguage(@Param('type') type: PartnerType,@Param('language') language:LanguageTypeEnum) {
    return await this.connection.transaction((transactionManager) => {
      return this.partnerService.getDetailPartnerByType(transactionManager, type, language);
    });
  }




  @Put('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình cập nhật Partner.',
  })
  @ApiOperation({ summary: 'Cập nhật Partner.' })
  @ApiResponse({ status: 201, description: 'Cập nhật Partner thành công' })
  async update(@Body() updatePartnerDto: UpdatePartnerDto, @Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.partnerService.updatePartner(transactionManager, updatePartnerDto, uuid);
    });
  }

  @Delete('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình xoá Partner.',
  })
  @ApiOperation({ summary: 'Xoá Partner.' })
  @ApiResponse({ status: 201, description: 'Xoá Partner thành công' })
  async delete( @Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.partnerService.deletePartner(transactionManager, uuid);
    });
  }
}
