import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Connection } from "typeorm";
import { TeamService } from "./team.service";

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(
    private team$:TeamService,
    private connection: Connection,

  ) {}
  @Get('')
  @ApiResponse({ status: 201, description: 'Lấy danh sách team thành công.' })
  @ApiOperation({ summary: 'Lấy danh sách team thành công.' })
  async getList() {
    return await this.connection.transaction((transactionManager) => {
      return this.team$.getListTeam(transactionManager);
    });
  }
}