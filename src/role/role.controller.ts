import { Controller, Post, Body, ValidationPipe, Get, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { AddRoleDto } from './dto/add-role.dto';
import { Connection } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

const controllerName = 'role';
@ApiTags(controllerName)
@Controller(controllerName)
export class RoleController {
  constructor(
    private roleService: RoleService,
    private connection: Connection,
  ) {}

  /**
   * @method POST
   * @description add a role
   * @param addRoleDto 
   * @returns 
   */
  @Post()
  async addRole(@Body(ValidationPipe) addRoleDto: AddRoleDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.roleService.saveRole(transactionManager, addRoleDto, true);
    });
  }

  /**
   * @method POST
   * @description create a user
   * @param addRoleDto 
   * @returns 
   */
  @Put()
  async updateRole(@Body(ValidationPipe) addRoleDto: AddRoleDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.roleService.saveRole(transactionManager, addRoleDto);
    });
  }

  @Get('all')
  async getAllRole() {
    return await this.connection.transaction((transactionManager) => {
      return this.roleService.getAllRole(transactionManager);
    });
  }
}
