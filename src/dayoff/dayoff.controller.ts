/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Query,
  UseGuards,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Update } from 'aws-sdk/clients/dynamodb';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserInformation } from 'src/user-information/user-information.entity';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { Connection, TransactionManager } from 'typeorm';
import { DayoffService } from './dayoff.service';
import { DayOffSearch } from './dto/dayoff-search.dto';
import { ReportDayOffSearch } from './dto/report-day-off-search.dto';
import { UpdateRemoteDay } from './dto/update-remote-day.dto';

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
      return this.dayoffService.getAllDayOffAdmin(
        transactionManager,
        dayOffSearch,
      );
    });
  }

  @Put('all')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Update Remote Day thành công!',
  })
  @ApiOperation({summary: 'Update Remote Day For All'})
  async updateRemoteDayAdminAll(
    @Body() updateRemoteDay: UpdateRemoteDay,
    // @GetUser() user: User,
    // @Param('uuid') uuid: string,
    // @Param('amount') amount: number,
  ){
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.updateRemoteDayAdminAll(
        transactionManager,
        updateRemoteDay,
      );
    });
  }

  @Put('one')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Update Remote Day thành công!',
  })
  @ApiOperation({summary: 'Update Remote Day For One'})
  async updateRemoteDayAdminOne(
    // @Body() dayOffSearch: DayOffSearch,
    // @GetUser() user: User,
    // @Body() {
    //   number: amount, 
    // },
    // @Param('email') email: string,
    // @Param('amout') amount: number,
    @Body() updateRemoteDay: UpdateRemoteDay,
  ){
    // dayOffSearch.staffId = user.id;
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.updateRemoteDayAdminOne(
        transactionManager,
        updateRemoteDay,
      );
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
    @GetUser() user: User,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.getAllDayOffStaff(
        transactionManager,
        dayOffSearch,
        user,
      );
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
  async getDetailDayOff(@Param('uuid') uuid: string) {
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
  async createDayOff(
    @Body() dayOffSearch: DayOffSearch,
    @GetUser() user: User,
  ) {
    dayOffSearch.staffId = user.id;
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
    @GetUser() user: User,
    @Param('uuid') uuid: string,
  ) {
    dayOffSearch.staffId = user.id;
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.updateDayOff(
        transactionManager,
        dayOffSearch,
        uuid,
      );
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
  async approve(@Param('uuid') uuid: string, @GetUser() user: User) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.approve(transactionManager, user, uuid);
    });
  }

  @Put('reject/:uuid')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Reject thành công.',
  })
  @ApiOperation({ summary: 'Reject lịch nghỉ phép' })
  async reject(@Param('uuid') uuid: string, @GetUser() user: User) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.reject(transactionManager, user, uuid);
    });
  }

  @Delete('/:uuid')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Delete thành công.',
  })
  @ApiOperation({ summary: 'Delete lịch nghỉ phép' })
  async delete(@Param('uuid') uuid: string, @GetUser() user: User) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.delete(transactionManager, user, uuid);
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
  async report(@Body('dateOffReport') dateOffReport: ReportDayOffSearch) {
    return await this.connection.transaction((transactionManager) => {
      return this.dayoffService.report(
        transactionManager,
        dateOffReport.fromDate,
        dateOffReport.toDate,
      );
    });
  }
}
