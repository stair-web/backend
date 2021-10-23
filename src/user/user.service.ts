import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEmailType } from 'src/common/enum/token-email-type.enum';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { ResetPasswordTokenDto } from './dto/reset-password-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as cryptojs from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { CreateTokenEmailDto } from 'src/email/dto/create-token-email.dto';
import { TokenEmailRepository } from 'src/token-email/token-email.repository';
import { EmailInfoDto } from 'src/email/dto/email-info.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { EmailService } from 'src/email/email.service';
import { v4 as uuidv4 } from 'uuid';
import e from 'express';
import { AcitveUserDto } from './dto/active-user.dto';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,
    private configService: ConfigService,
    private tokenEmailRepository: TokenEmailRepository,
    private emailService: EmailService,
  ) {

  }
  async createUser(transactionEntityManager: EntityManager,

    createUserDto: CreateUserDto) {
    //Gen password
    createUserDto.password = uuidv4();
   
      let userCreated = await this.usersRepository.createUser(transactionEntityManager, createUserDto);
      userCreated.personal_id = this.genPersonalId(userCreated.id)
      await transactionEntityManager.update(
        User,
        { id: userCreated.id },
        {
          personal_id: userCreated.personal_id
        },
      );
      // set expired date for link
      const expired = new Date();
      expired.setDate(expired.getDate() + 7);

      const resetPasswordTokenDto: ResetPasswordTokenDto = {
        email: userCreated.personal_email,
        timeStamp: expired.toString(),
        isActive: true,
        uuid: userCreated.uuid,
        type: TokenEmailType.ACTIVE_ACCOUNT,
      };

      const token = this.encryptDataToToken(resetPasswordTokenDto);
      //create token email
      const createTokenEmailDto: CreateTokenEmailDto = {
        userId: userCreated.id,
        token,
        type: resetPasswordTokenDto.type,
      };
      await this.tokenEmailRepository.createTokenEmail(
        transactionEntityManager,
        createTokenEmailDto,
      );

      // Send email active account
      const emailInfoDto: EmailInfoDto = {
        email: createUserDto.personalEmail,
        name: createUserDto.firstName + ' ' + createUserDto.lastName,
        username: createUserDto.firstName + ' ' + createUserDto.lastName,
        password: createUserDto.password,
        token,
      };

      await this.emailService.sendActiveAccountEmail(emailInfoDto, 'url-active-user');
      return { statusCode: 201, message: 'Tạo người dùng thành công.' };

    

  }



  async updateUser(transactionManager: EntityManager,
    updateUserDto: UpdateUserDto,
    uuid: string,) {

    const {
      firstName,
      lastName,
      phoneNumber,
      dob,
      position,
      isDeleted,
      personalEmail,
      profilePhotoKey,
    } = updateUserDto;

    const user = (await this.getUserByUuid(transactionManager, uuid)).data;


    if (isNullOrUndefined(user)) {
      throw new InternalServerErrorException(
        'Tài khoản không tồn tại.',
      );
    }

    try {

      await transactionManager.update(
        User,
        { id: user.id },
        {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          dob,
          position,
          is_deleted: isDeleted,
          personal_email: personalEmail,
          profile_photo_key: profilePhotoKey,
        },
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi trong quá trình chỉnh sửa người dùng.',
      );
    }
    return { statusCode: 200, message: 'Chỉnh sửa người dùng thành công.' };
  }
  async getUserByUuid(transactionManager: EntityManager, uuid: string) {
    return await this.usersRepository.getUserByUuid(transactionManager, uuid);
  }
  async getUserById(transactionManager: EntityManager, id: number) {
    return await this.usersRepository.getUserById(transactionManager, id);
  }
  async getAllUser(
    transactionManager: EntityManager,
    getAllUserDto: GetAllUserDto,
  ) {
    return this.usersRepository.getAllUser(transactionManager, getAllUserDto);
  }
  async activeUser(
    transactionManager: EntityManager,
    acitveUserDto: AcitveUserDto,
  ) {
    let data =  this.decryptTokenToData(acitveUserDto.token)

    let dateNow = Date();
    //token het han
    if(Date.parse(dateNow) > Date.parse(data.timeStamp)){
      return { statusCode: 500, message: 'Token đã hết hạn' };
    }

    let userRes = await this.usersRepository.getUserByUuid(transactionManager,data.uuid);

    //Khong tim thay nguoi dung
    if (isNullOrUndefined(userRes.data)) {
      return { statusCode: 500, message: 'Không tìm thấy người dùng' };
    }

    //user da duoc kich hoat
    if(!userRes.data)
    if(userRes.data.is_actived){
      return { statusCode: 500, message: 'Người dùng đã được kích hoạt' };
    }

    

     await transactionManager.update(
      User,{id:userRes.data.id},{
          is_actived:true,
      }
    )
    return { statusCode: 201, message: 'Kích hoạt người dùng thành công.' };
  }
  genPersonalId(id) {
    let pId = '';
    if (id > 99999) {
      pId = '' + id;
    }
    else if (id > 9999) {
      pId = '0' + id;

    }
    else if (id > 999) {
      pId = '00' + id;

    }
    else if (id > 99) {
      pId = '000' + id;

    } else if (id > 9) {
      pId = '0000' + id;
    }

    return pId;
  }
  async deleteUser(
    transactionManager: EntityManager,
    deleteUserDto: DeleteUserDto,
    uuid: string,
  ) {
    return this.usersRepository.deleteUser(
      transactionManager,
      deleteUserDto,
      uuid,
    );
  }
  async sendResetPasswordEmail(
    transactionManager: EntityManager,
    email: string,
  ) {
    // const user = await transactionManager.getRepository(User).findOne({
    //   email: email,
    //   is_deleted: false,
    // });
    // if (!user) {
    //   throw new InternalServerErrorException(
    //     `Không tìm thấy người dùng với email ${email}.`,
    //   );
    // }
    // // set expired date for link
    // const expired = new Date();
    // expired.setDate(expired.getDate() + 7);

    // const resetPasswordTokenDto: ResetPasswordTokenDto = {
    //   email: email,
    //   timeStamp: expired.toString(),
    //   isActive: false,
    //   type: TokenEmailType.RESET_PASSWORD,
    // };

    // // encrypt token
    // const token = this.encryptDataToToken(resetPasswordTokenDto);

    // //create token email
    // const createTokenEmailDto: CreateTokenEmailDto = {
    //   userId: user.id,
    //   token,
    //   type: resetPasswordTokenDto.type,
    // };
    // await this.tokenEmailRepository.createTokenEmail(
    //   transactionManager,
    //   createTokenEmailDto,
    // );

    // const emailInfoDto: EmailInfoDto = {
    //   email,
    //   name: user.first_name + user.last_name,
    //   token,
    //   username: user.email,
    // };
    // user.isForgetPassword = true;

    // try {
    //   await transactionManager.save(user);
    // } catch (error) {
    //   Logger.error(error);
    // }

    // // send email
    // return this.emailService.sendResetPasswordEmail(emailInfoDto, originName);
  }

  private encryptDataToToken(data) {
    try {
      const cipherText: string = cryptojs.AES.encrypt(
        JSON.stringify(data),
        this.configService.get<string>('EMAIL_TOKEN_KEY'),
      ).toString();
      const token: string = cipherText
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      return token;
    } catch (error) {
      console.log(error);
    }

  }
  private decryptTokenToData(token: string) {
    const cipherText: string = token.replace(/\-/g, '+').replace(/\_/g, '/');
    const data = JSON.parse(
      cryptojs.AES.decrypt(
        cipherText,
        this.configService.get<string>('EMAIL_TOKEN_KEY'),
      ).toString(cryptojs.enc.Utf8),
    );

    return data;
  }

}
