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
  ) {}

  async addUserRole(
    transactionManager: EntityManager,
    addUserRoleDto: AddUserRoleDto,
  ) {
    const { username, roleCode } = addUserRoleDto;
    const userRole = new UserRole();
    const user = await transactionManager.getRepository(User).findOne({
      where: [
        // { email: username, isDeleted: false, isActive: true },
        // { username, isDeleted: false, isActive: true },
        { email: username, isDeleted: false },
        { username, isDeleted: false },
      ],
      select: ['id', 'username', 'email'],
    });
    console.log(user);
    if (user) {
      userRole.userId = user.id;
      userRole.roleCode = roleCode;
      userRole.isActive = true;
    } else {
      throw new InternalServerErrorException('Error: User not found!');
    }

    try {
      await userRole.save();
      return { statusCode: 200, message: 'Add user role successfully.' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
      // return { statusCode: 201, message: 'System error when add user role', error };
    }
  }

  async getUserRoleByUserId(transactionManager: EntityManager, userId: number) {
    return await transactionManager.getRepository(UserRole).find({
      where: { userId, isActive: true },
      select: ['roleCode'],
    });
  }
}
