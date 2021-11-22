import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { EntityManager } from 'typeorm';
import { CustomerRepository } from './customer.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { GetAllCustomerDto } from './dto/get-all-customer.dto';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}
  async createCustomer(
    transactionManager: EntityManager,
    createCustomerDto: CreateCustomerDto,
  ){
    await this.customerRepository.createCustomer(
      transactionManager,
      createCustomerDto,
    );

  }
  getAll(
    transactionManager: EntityManager,
    getAllCustomerDto: GetAllCustomerDto,
  ): Promise<unknown> {
    return this.customerRepository.getAll(
      transactionManager,
      getAllCustomerDto,
    );
  }
  async updateCustomer(
    transactionManager: EntityManager,
    updateCustomerDto: UpdateCustomerDto,
    uuid: string,
  )  {
    return await this.customerRepository.updateCustomer(transactionManager,updateCustomerDto, uuid);
  }
  async getCustomerByUuid(transactionManager: EntityManager, uuid: string) {
    return await this.customerRepository.getCustomerByUuid(transactionManager, uuid);
  }
  async deleteCustomer(transactionManager: EntityManager, uuid: string): Promise<unknown> {
    return await this.customerRepository.deleteCustomerByUuid(transactionManager, uuid);
  }
}
