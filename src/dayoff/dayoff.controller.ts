/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
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
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người dùng thành công.',
  })
  @ApiOperation({ summary: 'Danh sách người dùng' })
  async getAllDayOffAdmin(@Query() dayOffSearch: DayOffSearch) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.getAllDayOffAdmin(transactionManager, dayOffSearch);
    });
  } 
}
