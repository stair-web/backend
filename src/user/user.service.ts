import {
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { SignInDto } from './dto/sign-in.dto';
import { UserRoleService } from 'src/user-role/user-role.service';
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
  async createUser(
    transactionEntityManager: EntityManager,
    createUserDto: CreateUserDto,
  ) {
    //Gen password
    // createUserDto.password = uuidv4();
    if (isNullOrUndefined(createUserDto.password)) {
      createUserDto.password = '123123';
    }
    console.log(createUserDto.password);

    const userCreated = await this.usersRepository.createUser(
      transactionEntityManager,
      createUserDto,
    );
    userCreated.staffId = this.genPersonalId(userCreated.id);
    await transactionEntityManager.update(
      User,
      { id: userCreated.id },
      {
        staffId: userCreated.staffId,
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

  async updateUser(
    transactionManager: EntityManager,
    updateUserDto: UpdateUserDto,
    uuid: string,
  ) {
    const {
      email,
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
      throw new InternalServerErrorException('Tài khoản không tồn tại.');
    }

    try {
      await transactionManager.update(
        User,
        { id: user.id },
        {
          email,
          isDeleted,
          // firstName,
          // lastName,
          // phoneNumber,
          // position,
          // profilePhotoKey,
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
  genPersonalId(id) {
    let pId = '';
    if (id > 99999) {
      pId = '' + id;
    } else if (id > 9999) {
      pId = '0' + id;
    } else if (id > 999) {
      pId = '00' + id;
    } else if (id > 99) {
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

  async signIn(transactionManager: EntityManager, signInDto: SignInDto) {
    const { username, password } = signInDto;
    const user = await transactionManager.getRepository(User).findOne({
      where: [
        {
          username,
          isDeleted: false,
          // isForgetPassword: false,
        },
        {
          email: username,
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
        userRole.forEach(e => roles.push(e.roleCode));
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
