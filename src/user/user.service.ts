import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,
    // private configService: ConfigService,
// private tokenEmailRepository : TokenEmailRepository,
  ) {}
  async createUser(transactionEntityManager: EntityManager,
    createUserDto: CreateUserDto) {
      
   await this.usersRepository.createUser(transactionEntityManager,createUserDto);
   return { statusCode: 201, message: 'Tạo người dùng thành công.' };
  }
  async updateUser( transactionManager: EntityManager,
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
            first_name:firstName,
            last_name:lastName,
            phone_number:phoneNumber,
            dob,
            position,
            is_deleted:isDeleted,
            personal_email:personalEmail, 
            profile_photo_key:profilePhotoKey,
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

    // private encryptDataToToken(data) {
    //   const cipherText: string = cryptojs.AES.encrypt(
    //     JSON.stringify(data),
    //     this.configService.get<string>('EMAIL_TOKEN_KEY'),
    //   ).toString();
    //   const token: string = cipherText
    //     .replace(/\+/g, '-')
    //     .replace(/\//g, '_')
    //     .replace(/=+$/, '');
  
    //   return token;
    // }
  
}
