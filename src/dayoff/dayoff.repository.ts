import {
  getDate,
  isNullOrUndefined,
  paramStringToJson,
} from 'src/lib/utils/util';
import { GetAllUserDto } from 'src/user/dto/get-all-user.dto';
import {
  Brackets,
  EntityManager,
  EntityRepository,
  Not,
  Repository,
} from 'typeorm';
import { DayOff } from './dayoff.entity';
import { DayOffSearch } from './dto/dayoff-search.dto';
import {
  InternalServerErrorException,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/utils/common.util';
import { DayOffStatus } from 'src/common/enum/dayoff-status';
import { User } from 'src/user/user.entity';
import { UserInformation } from 'src/user-information/user-information.entity';
import { parse } from 'path';

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
      .leftJoin('staff.team', 't')
      .select(['dayoff', 'staff','t.name'])
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
      .leftJoin('staff.team', 't')
      .select(['dayoff', 'staff','t'])
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
    const listDup = [];

    try {
      const { staffId, type, reason, listDateOff } = dayOffSearch;

      //Check Different Year
      if (listDateOff.length > 1) {
        let findWrongYear = listDateOff.filter(
          (ele) =>
            new Date(ele.date).getFullYear() !=
            new Date(listDateOff[0].date).getFullYear(),
        );

        if (findWrongYear.length > 0) {
          throw Error('Cant not create with different year!!!');
        }
      }

      let userInfo = await transactionManager
        .getRepository(UserInformation)
        .findOne({
          where: { userId: staffId },
        });
      let listSave = [];
      const query = transactionManager
        .getRepository(DayOff)
        .createQueryBuilder('dateOff')
        .select([
          'dateOff.uuid',
          'dateOff.dateLeave',
          'dateOff.time',
          'dateOff.type',
          'dateOff.status',
        ])
        .where(`dateOff.dateLeave IN (:...listDate)`, {
          listDate: listDateOff.map((ele) => new Date(ele.date)),
        })
        .andWhere(
          `dateOff.isDeleted is FALSE and dateOff.staff_id = :staffId and dateOff.status != 'CANCEL' `,
          { status: 'CANCEL', staffId: staffId },
        );
        //and dateOff.status  <> :status
      const listQueryDup = await query.getMany();

      listDateOff.forEach(async (ele) => {
        let canCreate = true;

        if (listQueryDup.length > 0) {
          // const dup = listQueryDup.find((eleDup) => {
          //   return ( new Date(eleDup.dateLeave).toDateString() == new Date(ele.date).toDateString() );
          // });
          listQueryDup.forEach((eleQueryDup) => {
            if (
              new Date(eleQueryDup.dateLeave).toDateString() ==
              new Date(ele.date).toDateString()
            ) {
              if (
                eleQueryDup.time == 0 ||
                eleQueryDup.time == ele.time ||
                ele.time == 0
              ) {
                if (
                  listDup.findIndex(
                    (eleList) =>
                      new Date(eleList.dateLeave).toDateString() ==
                      new Date(ele.date).toDateString(),
                  ) == -1
                ) {
                  listDup.push(ele);                  
                  canCreate = false;
                }
              }
            }
          });
        }

        if (canCreate) {
          
          let uuid = uuidv4();
          let dayOff = await transactionManager.create(DayOff, {
            uuid,
            dateLeave: new Date(ele.date),
            staffId: staffId,
            time: ele.time,
            type,
            status: DayOffStatus.PENDING,
            reason,
            createdAt: new Date(),
            updatedAt: new Date(),
            timeNumber: type != 3 ? (ele.time == 0 ? 1 : 0.5) : 0,
            remoteNumber: type == 3 ? (ele.time == 0 ? 1 : 0.5) : 0,
          });
          
          if (type == 1) {
            const isCurrentYear =
              new Date().getFullYear() == new Date(ele.date).getFullYear();
            if (parseInt(ele.time) == 0 ) {
              if (isCurrentYear) {
                userInfo.remain = userInfo.remain - 1;
              } else {
                userInfo.dateOffNextYear = userInfo.dateOffNextYear + 1;
                
              }
            } else if (
              (parseInt(ele.time) == 1 || parseInt(ele.time) == 2)
            ) {
              if (isCurrentYear) {
                userInfo.remain = userInfo.remain - 0.5;
              } else {
                userInfo.dateOffNextYear = userInfo.dateOffNextYear + 0.5;
              }
            }
            
            if(isCurrentYear){
              if (userInfo.remain < 0 && type == 1 ) {

                throw new ConflictException('Remain Date cant be smaller than 0!');
              }
            } else{
              if (userInfo.dateOffNextYear > 12 && type == 1 ) {

                throw new ConflictException('Remain Date cant be smaller than 0!');
              }
            }
          }
          if (userInfo.dateOffNextYear > 12) {
            throw new ConflictException('Remain Date cant be smaller than 0!');
          }
          await transactionManager.save(dayOff);
          listSave.push(dayOff);
        }
      });

      if (listDup.length > 0) {
        throw new ConflictException();
      } else {
        await transactionManager.save(userInfo);
        transactionManager.getRepository(DayOff).save(listSave);
        return {
          statusCode: 201,
          message: 'Create Success!',
        };
      }
    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException({
          data: {
            listDuplicate: listDup,
          },
          message: 'Duplicate Date Leave!',
        });
      }
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
      const updateDate = new Date(listDateOff[0].date)
      const dayOffList = await transactionManager.getRepository(DayOff).find({
        staffId: staffId,
        dateLeave: updateDate,
        isDeleted: false,
      });
      const findDayOff = await transactionManager.getRepository(DayOff).findOne({ uuid });
      if (isNullOrUndefined(findDayOff)) {
        throw new NotFoundException('Request not exist !');
      }
      const userInfo = await transactionManager
        .getRepository(UserInformation)
        .findOne({
          where: { userId: staffId },
        });
      dayOffList.forEach((dayOff) => {
        if (
          dayOff.uuid !== uuid &&
          (listDateOff[0].time == 0 ||
            dayOff.time == listDateOff[0].time ||
            dayOff.time == 0)
        ) {
          throw new ConflictException('Duplicate Date !');
        }
      });
      const currYear = (new Date()).getFullYear();

      if (findDayOff.time == 0 && (listDateOff[0].time == 1 || listDateOff[0].time == 2)) {
        //tăng remain
        if (updateDate.getFullYear() == currYear) {
          userInfo.remain += 0.5
        } else {
          userInfo.remain -= 0.5

        }
      } else if (listDateOff[0].time == 0 && (findDayOff.time != 0)) {
        //Giảm remain
        if (updateDate.getFullYear() == currYear) {
          userInfo.remain -= 0.5
        } else {
          userInfo.remain += 0.5
        }
      }
      if ( (userInfo.remain < 0 || userInfo.dateOffNextYear > 12) && findDayOff.type == 1) {
        throw new InternalServerErrorException(
          'Lỗi hệ thống trong quá tình tạo ngày nghỉ',
        );
      }
      listDateOff.forEach(async (ele) => {
        const dayOff = await transactionManager.update(
          DayOff,
          { uuid },
          {
            staffId: staffId,
            time: listDateOff[0].time,
            type: type,
            reason: reason,
            updatedAt: new Date(),
          },
        );
      });
      await userInfo.save();

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Request not exist !');
      } else if (error instanceof ConflictException) {
        throw new ConflictException('Duplicate Date !');
      }
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
      // // Giảm số ngày phép
      // Giảm số ngày phép

      // if (dayOff.type == 1) {
      //   if (dayOff.time == 0 && userInfo.remain >= 1) {
      //     userInfo.remain = userInfo.remain - 1;
      //   } else if (
      //     (dayOff.time == 1 || dayOff.time == 2) &&
      //     userInfo.remain >= 0.5
      //   ) {
      //     userInfo.remain = userInfo.remain - 0.5;
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
        const isCurrentYear =
          new Date().getFullYear() == new Date(dayOff.dateLeave).getFullYear();
        if (dayOff.time == 0) {
          if (isCurrentYear) {
            userInfo.remain = userInfo.remain + 1;
          } else {
            userInfo.dateOffNextYear = userInfo.dateOffNextYear - 1;
          }
        } else if (
          (dayOff.time == 1 || dayOff.time == 2) &&
          userInfo.remain >= 0.5
        ) {
          if (isCurrentYear) {
            userInfo.remain = userInfo.remain + 0.5;
          } else {
            userInfo.dateOffNextYear = userInfo.dateOffNextYear - 0.5;
          }
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
        const isCurrentYear =
          new Date().getFullYear() == new Date(dayOff.dateLeave).getFullYear();
        if (dayOff.time == 0) {
          if (isCurrentYear) {
            userInfo.remain = userInfo.remain + 1;
          } else {
            userInfo.dateOffNextYear = userInfo.dateOffNextYear - 1;
          }
        } else if (
          (dayOff.time == 1 || dayOff.time == 2) &&
          userInfo.remain >= 0.5
        ) {
          if (isCurrentYear) {
            userInfo.remain = userInfo.remain + 0.5;
          } else {
            userInfo.dateOffNextYear = userInfo.dateOffNextYear - 0.5;
          }
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
          'd.staff_id, ui.last_name, t.name as team, ui.remain, sum(CASE WHEN type = 1 THEN time_number ELSE 0 END) as type_1,sum(CASE WHEN type=2 THEN time_number ELSE 0 END) as type_2',
        )
        .groupBy('d.staff_id, ui.last_name, t.name, ui.remain')
        .andWhere('d.isDeleted = false and d.status = :status', {
          status: 'APPROVED',
        });

      // from.getFullYear() +
      // '-' +
      // (from.getMonth() + 1) +
      // '-' +
      // from.getDate(),
      if (fromDate) {
        let from = new Date(fromDate);
        query.andWhere('d.dateLeave >= :from', {
          from: new Date(from),
        });
      }
      // to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate(),
      if (toDate) {
        let to = new Date(toDate);
        query.andWhere('d.dateLeave <= :to', {
          to: new Date(to),
        });
      }

      const data = await query.execute();

      return data;
    } catch (error) {
      console.log(error);

      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình lấy report',
      );
    }
  }
}
