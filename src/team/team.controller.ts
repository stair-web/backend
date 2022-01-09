import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Connection } from "typeorm";
import { CreateTeamDto } from "./dto/create-team.dto";
import { TeamService } from "./team.service";

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(
    private team$:TeamService,
    private connection: Connection,

  ) {}

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
  async createTeam(@Body() createTeamDto :CreateTeamDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.team$.addTeam(transactionManager,createTeamDto);
    });
  }

  //Xóa team
  @Post('')
  @ApiResponse({ status: 201, description: 'Tạo team thành công.' })
  @ApiOperation({ summary: 'Tạo team.' })
  async deleteTeam(@Body() createTeamDto :CreateTeamDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.team$.addTeam(transactionManager,createTeamDto);
    });
  }
}