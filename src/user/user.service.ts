import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { SignInDto } from './dto/sign-in.dto';
import { UserRoleService } from 'src/user-role/user-role.service';
import e from 'express';
import { AcitveUserDto } from './dto/active-user.dto';
import { uuidv4 } from 'src/common/util/common.util';
import { hashPwd } from 'src/common/util/hash.util';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,
    private configService: ConfigService,
    private tokenEmailRepository: TokenEmailRepository,
    private emailService: EmailService,
    private jwtService: JwtService,
    private userRoleService: UserRoleService,
  ) {}

  /**
   *
   * @param transactionEntityManager
   * @param createUserDto
   * @returns
   */
  async createUser(
    transactionEntityManager: EntityManager,
    createUserDto: CreateUserDto,
  ) {
    //Gen password
    // createUserDto.password = uuidv4();
    createUserDto.userInformation.uuid = uuidv4();
    if (isNullOrUndefined(createUserDto.password)) {
      createUserDto.password = '123123';
    }
    console.log(createUserDto.password);

    const userCreated = await this.usersRepository.createUser(
      transactionEntityManager,
      createUserDto,
    );
    await transactionEntityManager.update(
      User,
      { id: userCreated.id },
      {
        isActive: true,
      },
    );
    // set expired date for link
    const expired = new Date();
    expired.setDate(expired.getDate() + 7);

    // const resetPasswordTokenDto: ResetPasswordTokenDto = {
    //   email: userCreated.email,
    //   timeStamp: expired.toString(),
    //   isActive: true,
    //   type: TokenEmailType.ACTIVE_ACCOUNT,
    // };

    // const token = this.encryptDataToToken(resetPasswordTokenDto);
    // //create token email
    // const createTokenEmailDto: CreateTokenEmailDto = {
    //   userId: userCreated.id,
    //   token,
    //   type: resetPasswordTokenDto.type,
    // };
    // await this.tokenEmailRepository.createTokenEmail(
    //   transactionEntityManager,
    //   createTokenEmailDto,
    // );

    // Send email active account
    // const emailInfoDto: EmailInfoDto = {
    //   email: createUserDto.email,
    //   name: createUserDto.firstName + ' ' + createUserDto.lastName,
    //   username: createUserDto.firstName + ' ' + createUserDto.lastName,
    //   password: createUserDto.password,
    //   token,
    // };

    // await this.emailService.sendActiveAccountEmail(
    //   emailInfoDto,
    //   'url-active-user',
    // );
    return { statusCode: 201, message: 'Tạo người dùng thành công.' };
  }

  /**
   * @Description UPDATE user detail
   * @param transactionManager
   * @param updateUserDto
   * @param uuid
   * @returns
   */
  async updateUser(
    transactionManager: EntityManager,
    updateUserDto: UpdateUserDto,
    uuid: string,
  ) {
    const { email, password } = updateUserDto;

    const user = await this.usersRepository.getUserByUuid(
      transactionManager,
      uuid,
      false,
    );

    if (isNullOrUndefined(user)) {
      throw new InternalServerErrorException('Tài khoản không tồn tại.');
    }

    try {
      const { hashedPassword, salt } = await hashPwd(password);
      if (email) {
        user.email = email;
      }
      if (hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
      }
      await transactionManager.save(user);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi trong quá trình chỉnh sửa người dùng.',
      );
    }
    return { statusCode: 201, message: 'Chỉnh sửa người dùng thành công.' };
  }

  /**
   *
   * @param transactionManager
   * @param id
   * @returns
   */
  async getUserByUuid(transactionManager: EntityManager, uuid: string) {
    const user = await this.usersRepository.getUserByUuid(
      transactionManager,
      uuid,
    );
    return { statusCode: 201, data: { user } };
  }

  /**
   *
   * @param transactionManager
   * @param getAllUserDto
   * @returns
   */
  async getAllUser(
    transactionManager: EntityManager,
    getAllUserDto: GetAllUserDto,
  ) {
    return this.usersRepository.getAllUser(transactionManager, getAllUserDto);
  }

  /**
   *
   * @param transactionManager
   * @returns
   */
  async activateUser(transactionManager: EntityManager, uuid) {
    try {
      await this.usersRepository.activation(
        uuid,
        transactionManager
      );
    } catch (error) {
      throw error;
    }
    return { statusCode: 201, message: 'Kích hoạt người dùng thành công.' };
  }

  /**
   *
   * @param transactionManager
   * @returns
   */
  async deactivateUser(transactionManager: EntityManager, uuid) {
    try {
      await this.usersRepository.activation(
        uuid,
        transactionManager,
        false
      );
    } catch (error) {
      throw error;
    }
    return { statusCode: 201, message: 'Huỷ kích hoạt người dùng thành công.' };
  }

  /**
   *
   * @param transactionManager
   * @param deleteUserDto
   * @param uuid
   * @returns
   */
  async deleteUser(transactionManager: EntityManager, uuid: string) {
    return this.usersRepository.deleteUser(transactionManager, uuid);
  }

  /**
   *
   * @param transactionManager
   * @param email
   */
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

  async signIn(transactionManager: EntityManager, signInDto: SignInDto) {
    const { username, email, password } = signInDto;
    const user = await transactionManager.getRepository(User).findOne({
      where: [
        {
          username,
          isDeleted: false,
          // isForgetPassword: false,
        },
        {
          email,
          isDeleted: false,
          // isForgetPassword: false,
        },
      ],
    });

    // check user exists?
    if (!user) {
      throw new InternalServerErrorException(
        'ERR-01: Tên đăng nhập hoặc mật khẩu không đúng.',
      );
    } else {
      // if (user.isMailVerified === false) {
      //   throw new InternalServerErrorException(
      //     `Tài khoản của bạn chưa được kích hoạt qua email, vui lòng kích hoạt tài khoản trước khi đăng nhập.`,
      //   );
      // }
      if (user.isActive === false) {
        throw new InternalServerErrorException(
          `Tài khoản của bạn đang bị hủy kích hoạt.`,
        );
      }
      // check password
      if ((await bcrypt.compare(password, user.password)) === false) {
        throw new InternalServerErrorException(
          'ERR-02: Tên đăng nhập hoặc mật khẩu không đúng.',
        );
      } else {
        const userRole = await this.userRoleService.getUserRoleByUserId(
          transactionManager,
          user.id,
        );
        const roles = [];
        userRole.forEach((e) => roles.push(e.roleCode));
        const payload: JwtPayload = {
          email: user.email,
          roles,
        };
        console.log(payload);
        const accessToken = await this.jwtService.sign(payload);
        return {
          statusCode: 201,
          message: 'Đăng nhập thành công.',
          data: { accessToken: accessToken },
        };
      }
    }
  }
}
