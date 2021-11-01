import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AddRoleDto } from './dto/add-role.dto';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
    constructor() { }

    async saveRole(transactionManager: EntityManager, addRoleDto: AddRoleDto, isCreate = false) {
        const { roleCode, roleName, roleDescription } = addRoleDto
        
        const checkRoleExist = await transactionManager.getRepository(Role).find({
            roleCode
        });
        
        if (checkRoleExist.length > 0 && isCreate) {
            throw new ConflictException(
                `Role Code đã tồn tại trong hệ thông. Vui lòng chọn tên mới!`,
              );
        }

        if (checkRoleExist.length < 1 && isCreate === false) {
            throw new ConflictException(
                `Role Code chưa tồn tại trong hệ thông. Vui lòng tạo mới!`,
              );
        }

        const role = transactionManager.create(Role, {
            roleCode, roleName, roleDescription
        })
        try {
            await transactionManager.save(role);
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException(
                'Lỗi hệ thống trong quá trình update quyền hạn, vui lòng thử lại sau.',
              );
        }
        return ({ statusCode: 200, message: `${isCreate? 'Create':'Update'} role successfully.` })
    }

    async getAllRole(transactionManager: EntityManager) {
        try {
            return await transactionManager.getRepository(Role).find();
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException(
                'Lỗi hệ thống, vui lòng thử lại sau.',
              );
        }
    }
}
