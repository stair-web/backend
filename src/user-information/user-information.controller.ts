import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { CreateUserInformationDto } from './dto/create-user-information.dto';
import { GetAllUserInformationDto } from './dto/get-all-user-information.dto';
import { UserInformationDto } from './dto/user-information.dto';
import { UserInformationService } from './user-information.service';

const controllerName = 'user-information';
@ApiTags(controllerName)
@Controller(controllerName)
export class UserInformationController {
  constructor(
    private readonly userInformationService: UserInformationService,
    private connection: Connection,
  ) {}

  /**
   *
   * @param getAllUserInformationDto
   * @returns
   */
  @Get()
  @ApiResponse({
    status: 201,
    description: 'Lấy danh sách người dùng thành công.',
  })
  @ApiOperation({ summary: 'Danh sách người dùng' })
  async getAllUser(
    @Query() getAllUserInformationDto: GetAllUserInformationDto,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.userInformationService.getAllUserInformation(
        transactionManager,
        getAllUserInformationDto,
      );
    });
  }

  @Get('/:uuid')
  @ApiResponse({
    status: 201,
    description: 'Lấy chi tiết thông tin người dùng thành công.',
  })
  async getUserInformationDetail(
    @Param('uuid') uuid: string,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.userInformationService.getUserInformationDetail(
        transactionManager,
        uuid
      );
    });
  }

  /**
   * @method PUT
   * @description create a user
   * @param createUserDto
   * @returns status of creation
   */
   @Put()
   @ApiResponse({
     status: 500,
     description: 'Lỗi hệ thống trong quá trình update người dùng.',
   })
   @ApiResponse({
     status: 409,
     description: 'Người dùng đã tồn tại trong hệ thống.',
   })
   @ApiOperation({ summary: 'Update người dùng.' })
   @ApiResponse({ status: 201, description: 'Tạo người dùng thành công' })
   async update(@Body() createUserInformationDto: CreateUserInformationDto) {
     return await this.connection.transaction((transactionManager) => {
       return this.userInformationService.updateUserInformation(transactionManager, createUserInformationDto);
     });
   }


}
