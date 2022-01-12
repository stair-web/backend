import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamService } from './team.service';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private team$: TeamService, private connection: Connection) {}

  //Lấy danh sách team
  @Get('')
  @ApiResponse({ status: 201, description: 'Lấy danh sách team thành công.' })
  @ApiOperation({ summary: 'Lấy danh sách team.' })
  async getList() {
    return await this.connection.transaction((transactionManager) => {
      return this.team$.getListTeam(transactionManager);
    });
  }

  //Tạo team
  @Post('')
  @ApiResponse({ status: 201, description: 'Tạo team thành công.' })
  @ApiOperation({ summary: 'Tạo team.' })
  async createTeam(@Body() createTeamDto: CreateTeamDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.team$.addTeam(transactionManager, createTeamDto);
    });
  }

  //Detail team
  @Get('detail/:uuid')
  @ApiResponse({ status: 201, description: 'Tạo team thành công.' })
  @ApiOperation({ summary: 'Detail team.' })
  async detailTeam(@Param('uuid') uuid: string) {
    
    return await this.connection.transaction((transactionManager) => {
      return this.team$.getDetail(transactionManager, uuid);
    });
  }

  //Update team
  @Put('')
  @ApiResponse({ status: 201, description: 'Tạo team thành công.' })
  @ApiOperation({ summary: 'Update team.' })
  async updateTeam(@Body() createTeamDto: CreateTeamDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.team$.updateTeam(transactionManager, createTeamDto);
    });
  }

  //Xóa team

  @Delete('/:uuid')
  @ApiResponse({ status: 201, description: 'Xóa team thành công.' })
  @ApiOperation({ summary: 'Xóa team.' })
  async deleteTeam(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.team$.removeTeam(transactionManager, uuid);
    });
  }
}
