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
  Req,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connection } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AcitveUserDto } from './dto/active-user.dto';
import { CheckExistsUserDto } from './dto/check-exists-user.dto';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/guards/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';

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
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
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
   *
   * @param acitveUserDto
   * @returns
   */
  @Post('/activate/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá kích hoạt người dùng.',
  })
  @ApiOperation({ summary: 'Kích hoạt người dùng' })
  @ApiResponse({ status: 201, description: 'Kích hoạt người dùng thành công' })
  async activateUser(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.activateUser(transactionManager, uuid);
    });
  }

  /**
   *
   * @param acitveUserDto
   * @returns
   */
  @Post('/deactivate/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá kích hoạt người dùng.',
  })
  @ApiOperation({ summary: 'Kích hoạt người dùng' })
  @ApiResponse({ status: 201, description: 'Kích hoạt người dùng thành công' })
  async deactivateUser(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.deactivateUser(transactionManager, uuid);
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

  // @Post('send-email-reset-password/:email')
  // @ApiResponse({
  //   status: 500,
  //   description: 'Lỗi trong quá trình gửi email, hoặc email không đúng.',
  // })
  // @ApiResponse({ status: 201, description: 'Gửi mail thành công' })
  // @ApiOperation({ summary: 'Gửi email quên mật khẩu.' })
  // async sendResetPasswordEmail(@Param('email') email: string) {
  //   return await this.connection.transaction((transactionManager) => {
  //     return this.userService.sendResetPasswordEmail(transactionManager, email);
  //   });
  // }

  @Get('/detail/:uuid')
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
  async getUserByUuid(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.getUserByUuid(transactionManager, uuid);
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
  async deleteUser(@Param('uuid') uuid: string) {
    return await this.connection.transaction((transactionManager) => {
      return this.userService.deleteUser(transactionManager, uuid);
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

  /**
   * @description to check value if exists
   * @param param 
   * @param value 
   * @returns 201 202
   * @example 
   *  /check-exists/username/example
   * OR: /check-exists/email/example@email.com
   */
  @Get('/check-exists/:param/:value')
  @ApiResponse({
    status: 201,
    description: 'Username này chưa tồn tại trong hệ thống.',
  })
  @ApiResponse({
    status: 202,
    description: 'Username này đã tồn tại trong hệ thống!',
  })
  async checkUsernameExists(
    @Param('param') param: string,
    @Param('value') value: string,
  ) {
    if (!(param in new CheckExistsUserDto()))
      throw new InternalServerErrorException(
        'Không hỗ trợ kiểm tra tồn tại cho trường này!',
      );
    let object = {};
    object[param] = value;
    return await this.connection.transaction((transactionManager) => {
      return this.userService.checkUserExists(
        transactionManager,
        new CheckExistsUserDto(object),
      );
    });
  }
}
