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
} from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';


@Controller()
export class AppController {
  constructor(
    private connection: Connection,
  ) {}

 
//   @Get('/dang-nhap-tai-khoan')
//   async login(@Query() signInDto: SignInDto) {
//     const login = await this.connection.transaction((transactionManager) => {
//       return this.user.signIn(transactionManager, signInDto);
//     });
//     return { login };
//   }

}
