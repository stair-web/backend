/* eslint-disable prettier/prettier */
import {
  Logger,
  InternalServerErrorException,
  ConflictException,
  NotFoundException
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
import { isNullOrUndefined,paramStringToJson } from '../lib/utils/util';
import { GetAllUserDto } from './dto/get-all-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User>{
  async createUser(
    transactionEntityManager: EntityManager,
    createUserDto: CreateUserDto,
  ) {
    const { email, password,
      firstName,
      lastName,
      phoneNumber,
      dob,
      position,
      personalEmail
    } = createUserDto
    // Check user existed?
    const query = transactionEntityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .where('(user.email = :email)', {
        email,
      }).andWhere('user.is_deleted = FALSE');


    const existsUser = await query.getOne();

    if (existsUser) {
      throw new ConflictException(
        `Người dùng đã tồn tại trong hệ thống, vui lòng sử dụng email khác để đăng kí.`,
      );
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(uuidv4(), salt);

    // create user
    const user = transactionEntityManager.create(User, {
      personal_email: personalEmail,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      password: hashedPassword,
      salt: '21345',
      created_at: new Date(),
      updated_at: new Date(),
      dob: dob,
      position: position,
    
    });

    // save user
    try {
      await transactionEntityManager.save(user);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tạo người dùng, vui lòng thử lại sau.',
      );
    }

    return user;
  }
  async getUserById(transactionManager: EntityManager, id: number) {
    const query = transactionManager
      .getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.personal_email',
        'user.first_name',
        'user.last_name',
        'user.phone_number',
        'user.dob',
        'user.position',
        'user.is_deleted',
      
      ])
      .andWhere('user.id = :id', { id })
      .andWhere('user.is_deleted = FALSE');

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
    const { page, filter, sorts, fullTextSearch } = getAllUserDto;
    let { perPage } = getAllUserDto;
    if (isNullOrUndefined(perPage)) {
      perPage = 25;
    }
    
    const query = transactionManager
      .getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.personal_email',
        'user.first_name',
        'user.last_name',
        'user.phone_number',
        'user.dob',
        'user.position',
        'user.email',
        'user.is_deleted',
      ])
      .take(perPage)
      .skip((page - 1) * perPage)
      .orderBy('user.first_name', 'ASC');

    // Full text search
    if (!isNullOrUndefined(fullTextSearch) && fullTextSearch !== '') {
      query.andWhere(
        'LOWER(user.name) LIKE LOWER(:name)',
        {
          name: `%${fullTextSearch}%`,
        },
      );
      query.orWhere(
        'LOWER(user.username) LIKE LOWER(:username)',
        {
          username: `%${fullTextSearch}%`,
        },
      );
      query.orWhere(
        'LOWER(user.email) LIKE LOWER(:email) ',
        {
          email: `%${fullTextSearch}%`,
        },
      );
    }

    // Filter list
    if (!isNullOrUndefined(filter)) {
      const object = paramStringToJson(filter);
      if (!isNullOrUndefined(object.name)) {
        query.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
          name: `%${object.name}%`,
        });
      }

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
    return { statusCode: 200, data: { data, total } };

    } catch (error) {
      console.log(error);
      
    }
    

  }
}