import { UserInformation } from './../user-information/user-information.entity';
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
import { uuidv4 } from 'src/common/utils/common.util';
import { hashPwd } from 'src/common/utils/hash.util';
import { CheckExistsUserDto } from './dto/check-exists-user.dto';
import { UpdateProfileUserDto } from './dto/update-profile-user.dto';
import { Team } from 'src/team/team.entity';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,
    private configService: ConfigService,
    // private tokenEmailRepository: TokenEmailRepository,
    // private emailService: EmailService,
    private jwtService: JwtService,
    private userRoleService: UserRoleService,
  ) {}

  /**
   *
   * @param transactionManager
   * @param createUserDto
   * @returns
   */
  async createUser(
    transactionManager: EntityManager,
    createUserDto: CreateUserDto,
  ) {
    /* check user if exists */
    const { username, email , teamId} = createUserDto;
    const user = await transactionManager.getRepository(User).findOne({
      where: [
        { username, isDeleted: false },
        { email, isDeleted: false },
      ],
    });

    const team = await transactionManager.getRepository(Team).findOne({id:teamId});

    if (isNullOrUndefined(team)) {
      throw new ConflictException(`Team này không tồn tại trong hệ thống.`);
    }

    if (user) {
      throw new ConflictException(`Username này đã tồn tại trong hệ thống.`);
    }

    

    createUserDto.userInformation.uuid = uuidv4();
    if (isNullOrUndefined(createUserDto.password)) {
      createUserDto.password = '123123';
    }
    console.log(createUserDto.password);

    const userCreated = await this.usersRepository.createUser(
      transactionManager,
      createUserDto,
    );
    userCreated.userInformation.team = team;
    await userCreated.userInformation.team.save();
    await transactionManager.update(
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
    //   transactionManager,
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
    updateUserDto: UpdateProfileUserDto,
    uuid: string,
  ) {
    const { userInformation } = updateUserDto;

    const user: User = await this.usersRepository.getUserByUuid(
      transactionManager,
      uuid,
    );
    

    if (isNullOrUndefined(user)) {
      throw new InternalServerErrorException('Tài khoản không tồn tại.');
    }

    if(userInformation.teamId){
      const team = await transactionManager.getRepository(Team).findOne({id:userInformation.teamId});

      if (isNullOrUndefined(team)) {
        throw new ConflictException(`Team này không tồn tại trong hệ thống.`);
      }
    }
    

    try {
      if (userInformation) {
        Object.keys(userInformation).map(
          (key) => (user.userInformation[key] = userInformation[key]),
        );
      }
      await transactionManager.save(user.userInformation);
       console.log(user);
       
    } catch (error) {
      console.log(error);

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
    if (!user) {
      throw new ConflictException('Không tìm thấy user này trong hệ thống!');
    }
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
      await this.usersRepository.activation(uuid, transactionManager);
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
      await this.usersRepository.activation(uuid, transactionManager, false);
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

  /**
   * @description sign-in user
   * @param transactionManager
   * @param signInDto
   * @returns
   */
  async signIn(transactionManager: EntityManager, signInDto: SignInDto) {
    const { input, password } = signInDto;
    let user = await transactionManager.getRepository(User).findOne({
      where: [
        {
          username: input,
          isDeleted: false,
          // isForgetPassword: false,
        },
      ],
    });
    if (!user) {
      user = await transactionManager.getRepository(User).findOne({
        where: [
          {
            email: input,
            isDeleted: false,
            // isForgetPassword: false,
          },
        ],
      });
    }
    // check user exists?

    if (!user) {
      throw new InternalServerErrorException(
        'ERR-01: Thông tin đăng nhập không đúng.',
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
          'ERR-02: Thông tin đăng nhập không đúng.',
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
          uuid: user.uuid,
        };
        const accessToken = await this.jwtService.sign(payload);
        return {
          statusCode: 201,
          message: 'Đăng nhập thành công.',
          data: { accessToken: accessToken },
        };
      }
    }
  }

  /**
   *
   * @param transactionManager
   * @param checkExistsUserDto
   * @returns
   */
  async checkUserExists(
    transactionManager: EntityManager,
    checkExistsUserDto: CheckExistsUserDto,
  ) {
    const { username, email } = checkExistsUserDto;
    const user = await transactionManager.getRepository(User).findOne({
      where: [
        { username, isDeleted: false },
        { email, isDeleted: false },
      ],
    });
    console.log(user);
    console.log(checkExistsUserDto);
    if (user) {
      return {
        statusCode: 202,
        message: `Username này đã tồn tại trong hệ thống.`,
      };
    }
    // else {
    return {
      statusCode: 201,
      message: `Username này chưa tồn tại trong hệ thống.`,
    };
    // }
  }
}
