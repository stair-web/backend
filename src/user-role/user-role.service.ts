import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleRepository } from './user-role.repository';
import { AddUserRoleDto } from './dto/add-user-role.dto';
import { UserRole } from './user-role.entity';
import { EntityManager, getRepository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
  ) { }

  async addUserRole(
    transactionManager: EntityManager,
    addUserRoleDto: AddUserRoleDto,
  ) {
    const { username, roleCode, uuid, staffId } = addUserRoleDto;
    const userRole = new UserRole();
    const user = await transactionManager.getRepository(User).findOne({
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          userInformation: 'user.userInformation',
        },
      },
      relations: ['userInformation'],
      where: (qb) => {
        qb.select([
          'user.id',
          'user.uuid',
          'user.username',
          'user.email',
          'userInformation.staffId',
        ]).where([
          // { email: username, isDeleted: false, isActive: true },
          // { username, isDeleted: false, isActive: true },
          { email: username, isDeleted: false },
          { username, isDeleted: false },
          { uuid, isDeleted: false },
          { userInformation: { staffId }, isDeleted: false },
        ]);
      },
    });
    if (user) {
      userRole.userId = user.id;
      userRole.roleCode = roleCode;
      userRole.isActive = true;
    } else {
      throw new InternalServerErrorException('Error: User not found!');
    }

    try {
      await userRole.save();
      return { statusCode: 201, message: 'Add user role successfully.' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
      // return { statusCode: 201, message: 'System error when add user role', error };
    }
  }

  async getUserRoleByUserId(transactionManager: EntityManager, userId: number) {

    let data = await transactionManager.getRepository(UserRole).find({
      where: { userId, isActive: true, },
      select: ['roleCode'],
    });
    if (!data) {
      data = [];
    }
    return data;
  }


  async deactiveUserRole(transactionManager: EntityManager, userId: number, roleCode: string) {

    let data = await transactionManager.getRepository(UserRole).find({
      where: { userId, isActive: true, roleCode: roleCode },
    });
    data.forEach(async ele=>{
      ele.isActive = false;
    })
    
    await transactionManager.getRepository(UserRole).save(data);

    return {message:'Deactive success!'};
  }
}
