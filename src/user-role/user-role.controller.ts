import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRoleService } from './user-role.service';
import { AddUserRoleDto } from './dto/add-user-role.dto';
import { Connection } from 'typeorm';

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
}
