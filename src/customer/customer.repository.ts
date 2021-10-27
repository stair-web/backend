/* eslint-disable prettier/prettier */
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { paramStringToJson } from 'src/lib/utils/util';
import {
  Repository,
  EntityRepository,
  getRepository,
  EntityManager,
  getConnection,
} from 'typeorm';
import { isNullOrUndefined } from 'util';
import { Customer } from './customer.entity';
import { GetAllCustomerDto } from './dto/get-all-customer.dto';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
 async getAllUser(transactionManager: EntityManager, getAllCustomerDto: GetAllCustomerDto): Promise<unknown> {
  const { page, filter, sorts, fullTextSearch } = getAllCustomerDto;
  let { perPage } = getAllCustomerDto;
  if (isNullOrUndefined(perPage)) {
    perPage = 25;
  }
  console.log(12323);
  console.log(perPage,page);
  
  
  const query = transactionManager
    .getRepository(Customer)
    .createQueryBuilder('customer')
    .select([
      'customer.id',
      'customer.email',
      'customer.full_name',
      'customer.note',
      'customer.phone_number',
      'customer.send_time',
    ]).where('customer.is_deleted is false')
    .take(perPage)
    .skip((page - 1) * perPage)
    .orderBy('customer.full_name', 'ASC');

  // Full text search
  if (!isNullOrUndefined(fullTextSearch) && fullTextSearch !== '') {
    query.andWhere(
      'LOWER(customer.email) LIKE LOWER(:email)',
      {
        email: `%${fullTextSearch}%`,
      },
    );
    query.orWhere(
      'LOWER(customer.full_name) LIKE LOWER(:full_name)',
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
      'LOWER(customer.phone_number) LIKE LOWER(:phone_number) ',
      {
        phone_number: `%${fullTextSearch}%`,
      },
    );
    query.orWhere(
      'LOWER(customer.send_time) LIKE LOWER(:send_time) ',
      {
        send_time: `%${fullTextSearch}%`,
      },
    );
  }

  // Filter list
  if (!isNullOrUndefined(filter)) {
    const object = paramStringToJson(filter);
    if (!isNullOrUndefined(object.email)) {
      query.andWhere('LOWER(customer.email) LIKE LOWER(:email)', {
        email: `%${object.email}%`,
      });
    }

    if (!isNullOrUndefined(object.full_name)) {
      query.andWhere('LOWER(customer.full_name) LIKE LOWER(:full_name)', {
        full_name: `%${object.full_name}%`,
      });
    }

    if (!isNullOrUndefined(object.note)) {
      query.andWhere('LOWER(customer.note) LIKE LOWER(:note)', {
        note: `%${object.note}%`,
      });
    }
    if (!isNullOrUndefined(object.phone_number)) {
      query.andWhere('LOWER(customer.phone_number) LIKE LOWER(:phone_number)', {
        note: `%${object.phone_number}%`,
      });
    }
    if (!isNullOrUndefined(object.send_time)) {
      query.andWhere('LOWER(customer.send_time) LIKE LOWER(:send_time)', {
        note: `%${object.send_time}%`,
      });
    }
  }

  // Sort list
  if (!isNullOrUndefined(sorts)) {
    const object = paramStringToJson(sorts);


    if (!isNullOrUndefined(object.email)) {
      query.orderBy('customer.email', object.email);
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
 async   createCustomer(transactionEntityManager: any, createCustomerDto: any) {
  const { 
    email,
    fullName,
    note,
    phoneNumber,
    sendTime,
    
  } = createCustomerDto

  // const query = transactionEntityManager
  //   .getRepository(Customer)
  //   .createQueryBuilder('Customer')
  //   .where('(user.email = :email)', {
  //     email,
  //   }).andWhere('user.is_deleted = FALSE');
  //   const existsUser = await query.getOne();
  //   if (existsUser) {
  //     throw new ConflictException(
  //       `Người dùng đã tồn tại trong hệ thống, vui lòng sử dụng email khác để đăng kí.`,
  //     );
  //   }


  const customer = transactionEntityManager.create(Customer, {
    fullName: fullName,
    email: email,
    note: note,
    phoneNumber: phoneNumber,
    sendTime: sendTime,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted :false
  });

 

  // const customer = transactionEntityManager.create(Customer, {
  //   full_name: fullName,
  //   email: email,
  //   note: note,
  //   phone_number: phoneNumber,
  //   send_time: sendTime,
  //   created_at: new Date(),
  //   updated_at: new Date(),
  //   is_deleted :false
  // });


  try {
    await transactionEntityManager.save(customer);
  } catch (error) {
    Logger.error(error);
    throw new InternalServerErrorException(
      'Lỗi hệ thống trong quá trình tạo khách hàng, vui lòng thử lại sau.',
    );
  }

  return customer;
    }
}
