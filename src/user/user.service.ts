import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,

  ) {}
  async createUser(transactionEntityManager: EntityManager,
    createUserDto: CreateUserDto) {
   await this.usersRepository.createUser(transactionEntityManager,createUserDto);
   return { statusCode: 201, message: 'Tạo người dùng thành công.' };
  }
  async updateUser( transactionManager: EntityManager,
    updateUserDto: UpdateUserDto,
    id: number,) {

      const {
        firstName,
        lastName,
        phoneNumber,
        dob,
        position,
        isDeleted,
        personalEmail
      } = updateUserDto;

      const user = (await this.getUserById(transactionManager, id)).data;
      
      if (isNullOrUndefined(user)) {
        throw new InternalServerErrorException(
          'Tài khoản không tồn tại.',
        );
      }
      console.log('iduser ' + id);

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
            personal_email:personalEmail 
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

    async getUserById(transactionManager: EntityManager, id: number) {
      return await this.usersRepository.getUserById(transactionManager, id);
    }
    async getAllUser(
      transactionManager: EntityManager,
      getAllUserDto: GetAllUserDto,
    ) {
      return this.usersRepository.getAllUser(transactionManager, getAllUserDto);
    }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
