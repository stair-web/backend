import { isNullOrUndefined } from 'src/lib/utils/util';
import { GetAllUserDto } from 'src/user/dto/get-all-user.dto';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { DayOff } from './dayoff.entity';
import { DayOffSearch } from './dto/dayoff-search.dto';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { uuidv4 } from 'src/common/utils/common.util';
import { DayOffStatus } from 'src/common/enum/dayoff-status';
import { User } from 'src/user/user.entity';
import { UserInformation } from 'src/user-information/user-information.entity';

@EntityRepository(DayOff)
export class DayoffRepository extends Repository<DayOff> {

  async getAllDayOffAdmin(
    transactionManager: EntityManager,
    dayOffSearch: DayOffSearch,
  ) {
    const { page, dateFrom, dateTo, status, perPage } = dayOffSearch;

    const query = transactionManager
      .getRepository(DayOff)
      .createQueryBuilder('dayoff')
      .leftJoin('dayoff.staff', 'staff')
      .select(['dayoff', 'staff'])
      .where('dayoff.isDeleted = :isDeleted', { isDeleted: 'false' })
      .take(perPage || 25)
      .skip((page - 1) * perPage || 0)
      .orderBy('dayoff.createdAt', 'DESC');

    // Full text search
    if (!isNullOrUndefined(status) && status !== '') {
      query.andWhere('LOWER(dayoff.status) LIKE LOWER(:status)', {
        status: status,
      });
    }

    if (!isNullOrUndefined(dateFrom) && !isNullOrUndefined(dateTo)) {
      query.andWhere('dayoff.dateLeave between :dateFrom and :dateTo', {
        dateFrom: dateFrom,
        dateTo: dateTo,
      });
    }

    try {
      const data = await query.getMany();
      const total = await query.getCount();
      return { statusCode: 201, data: { dayOffList: data, total } };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllDayOffStaff(
    transactionManager: EntityManager,
    dayOffSearch: DayOffSearch,
    user: User
  ) {
    const { page, dateFrom, dateTo, status, perPage } = dayOffSearch;

    const query = transactionManager
      .getRepository(DayOff)
      .createQueryBuilder('dayoff')
      .leftJoin('dayoff.staff', 'staff')
      .select(['dayoff', 'staff'])
      .where({ isDeleted: false })
      .take(perPage || 25)
      .skip((page - 1) * perPage || 0)
      .orderBy('dayoff.createdAt', 'DESC');

    // Full text search
    if (!isNullOrUndefined(status) && status !== '') {
      query.andWhere('LOWER(dayoff.status) LIKE LOWER(:status)', {
        status: status,
      });
    }

    if (!isNullOrUndefined(dateFrom) && !isNullOrUndefined(dateTo)) {
      query.andWhere('dayoff.dateLeave between :dateFrom and :dateTo', {
        dateFrom: dateFrom,
        dateTo: dateTo,
      });
    }

    try {
      const data = await query.getMany();
      const total = await query.getCount();
      return { statusCode: 201, data: { dayOffList: data, total } };
    } catch (error) {
      console.log(error);
    }
  }

  async createDayOff(
    transactionManager: EntityManager,
    dayOffSearch: DayOffSearch,
  ) {
    try {
    let uuid = uuidv4();
    const { dateLeave, staffId, time,  type, reason } = dayOffSearch;

    const dayOff = await transactionManager.create(DayOff, {
      uuid,
      dateLeave,
      staffId,
      time,
      type,
      status: DayOffStatus.PENDING,
      reason,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await transactionManager.save(dayOff);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình tạo ngày nghỉ',
      );
    }
  }

  async updateDayOff(
    transactionManager: EntityManager,
    dayOffSearch: DayOffSearch,
    uuid: string,
  ) {
    try {
    const { dateLeave, staffId, time,  type, reason } = dayOffSearch;

    const dayOff = await transactionManager.update(DayOff, 
      { uuid },
      {
        dateLeave: dateLeave,
        staffId: staffId,
        time: time,
        type: type,
        reason: reason,
        updatedAt: new Date()
      })
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình tạo ngày nghỉ',
      );
    }
  }

  async approveDayOff(
    transactionManager: EntityManager,
    user: User,
    uuid: string,
  ) {
    try {
    let dayOff = await transactionManager.getRepository(DayOff).findOne({ uuid, isDeleted: false });
    if (dayOff.status == 'APPROVED') {
      throw new InternalServerErrorException(
        'Ngày này đã được approve rồi!',
      );
    }
    let staffId = dayOff.staffId;
    let userInfo = await transactionManager
    .getRepository(UserInformation).findOne({
      where: { userId : staffId },
    });    
    
    await transactionManager.update(DayOff, 
      { uuid },
      {
        status: DayOffStatus.APPROVED,
        updatedAt: new Date(),
        approvedById: user.id,
        approvedAt: new Date(),
      })
    // Giảm số ngày phép
    if (dayOff.type == 1) {
      if (dayOff.time == 0 && userInfo.remain >= 1) {
        userInfo.remain = userInfo.remain - 1;
      } else if((dayOff.time == 1 || dayOff.time == 2) && userInfo.remain >= 0.5) {
        userInfo.remain = userInfo.remain - 0.5
      }
    }
    await transactionManager.getRepository(UserInformation).save(userInfo);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình tạo ngày nghỉ',
      );
    }
  }
}
