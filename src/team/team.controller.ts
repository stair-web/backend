import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';

@Controller('team')
@ApiTags('team')
export class TeamController {
  constructor(private readonly teamService: TeamService,
    private connection: Connection,
    ) {}
/**
   * @method GET
   * @description get all the team
   * @returns all the team
   */
 @Get()

 @ApiResponse({
   status: 200,
   description: 'Lấy danh sách team dùng thành công.',
 })
 @ApiOperation({ summary: 'Danh sách team' })
 async getAllTeam() {
   return await this.connection.transaction((transactionManager) => {
     return this.teamService.getAllTeam(transactionManager);
   });
 }


 
  /**
   * @method POST
   * @description create a user
   * @param createTeamDto
   * @returns status of creation
   */
   @Post()
   @ApiResponse({
     status: 500,
     description: 'Lỗi hệ thống trong quá trình tạo team.',
   })
   @ApiResponse({
     status: 409,
     description: 'Team đã tồn tại trong hệ thống.',
   })
   @ApiOperation({ summary: 'Tạo Team.' })
   @ApiResponse({ status: 201, description: 'Tạo Team thành công' })
   async create(@Body() createTeamDto: CreateTeamDto) {
     return await this.connection.transaction((transactionManager) => {
       return this.teamService.createTeam(transactionManager, createTeamDto);
     });
   }
 

    /**
   * @method Put
   * @description create a user
   * @param createTeamDto
   * @returns status of creation
   */
     @Put('/:uuid')
     @ApiResponse({
       status: 500,
       description: 'Lỗi hệ thống trong quá trình update team.',
     })
    
     @ApiOperation({ summary: 'update Team.' })
     @ApiResponse({ status: 201, description: 'update Team thành công' })
     async update(@Body() updateTeamDto: UpdateTeamDto,    @Param('uuid') uuid: string,) {
       return await this.connection.transaction((transactionManager) => {
         updateTeamDto.uuid = uuid;
         return this.teamService.updateTeam(transactionManager, updateTeamDto);
       });
     }

     /**
   * @method Delete
   * @description create a user
   * @param createTeamDto
   * @returns status of creation
   */
      @Delete('/:uuid')
      @ApiResponse({
        status: 500,
        description: 'Lỗi hệ thống trong quá trình update team.',
      })
      @ApiOperation({ summary: 'delete Team.' })
      @ApiResponse({ status: 201, description: 'delete Team thành công' })
      async delete(    @Param('uuid') uuid: string,) {
        return await this.connection.transaction((transactionManager) => {
          return this.teamService.deleteTeam(transactionManager, uuid);
        });
      }
}
