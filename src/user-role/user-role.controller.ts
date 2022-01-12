import { Controller, Post, Body, ValidationPipe, Get, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRoleService } from './user-role.service';
import { AddUserRoleDto } from './dto/add-user-role.dto';
import { Connection } from 'typeorm';
import { DeactiveRoleUser } from './dto/deactive-role-user';

const controllerName = 'user-role';
@ApiTags(controllerName)
@Controller(controllerName)
export class UserRoleController {
  constructor(
    private adminRoleService: UserRoleService,
    private connection: Connection,
  ) {}

  /**
   * @method POST
   * @description add a role for a user
   * @param addUserRoleDto 
   * @returns 
   */
  @Post()
  async addUserRole(@Body(ValidationPipe) addUserRoleDto: AddUserRoleDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.adminRoleService.addUserRole(transactionManager, addUserRoleDto);
    });
  }

  //Get Role of User
  @Get('role-detail/:uuid')
  async getUserRoleById(@Param() id: any) {    
    return await this.connection.transaction((transactionManager) => {
      return this.adminRoleService.getUserRoleByUserId(transactionManager, id.uuid);
    });
  }

  //Deactive Role of User
  @Post('deactive-role-user')
  async deactiveRoleUser(@Body() data: DeactiveRoleUser) {    
    return await this.connection.transaction((transactionManager) => {
      return this.adminRoleService.deactiveUserRole(transactionManager, data.id,data.roleCode);
    });
  }
}
