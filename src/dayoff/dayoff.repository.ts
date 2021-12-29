import {
  getDate,
  isNullOrUndefined,
  paramStringToJson,
} from 'src/lib/utils/util';
import { GetAllUserDto } from 'src/user/dto/get-all-user.dto';
import { EntityManager, EntityRepository, Not, Repository } from 'typeorm';
import { DayOff } from './dayoff.entity';
import { DayOffSearch } from './dto/dayoff-search.dto';
import {
  InternalServerErrorException,
  Logger,
  ConflictException,
} from '@nestjs/common';
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
    user: User,
  ) {
    const { page, dateFrom, dateTo, status, perPage } = dayOffSearch;

    const query = transactionManager
      .getRepository(DayOff)
      .createQueryBuilder('dayoff')
      .leftJoin('dayoff.staff', 'staff')
      .select(['dayoff', 'staff'])
      .where({ isDeleted: false })
      .andWhere({ staffId: user.id })
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
      const { dateLeave, staffId, time, type, reason, listDateOff } =
        dayOffSearch;
      let userInfo = await transactionManager
        .getRepository(UserInformation)
        .findOne({
          where: { userId: staffId },
        });
      let listSave = [];
      const listDup = [];
      // const query = transactionManager
      //   .getRepository(DayOff)
      //   .createQueryBuilder('dateOff')
      //   .select([
      //     'dateOff.uuid',
      //     'dateOff.dateLeave',
      //     'dateOff.time',
      //     'dateOff.type',
      //     'dateOff.status',
  
       
      //   ])
      //   .where('candidate.isDeleted is FALSE')
       
      listDateOff.forEach( async (ele) => {
        // console.log(new Date(ele.date).getU);

        let dayOffTime = getDate(ele.date);

        const dup = await transactionManager.getRepository(DayOff).findOne({
          dateLeave: dayOffTime,
          isDeleted: false,
          staffId: staffId,
          status: Not('CANCEL'),
        });

        if (!isNullOrUndefined(dup)) {
          if (dup.time == 0 || dup.time == ele.time || ele.time == 0) {
            listDup.push(dup);
          }
        } else {
          if (userInfo.remain <= 0) {
            throw new ConflictException('Remain Date cant be smaller than 0!');
          }

          let uuid = uuidv4();
          let dayOff = await transactionManager.create(DayOff, {
            uuid,
            dateLeave: dayOffTime,
            staffId: staffId,
            time: ele.time,
            type,
            status: DayOffStatus.PENDING,
            reason,
            createdAt: new Date(),
            updatedAt: new Date(),
            timeNumber: ele.time == 0 ? 1 : 0.5,
          });

          if (type == 1) {
            if (parseInt(ele.time) == 0 && userInfo.remain >= 1) {
              userInfo.remain = userInfo.remain - 1;
            } else if (
              (parseInt(ele.time) == 1 || parseInt(ele.time) == 2) &&
              userInfo.remain >= 0.5
            ) {
              userInfo.remain = userInfo.remain - 0.5;
            }
          }
          // console.log(dayOff);

          await transactionManager.save(dayOff);
          listSave.push(dayOff);
        }
      });
      console.log(listDup.length > 0);
      console.log(listDup);

      if (listDup.length > 0) {
        return {
          statusCode: 409,
          data: {
            listDuplicate: listDup,
          },
          message: 'Duplicate Date Leave!',
        };
      } else {
        await transactionManager.save(userInfo);
        return {
          statusCode: 201,
          message: 'Create Success!',
        };
      }
    } catch (error) {
      console.log(error);

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
      const { staffId, type, reason, listDateOff } = dayOffSearch;

      listDateOff.forEach(async (ele) => {
        const dayOff = await transactionManager.update(
          DayOff,
          { uuid },
          {
            dateLeave: ele.date,
            staffId: staffId,
            time: ele.time,
            type: type,
            reason: reason,
            updatedAt: new Date(),
          },
        );
      });
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
    let dayOff = await transactionManager
      .getRepository(DayOff)
      .findOne({ uuid, isDeleted: false });
    // if (dayOff.status == 'APPROVED') {
    //   throw new InternalServerErrorException(
    //     'Ngày này đã được approve rồi!',
    //   );
    // }
    try {
      let staffId = dayOff.staffId;
      let userInfo = await transactionManager
        .getRepository(UserInformation)
        .findOne({
          where: { userId: staffId },
        });
      await transactionManager.update(
        DayOff,
        { uuid },
        {
          status: DayOffStatus.APPROVED,
          updatedAt: new Date(),
          approvedById: user.id,
          approvedAt: new Date(),
        },
      );
      // Giảm số ngày phép
      if (dayOff.type == 1) {
        if (dayOff.time == 0 && userInfo.remain >= 1) {
          userInfo.remain = userInfo.remain - 1;
        } else if (
          (dayOff.time == 1 || dayOff.time == 2) &&
          userInfo.remain >= 0.5
        ) {
          userInfo.remain = userInfo.remain - 0.5;
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

  async rejectDayOff(
    transactionManager: EntityManager,
    user: User,
    uuid: string,
  ) {
    try {
      let dayOff = await transactionManager
        .getRepository(DayOff)
        .findOne({ uuid, isDeleted: false });
      // if (dayOff.status == 'REJECT') {
      //   throw new InternalServerErrorException(
      //     'Ngày này đã được cancel rồi!',
      //   );
      // }
      let staffId = dayOff.staffId;
      let userInfo = await transactionManager
        .getRepository(UserInformation)
        .findOne({
          where: { userId: staffId },
        });
      await transactionManager.update(
        DayOff,
        { uuid },
        {
          status: DayOffStatus.CANCEL,
          updatedAt: new Date(),
          approvedById: user.id,
        },
      );
      // Tăng số ngày phép
      if (dayOff.type == 1) {
        if (dayOff.time == 0) {
          userInfo.remain = userInfo.remain + 1;
        } else if (dayOff.time == 1 || dayOff.time == 2) {
          userInfo.remain = userInfo.remain + 0.5;
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

  async deleteDayoff(
    transactionManager: EntityManager,
    user: User,
    uuid: string,
  ) {
    try {
      let dayOff = await transactionManager
        .getRepository(DayOff)
        .findOne({ uuid, isDeleted: false });
      // if (dayOff.status == 'REJECT') {
      //   throw new InternalServerErrorException(
      //     'Ngày này đã được cancel rồi!',
      //   );
      // }
      let staffId = dayOff.staffId;
      let userInfo = await transactionManager
        .getRepository(UserInformation)
        .findOne({
          where: { userId: staffId },
        });
      // Tăng số ngày phép
      if (dayOff.type == 1) {
        if (dayOff.time == 0) {
          userInfo.remain = userInfo.remain + 1;
        } else if (dayOff.time == 1 || dayOff.time == 2) {
          userInfo.remain = userInfo.remain + 0.5;
        }
      }
      await transactionManager.update(
        DayOff,
        { uuid },
        {
          status: DayOffStatus.CANCEL,
          updatedAt: new Date(),
          isDeleted: true,
        },
      );
      // Giảm số ngày phép
      // if (dayOff.type == 1) {
      //   if (dayOff.time == 0 && userInfo.remain >= 1) {
      //     userInfo.remain = userInfo.remain - 1;
      //   } else if((dayOff.time == 1 || dayOff.time == 2) && userInfo.remain >= 0.5) {
      //     userInfo.remain = userInfo.remain - 0.5
      //   }
      // }
      await transactionManager.getRepository(UserInformation).save(userInfo);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình tạo ngày nghỉ',
      );
    }
  }

  async cancelDayOff(
    transactionManager: EntityManager,
    user: User,
    uuid: string,
  ) {
    try {
      let dayOff = await transactionManager
        .getRepository(DayOff)
        .findOne({ uuid, isDeleted: false });
      if (dayOff.status == 'APPROVED') {
        throw new InternalServerErrorException('Ngày này đã được approve rồi!');
      }
      let staffId = dayOff.staffId;
      let userInfo = await transactionManager
        .getRepository(UserInformation)
        .findOne({
          where: { userId: staffId },
        });

      await transactionManager.update(
        DayOff,
        { uuid },
        {
          status: DayOffStatus.CANCEL,
          updatedAt: new Date(),
          approvedById: user.id,
          approvedAt: new Date(),
        },
      );
      // Tăng số ngày phép
      if (dayOff.type == 1) {
        if (dayOff.time == 0) {
          userInfo.remain = userInfo.remain + 1;
        } else if (dayOff.time == 1 || dayOff.time == 2) {
          userInfo.remain = userInfo.remain + 0.5;
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

  async report(
    transactionManager: EntityManager,
    fromDate: Date,
    toDate: Date,
  ) {
    try {
      const query = transactionManager
        .getRepository(DayOff)
        .createQueryBuilder('d')
        .leftJoin('d.staff', 'ui')
        .leftJoin('ui.team', 't')
        .select(
          'd.staff_id, ui.last_name, t.name, ui.remain, sum(CASE WHEN type = 1 THEN time_number ELSE 0 END) as type_1,sum(CASE WHEN type=2 THEN time_number ELSE 0 END) as type_2',
        )
        .groupBy('d.staff_id, ui.last_name, t.name, ui.remain')
        .andWhere('d.isDeleted = false and d.status = :status', {
          status: 'APPROVED',
        });

      if (fromDate) {
        let from = new Date(fromDate);
        query.andWhere('d.dateLeave >= :from', {
          from:
            from.getFullYear() +
            '-' +
            (from.getMonth() + 1) +
            '-' +
            from.getDate(),
        });
        console.log(
          from.getFullYear() +
            '-' +
            (from.getMonth() + 1) +
            '-' +
            from.getDate(),
        );
        // console.log((from).getUTCDate());
      }
      if (toDate) {
        let to = new Date(toDate);
        query.andWhere('d.dateLeave <= :to', {
          to: to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate(),
        });
      }

      const data = await query.execute();

      return data;
    } catch (error) {
      // console.log(error);

      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình lấy report',
      );
    }
  }
}
