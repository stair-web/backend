import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { EntityManager } from 'typeorm';
import { CustomerRepository } from './customer.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { GetAllCustomerDto } from './dto/get-all-customer.dto';
import { Customer } from './customer.entity';

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
  async updateCustomer(transactionManager: EntityManager, updateCustomerDto: UpdateCustomerDto, id: number): Promise<unknown> {
    const {
      email,
      fullName,
      phoneNumber,
      note,
      sendTime,
    } = updateCustomerDto;

    const customer = (await this.getCustomerById(transactionManager, id)).data;


    if (isNullOrUndefined(customer)) {
      throw new InternalServerErrorException(
        'Khách hàng không tồn tại.',
      );
    }

    try {

      await transactionManager.update(
        Customer,
        { id: customer.id },
        {
          email: email,
          fullName: fullName,
          phoneNumber: phoneNumber,
          note: note,
          sendTime: sendTime,
          updatedAt: new Date(),
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
  async getCustomerById(transactionManager: EntityManager, id: number) {

      return await this.customerRepository.getUserById(transactionManager, id);
  }
}
