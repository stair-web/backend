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
  ): Promise<unknown> {
    const { email, fullName, phoneNumber, note, sendTime } = updateCustomerDto;

    const customer = await transactionManager.getRepository(Customer).findOne({uuid});

    if (isNullOrUndefined(customer)) {
      throw new InternalServerErrorException('Khách hàng không tồn tại.');
    }

    try {
      await transactionManager.update(
        Customer,
        { uuid: customer.uuid },
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
  async getCustomerByUuid(transactionManager: EntityManager, id: string) {
    return await this.customerRepository.getCustomerByUuid(transactionManager, id);
  }
}
