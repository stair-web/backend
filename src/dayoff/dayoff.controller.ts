/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Query, UseGuards, Post, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { Connection } from 'typeorm';
import { DayoffService } from './dayoff.service';
import { DayOffSearch } from './dto/dayoff-search.dto';

@Controller('dayoff')
export class DayoffController {
    constructor(
        private connection: Connection,
        private readonly dayoffService: DayoffService,
    ) {}
  @Get()
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người nghỉ phép thành công.',
  })
  @ApiOperation({ summary: 'Danh sách  nghỉ phép theo admin' })
  async getAllDayOffAdmin(@Query() dayOffSearch: DayOffSearch) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.getAllDayOffAdmin(transactionManager, dayOffSearch);
    });
  } 

  @Get('staff')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người nghỉ phép thành công.',
  })
  @ApiOperation({ summary: 'Danh sách  nghỉ phép theo nhân viên' })
  async getAllDayOffStaff(
    @Query() dayOffSearch: DayOffSearch, 
    @GetUser() user: User
    ) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.getAllDayOffStaff(transactionManager, dayOffSearch, user);
    });
  } 

  @Get('/:uuid')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người nghỉ phép thành công.',
  })
  @ApiOperation({ summary: 'Danh sách  nghỉ phép theo uuid' })
  async getDetailDayOff(@Param('uuid') uuid: string,) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.getDetailDayOff(transactionManager, uuid);
    });
  } 

  @Post()
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Tạo thành công.',
  })
  @ApiOperation({ summary: 'Tạo lịch nghỉ phép' })
  async createDayOff(@Body() dayOffSearch: DayOffSearch) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.createDayOff(transactionManager, dayOffSearch);
    });
  } 

  @Put('/:uuid')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Update thành công.',
  })
  @ApiOperation({ summary: 'Update lịch nghỉ phép' })
  async updateDayOff(
    @Body() dayOffSearch: DayOffSearch,
    @Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.updateDayOff(transactionManager, dayOffSearch, uuid);
    });
  }

  @Put('approve/:uuid')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Approve thành công.',
  })
  @ApiOperation({ summary: 'Approve lịch nghỉ phép' })
  async approve(
    @Param('uuid') uuid: string,
    @GetUser() user: User) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.approve(transactionManager, user, uuid);
    });
  }

  @Post('staff-report')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Report thành công.',
  })
  @ApiOperation({ summary: 'Reprort lịch nghỉ phép' })
  async report() {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.report(transactionManager);
    });
  }
}
