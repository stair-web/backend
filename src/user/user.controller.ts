import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connection } from 'typeorm';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAllUserDto } from './dto/get-all-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private connection: Connection,

    
    ) {}


    @Get()
    @ApiResponse({
      status: 200,
      description: 'Lấy danh sách người dùng thành công.',
    })
    @ApiOperation({ summary: 'Danh sách người dùng' })
    async getAllUser(@Query() getAllUserDto: GetAllUserDto) {
      return await this.connection.transaction((transactionManager) => {
        return this.userService.getAllUser(transactionManager, getAllUserDto);
      });
    }
  
  @Post()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo người dùng.',
  })
  @ApiResponse({
    status: 409,
    description: 'Người dùng đã tồn tại trong hệ thống.',
  })
  @ApiOperation({ summary: 'Tạo người dùng.' })
  @ApiResponse({ status: 201, description: 'Tạo người dùng thành công' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.createUser(
        transactionManager,
        createUserDto,
      );
      })
    // return this.userService.create(createUserDto);
  }


  @Put('/:id')
  @ApiResponse({
    status: 500,
    description: 'Lỗi trong quá trình chỉnh sửa thông tin người dùng.',
  })
  @ApiResponse({
    status: 200,
    description: 'Chỉnh sửa thông tin người dùng thành công',
  })
  @ApiOperation({ summary: 'Chỉnh sửa người dùng.' })
  async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: number) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.updateUser(
        transactionManager,
        updateUserDto,
        id
      );
      })
    // return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
