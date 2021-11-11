/* eslint-disable prettier/prettier */
import {
  Logger,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  Repository,
  EntityRepository,
  getRepository,
  EntityManager,
  getConnection,
} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { isNullOrUndefined, paramStringToJson } from '../lib/utils/util';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UserInformation } from 'src/user-information/user-information.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    transactionEntityManager: EntityManager,
    createUserDto: CreateUserDto,
  ) {
    const {
      email,
      username,
      password,
      userInformation
    } = createUserDto;
    // Check user existed?
    const query = transactionEntityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .where('(user.email = :email)', {
        email,
      })
      .andWhere('user.isDeleted = FALSE');
    const existsUser = await query.getOne();
    if (existsUser) {
      throw new ConflictException(
        `Người dùng đã tồn tại trong hệ thống, vui lòng sử dụng email khác để đăng kí.`,
      );
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = transactionEntityManager.create(User, {
      email,
      username,
      password: hashedPassword,
      salt,
      uuid: uuidv4()
    });
    // save user
    try {
      let userResult = await transactionEntityManager.save(user);
      userInformation.userId = userResult.id;
      userInformation.staffId = userInformation.uuid.substr(userInformation.uuid.length - 6).toUpperCase();
      const informationOfUser = transactionEntityManager.create(UserInformation, userInformation);
      await transactionEntityManager.save(informationOfUser);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tạo người dùng, vui lòng thử lại sau.',
      );
    }

    return user;
  }
  async deleteUser(
    transactionManager: EntityManager,
    deleteUserDto: DeleteUserDto,
    uuid: string,
  ) {
    const { cannotDelete } = deleteUserDto;

    const user = await transactionManager
      .getRepository(User)
      .findOne({ uuid: uuid });
    if (!user) {
      throw new InternalServerErrorException(`Không tìm thấy người dùng.`);
    }
    if (cannotDelete === true) {
      throw new InternalServerErrorException(
        `Không thể xóa người dùng này. Người dùng này đã bị ràng buộc với hoạt động trong ứng dụng. Thay vào đó, hãy hủy kích hoạt người dùng?`,
      );
    }
    try {
      await transactionManager.update(User, { uuid }, { isDeleted: true });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi trong quá trình xóa người dùng, vui lòng thử lại sau.`,
      );
    }
    return { statusCode: 200, message: `Xóa người dùng thành công.` };
  }
  async getUserByUuid(transactionManager: EntityManager, uuid: string) {
    const query = transactionManager
      .getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.uuid',
        'user.email',
        'user.userName',
        'user.isDeleted',
      ])
      .andWhere('user.uuid = :uuid', { uuid });

    const data = await query.getOne();

   

    return { data };
  }
  async getUserById(transactionManager: EntityManager, id: number) {
    const query = transactionManager
      .getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.userName',
        'user.isDeleted',
      ])
      .andWhere('user.id = :id', { id })
      .andWhere('user.isDeleted = FALSE');

    const data = await query.getOne();

    if (isNullOrUndefined(data)) {
      throw new NotFoundException(`Không tìm thấy người dùng.`);
    }

    return { statusCode: 200, data };
  }
  async getAllUser(
    transactionManager: EntityManager,
    getAllUserDto: GetAllUserDto,
  ) {
    const { page, filter, sorts, fullTextSearch, perPage } = getAllUserDto;

    const query = transactionManager
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoin('user.userInformation','userInformation')
      .select([
        'user.id',
        'user.uuid',
        'user.email',
        'user.username',
        'user.isDeleted',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
        'userInformation'
      ])
      .take(perPage || 25)
      .skip((page - 1) * perPage || 0)
      .orderBy('user.createdAt', 'DESC');

    // Full text search
    if (!isNullOrUndefined(fullTextSearch) && fullTextSearch !== '') {
      // query.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
      //   name: `%${fullTextSearch}%`,
      // });
      query.orWhere('LOWER(user.username) LIKE LOWER(:username)', {
        username: `%${fullTextSearch}%`,
      });
      query.orWhere('LOWER(user.email) LIKE LOWER(:email) ', {
        email: `%${fullTextSearch}%`,
      });
    }

    // Filter list
    if (!isNullOrUndefined(filter)) {
      const object = paramStringToJson(filter);
      // if (!isNullOrUndefined(object.name)) {
      //   query.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
      //     name: `%${object.name}%`,
      //   });
      // }

      if (!isNullOrUndefined(object.username)) {
        query.andWhere('LOWER(user.username) LIKE LOWER(:username)', {
          username: `%${object.username}%`,
        });
      }

      if (!isNullOrUndefined(object.email)) {
        query.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
          email: `%${object.email}%`,
        });
      }
    }

    // Sort list
    if (!isNullOrUndefined(sorts)) {
      const object = paramStringToJson(sorts);

      if (!isNullOrUndefined(object.email)) {
        query.orderBy('user.email', object.email);
      }
    }
    try {
      const data = await query.getMany();
      const total = await query.getCount();
      return { statusCode: 201, data: { userList: data, total } };
    } catch (error) {
      console.log(error);
    }
  }
}
