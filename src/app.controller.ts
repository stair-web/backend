import { Request, response } from 'express';
import {
  Get,
  Controller,
  Res,
  Render,
  Req,
  Query,
  Param,
  Post,
  Logger,
  Body,
} from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInDto } from './user/dto/sign-in.dto';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private connection: Connection,
    private userService:UserService,
    ) {}

   
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
