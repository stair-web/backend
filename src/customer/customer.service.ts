import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { EntityManager } from 'typeorm';
import { CustomerRepository } from './customer.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/create-customer.dto copy';
import { GetAllCustomerDto } from './dto/get-all-customer.dto';

@Injectable()
export class CustomerService {
  
   
    constructor(
        private customerRepository:CustomerRepository
    ){

    }
    async createCustomer(transactionManager: EntityManager, createCustomerDto: CreateCustomerDto): Promise<unknown> {
        let createCustomer = await this.customerRepository.createCustomer(transactionManager, createCustomerDto);
      
        return { statusCode: 201, message: 'Tạo khách hàng thành công.' };
  }
  getAllUser(transactionManager: EntityManager, getAllCustomerDto: GetAllCustomerDto): Promise<unknown> {
    
    return this.customerRepository.getAllUser(transactionManager, getAllCustomerDto);

  }
  async updateCustomer(transactionManager: EntityManager, updateCustomerDto: UpdateCustomerDto, uuid: string): Promise<unknown> {
    const {
      firstName,
      lastName,
      phoneNumber,
      dob,
      position,
      isDeleted,
      personalEmail,
      profilePhotoKey,
    } = updateCustomerDto;

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
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          dob,
          position,
          is_deleted: isDeleted,
          personal_email: personalEmail,
          profile_photo_key: profilePhotoKey,
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
}
