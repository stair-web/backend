import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connection } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { SignInDto } from './dto/sign-in.dto';

const controllerName = 'user';
@ApiTags(controllerName)
@Controller(controllerName)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private connection: Connection,
  ) {}

  /**
   * @method GET
   * @description get all the users
   * @param getAllUserDto
   * @returns all the users
   */
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

  /**
   * @method POST
   * @description create a user
   * @param createUserDto
   * @returns status of creation
   */
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
      return this.userService.createUser(transactionManager, createUserDto);
    });
  }

  /**
   * @method PUT
   * @description Update user's information.
   * @param updateUserDto
   * @param uuid
   * @returns
   */
  @Put('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi trong quá trình chỉnh sửa thông tin người dùng.',
  })
  @ApiResponse({
    status: 200,
    description: 'Chỉnh sửa thông tin người dùng thành công',
  })
  @ApiOperation({ summary: 'Chỉnh sửa người dùng.' })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('uuid') uuid: string,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.updateUser(
        transactionManager,
        updateUserDto,
        uuid,
      );
    });
  }

  @Post('send-email-reset-password/:email')
  @ApiResponse({
    status: 500,
    description: 'Lỗi trong quá trình gửi email, hoặc email không đúng.',
  })
  @ApiResponse({ status: 201, description: 'Gửi mail thành công' })
  @ApiOperation({ summary: 'Gửi email quên mật khẩu.' })
  async sendResetPasswordEmail(@Param('email') email: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.sendResetPasswordEmail(transactionManager, email);
    });
  }

  @Get('/:id')
  @ApiResponse({
    status: 500,
    description: 'Lỗi trong quá trình lấy thông tin người dùng.',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy dữ liệu người dùng thành công',
  })
  @ApiOperation({ summary: 'Xem chi tiết người dùng.' })
  async getUserById(@Param('id') id: number) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.getUserById(transactionManager, id);
    });
  }

  @Delete('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi trong quá trình xóa người dùng.',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa người dùng thành công',
  })
  @ApiOperation({ summary: 'Xóa người dùng.' })
  async deleteUser(
    @Body() deleteUserDto: DeleteUserDto,
    @Param('uuid') uuid: string,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.deleteUser(
        transactionManager,
        deleteUserDto,
        uuid,
      );
    });
  }
  
  /**
   * @method POST
   * @description sign in with username password
   * @param signInDto 
   * @returns state of sign in
   */
  @Post('sign-in')
  @ApiResponse({
    status: 500,
    description: 'Tên đăng nhập hoặc mật khẩu không đúng.',
  })
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công.' })
  @ApiOperation({ summary: 'Đăng nhập.' })
  async signIn(@Body() signInDto: SignInDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.signIn(transactionManager, signInDto);
    });
  }
}
