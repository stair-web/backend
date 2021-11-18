/* eslint-disable prettier/prettier */
import { ConflictException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { uuidv4 } from 'src/common/util/common.util';
import { isNullOrUndefined, paramStringToJson } from 'src/lib/utils/util';
import {
  Repository,
  EntityRepository,
  getRepository,
  EntityManager,
  getConnection,
} from 'typeorm';
import { Customer } from './customer.entity';
import { GetAllCustomerDto } from './dto/get-all-customer.dto';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
 
 async getAll(transactionManager: EntityManager, getAllCustomerDto: GetAllCustomerDto): Promise<unknown> {
  const {fullTextSearch } = getAllCustomerDto;
  let { perPage } = getAllCustomerDto;
  if (isNullOrUndefined(perPage)) {
    perPage = 10;
  }

  let { page } = getAllCustomerDto;
  if (isNullOrUndefined(page)) {
    page = 1;
  }
  
  const query = transactionManager
    .getRepository(Customer)
    .createQueryBuilder('customer')
    .select([
      'customer.id',
      'customer.email',
      'customer.uuid',
      'customer.fullName',
      'customer.note',
      'customer.phoneNumber',
      'customer.sendTime',
    ]).where('customer.isDeleted is false')
    .take(perPage)
    .skip((page - 1) * perPage)
    .orderBy('customer.fullName', 'ASC');

  // Full text search
  if (!isNullOrUndefined(fullTextSearch) && fullTextSearch !== '') {
    query.andWhere(
      'LOWER(customer.email) LIKE LOWER(:email)',
      {
        email: `%${fullTextSearch}%`,
      },
    );
    query.orWhere(
      'LOWER(customer.fullName) LIKE LOWER(:fullName)',
      {
        full_name: `%${fullTextSearch}%`,
      },
    );
    query.orWhere(
      'LOWER(customer.note) LIKE LOWER(:note) ',
      {
        note: `%${fullTextSearch}%`,
      },
    );
    query.orWhere(
      'LOWER(customer.phoneNumber) LIKE LOWER(:phoneNumber) ',
      {
        phone_number: `%${fullTextSearch}%`,
      },
    );
    query.orWhere(
      'LOWER(customer.sendTime) LIKE LOWER(:sendTime) ',
      {
        send_time: `%${fullTextSearch}%`,
      },
    );
  }

  // Filter list
 
    if (!isNullOrUndefined(getAllCustomerDto.filterEmail)) {
      query.andWhere('LOWER(customer.email) LIKE LOWER(:email)', {
        email: `%${getAllCustomerDto.filterEmail}%`,
      });
    }

    if (!isNullOrUndefined(getAllCustomerDto.filterFullName)) {
      query.andWhere('LOWER(customer.fullName) LIKE LOWER(:fullName)', {
        fullName: `%${getAllCustomerDto.filterFullName}%`,
      });
    }

    if (!isNullOrUndefined(getAllCustomerDto.filterNote)) {
      query.andWhere('LOWER(customer.note) LIKE LOWER(:note)', {
        note: `%${getAllCustomerDto.filterNote}%`,
      });
    }
    if (!isNullOrUndefined(getAllCustomerDto.filterPhoneNumber)) {
      query.andWhere('LOWER(customer.phoneNumber) LIKE LOWER(:phoneNumber)', {
        phoneNumber: `%${getAllCustomerDto.filterPhoneNumber}%`,
      });
    }
    if (!isNullOrUndefined(getAllCustomerDto.filterSendTime)) {
      query.andWhere('LOWER(customer.sendTime) LIKE LOWER(:sendTime)', {
        sendTime: `%${getAllCustomerDto.filterSendTime}%`,
      });
    }
  

  // Sort list
    if (!isNullOrUndefined(getAllCustomerDto.sortEmail)) {
      query.orderBy('customer.email', getAllCustomerDto.sortEmail);
    }
    if (!isNullOrUndefined(getAllCustomerDto.sortFullName)) {
      query.orderBy('customer.fullName', getAllCustomerDto.sortFullName);
    }
    if (!isNullOrUndefined(getAllCustomerDto.sortNote)) {
      query.orderBy('customer.note', getAllCustomerDto.sortNote);
    }
    if (!isNullOrUndefined(getAllCustomerDto.sortPhoneNumber)) {
      query.orderBy('customer.phoneNumber', getAllCustomerDto.sortPhoneNumber);
    }
    if (!isNullOrUndefined(getAllCustomerDto.sortSendTime)) {
      query.orderBy('customer.sendTime', getAllCustomerDto.sortSendTime);
    }
  


  try {
    const data = await query.getMany();
    
  const total = await query.getCount();
  return { statusCode: 200, data: { data, total } };

  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException(`Lỗi trong quá trình lấy danh sách khách hàng.`);

  }
  
 }
 async getCustomerByUuid(transactionManager: EntityManager, uuid: string) {

  const query = transactionManager
    .getRepository(Customer)
    .createQueryBuilder('customer')
    .select([
      'customer.id',
      'customer.uuid',
      'customer.email',
      'customer.fullName',
      'customer.note',
      'customer.phoneNumber',
      'customer.sendTime',
    
    ])
    .andWhere('customer.uuid = :uuid', { uuid })
    .andWhere('customer.isDeleted = FALSE');

  const data = await query.getOne();

  if (isNullOrUndefined(data)) {
    throw new NotFoundException(`Không tìm thấy khách hàng.`);
  }

  return { statusCode: 200, data };
}
 async   createCustomer(transactionEntityManager: any, createCustomerDto: any) {
  const { 
    email,
    fullName,
    note,
    phoneNumber,
    sendTime,
  } = createCustomerDto



  const customer = transactionEntityManager.create(Customer, {
    uuid:uuidv4(),
    fullName: fullName,
    email: email,
    note: note,
    phoneNumber: phoneNumber,
    sendTime: sendTime,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted :false
  });

 

  try {
    await transactionEntityManager.save(customer);
    return { statusCode: 201, message: 'Tạo khách hàng thành công.' };

  } catch (error) {
    Logger.error(error);
    throw new InternalServerErrorException(
      'Lỗi hệ thống trong quá trình tạo khách hàng, vui lòng thử lại sau.',
    );
  }

  return customer;
    }
}
