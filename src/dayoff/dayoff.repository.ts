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
    const { dateLeave, staffId, time,  type, reason ,listDateOff } = dayOffSearch;
    let userInfo = await transactionManager.getRepository(UserInformation).findOne({
      where: { userId : staffId },
    });
    let listSave = [];

   
    listDateOff.forEach(async (ele) => {
      //find duplicate
      let uuid = uuidv4();

      let dayOff = await transactionManager.create(DayOff, {
        uuid,
        dateLeave: ele.date,
        staffId:staffId,
        time: ele.time,
        type,
        status: DayOffStatus.PENDING,
        reason,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(ele);
      console.log(parseInt(ele.type) == 1);
      
      if (type == 1) {
        if (parseInt(ele.time)  ==  0 && userInfo.remain >= 1) {
          userInfo.remain = userInfo.remain - 1;
        } else if(( parseInt(ele.time )  == 1 ||  parseInt(ele.time )  == 2) && userInfo.remain >= 0.5) {
          userInfo.remain = userInfo.remain - 0.5
        }
      }
    await transactionManager.save(dayOff);
    console.log(userInfo);
      listSave.push(dayOff);
    });
   
    // trừ luôn vào tổng số ngày phép
    await transactionManager.save(userInfo);

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
    const { staffId,  type, reason ,listDateOff} = dayOffSearch;

    listDateOff.forEach(async (ele) => {
      const dayOff = await transactionManager.update(DayOff, 
        { uuid },
        {
          dateLeave:  ele.date,
          staffId: staffId,
          time: ele.time,
          type: type,
          reason: reason,
          updatedAt: new Date()
        })

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
    
    let dayOff = await transactionManager.getRepository(DayOff).findOne({ uuid, isDeleted: false });
    // if (dayOff.status == 'APPROVED') {
    //   throw new InternalServerErrorException(
    //     'Ngày này đã được approve rồi!',
    //   );
    // }
    try {
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

  async rejectDayOff(
    transactionManager: EntityManager,
    user: User,
    uuid: string,
  ) {
    try {
    let dayOff = await transactionManager.getRepository(DayOff).findOne({ uuid, isDeleted: false });
    // if (dayOff.status == 'REJECT') {
    //   throw new InternalServerErrorException(
    //     'Ngày này đã được cancel rồi!',
    //   );
    // }
    let staffId = dayOff.staffId;
    let userInfo = await transactionManager
    .getRepository(UserInformation).findOne({
      where: { userId : staffId },
    });    
    await transactionManager.update(DayOff, 
      { uuid },
      {
        status: DayOffStatus.CANCEL,
        updatedAt: new Date(),
        approvedById: user.id,
      })
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


  async deleteDayoff(
    transactionManager: EntityManager,
    user: User,
    uuid: string,
  ) {
    try {
    let dayOff = await transactionManager.getRepository(DayOff).findOne({ uuid, isDeleted: false });
    // if (dayOff.status == 'REJECT') {
    //   throw new InternalServerErrorException(
    //     'Ngày này đã được cancel rồi!',
    //   );
    // }
    let staffId = dayOff.staffId;
    let userInfo = await transactionManager
    .getRepository(UserInformation).findOne({
      where: { userId : staffId },
    });    
    await transactionManager.update(DayOff, 
      { uuid },
      {
        status: DayOffStatus.CANCEL,
        updatedAt: new Date(),
        isDeleted:true,
      })
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
        status: DayOffStatus.CANCEL,
        updatedAt: new Date(),
        approvedById: user.id,
        approvedAt: new Date(),
      })
    // Tăng số ngày phép
    if (dayOff.type == 1) {
      if (dayOff.time == 0) {
        userInfo.remain = userInfo.remain + 1;
      } else if((dayOff.time == 1 || dayOff.time == 2)) {
        userInfo.remain = userInfo.remain + 0.5
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
    
  async report(transactionManager: EntityManager) {
    try {
      const query = transactionManager
      .getRepository(DayOff)
      .createQueryBuilder('d')
      .leftJoin('d.staff', 'ui')
      .leftJoin('ui.team', 't')
      .select("d.staff_id, ui.last_name, t.name, ui.remain, sum(CASE WHEN type = 1 THEN time ELSE 0 END) as type_1,sum(CASE WHEN type=2 THEN time ELSE 0 END) as type_2")
      .groupBy("d.staff_id, ui.last_name, t.name, ui.remain")
      console.log(query.getQuery())
      // console.log(data);
  
    // Full text search
    const data = await query.execute();
      
    return data;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình lấy report',
      );
    }
  }
}
