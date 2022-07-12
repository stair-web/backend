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
  getRepository,
  Not,
  Repository,
} from 'typeorm';
import { DayOff } from './dayoff.entity';
import { DayOffSearch } from './dto/dayoff-search.dto';
import { UpdateRemoteDay } from './dto/update-remote-day.dto';
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
import { JwtService } from '@nestjs/jwt';

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
      .select(['dayoff', 'staff', 't.name'])
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

  async updateRemoteDayAdminAll(
    transactionManager: EntityManager,
    updateRemoteDay: UpdateRemoteDay,
    // userInformation: UserInformation,
  ) {
    try {
      const findAll = await getRepository(UserInformation)
        .createQueryBuilder('userInformation')
        .getMany();
      // console.log(findAll);

      interface AllRemoteInMonth {
        m01: number;
        m02: number;
        m03: number;
        m04: number;
        m05: number;
        m06: number;
        m07: number;
        m08: number;
        m09: number;
        m10: number;
        m11: number;
        m12: number;
      }

      

      findAll.forEach(async (ele) => {
        // ele.remote_remain_in_month = updateRemoteDay.amount;
        // ele.remote_day_in_year = 0;

        let tempRemoteRemainInMonth = ele.remote_remaining;
        const remoteInAllMonth: AllRemoteInMonth = JSON.parse(
          JSON.stringify(tempRemoteRemainInMonth),
        );

        if (updateRemoteDay.month === 1) {
          remoteInAllMonth.m01 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 2) {
          remoteInAllMonth.m02 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 3) {
          remoteInAllMonth.m03 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 4) {
          remoteInAllMonth.m04 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 5) {
          remoteInAllMonth.m05 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 6) {
          remoteInAllMonth.m06 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 7) {
          remoteInAllMonth.m07 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 8) {
          remoteInAllMonth.m08 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 9) {
          remoteInAllMonth.m09 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 10) {
          remoteInAllMonth.m10 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 11) {
          remoteInAllMonth.m11 = updateRemoteDay.amount;
        } else if (updateRemoteDay.month === 12) {
          remoteInAllMonth.m12 = updateRemoteDay.amount;
        }

        if (new Date().getMonth() + 1 === 1) {
          ele.remote_remain_in_month = remoteInAllMonth.m01;
        } else if (new Date().getMonth() + 1 === 2) {
          ele.remote_remain_in_month = remoteInAllMonth.m02;
        } else if (new Date().getMonth() + 1 === 3) {
          ele.remote_remain_in_month = remoteInAllMonth.m03;
        } else if (new Date().getMonth() + 1 === 4) {
          ele.remote_remain_in_month = remoteInAllMonth.m04;
        } else if (new Date().getMonth() + 1 === 5) {
          ele.remote_remain_in_month = remoteInAllMonth.m05;
        } else if (new Date().getMonth() + 1 === 6) {
          ele.remote_remain_in_month = remoteInAllMonth.m06;
        } else if (new Date().getMonth() + 1 === 7) {
          ele.remote_remain_in_month = remoteInAllMonth.m07;
        } else if (new Date().getMonth() + 1 === 8) {
          ele.remote_remain_in_month = remoteInAllMonth.m08;
        } else if (new Date().getMonth() + 1 === 9) {
          ele.remote_remain_in_month = remoteInAllMonth.m09;
        } else if (new Date().getMonth() + 1 === 10) {
          ele.remote_remain_in_month = remoteInAllMonth.m10;
        } else if (new Date().getMonth() + 1 === 11) {
          ele.remote_remain_in_month = remoteInAllMonth.m11;
        } else if (new Date().getMonth() + 1 === 12) {
          ele.remote_remain_in_month = remoteInAllMonth.m12;
        }

        
        ele.remote_remaining = JSON.stringify(remoteInAllMonth);

        ele.save();
      });

      return {
        statusCode: 200,
        message: 'Update success',
        data: findAll,
      };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình cập nhật!',
      );
    }
  }

  async updateRemoteDayAdminOne(
    transactionManager: EntityManager,
    // userInformation: UserInformation,
    // user: User,
    updateRemoteDay: UpdateRemoteDay,
  ) {
    interface AllRemoteInMonth {
      m01: number;
      m02: number;
      m03: number;
      m04: number;
      m05: number;
      m06: number;
      m07: number;
      m08: number;
      m09: number;
      m10: number;
      m11: number;
      m12: number;
    }

    const findEmail = await getRepository(User).findOne({
      email: updateRemoteDay.email,
    });
    // console.log(findEmail);
    const findUserId = await getRepository(UserInformation).findOne({
      userId: findEmail.id,
    });
    // console.log(findUserId);
    // const remoteDayBefore = findUserId.remote_remain_in_month;

    // findUserId.remote_remain_in_month = updateRemoteDay.amount;

    let tempRemoteRemainInMonth = findUserId.remote_remaining;
    const remoteInAllMonth: AllRemoteInMonth = JSON.parse(
      JSON.stringify(tempRemoteRemainInMonth),
    );

    if (updateRemoteDay.month === 1) {
      remoteInAllMonth.m01 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 2) {
      remoteInAllMonth.m02 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 3) {
      remoteInAllMonth.m03 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 4) {
      remoteInAllMonth.m04 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 5) {
      remoteInAllMonth.m05 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 6) {
      remoteInAllMonth.m06 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 7) {
      remoteInAllMonth.m07 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 8) {
      remoteInAllMonth.m08 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 9) {
      remoteInAllMonth.m09 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 10) {
      remoteInAllMonth.m10 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 11) {
      remoteInAllMonth.m11 = updateRemoteDay.amount;
    } else if (updateRemoteDay.month === 12) {
      remoteInAllMonth.m12 = updateRemoteDay.amount;
    }

    if (new Date().getMonth() + 1 === 1) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m01;
    } else if (new Date().getMonth() + 1 === 2) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m02;
    } else if (new Date().getMonth() + 1 === 3) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m03;
    } else if (new Date().getMonth() + 1 === 4) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m04;
    } else if (new Date().getMonth() + 1 === 5) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m05;
    } else if (new Date().getMonth() + 1 === 6) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m06;
    } else if (new Date().getMonth() + 1 === 7) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m07;
    } else if (new Date().getMonth() + 1 === 8) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m08;
    } else if (new Date().getMonth() + 1 === 9) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m09;
    } else if (new Date().getMonth() + 1 === 10) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m10;
    } else if (new Date().getMonth() + 1 === 11) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m11;
    } else if (new Date().getMonth() + 1 === 12) {
      findUserId.remote_remain_in_month = remoteInAllMonth.m12;
    }

    findUserId.remote_remaining = JSON.stringify(remoteInAllMonth);
    
    try {
      const res = await findUserId.save();
      return res;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình update!',
      );
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
      .select(['dayoff', 'staff', 't'])
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

      interface AllRemoteInMonth {
        m01: number;
        m02: number;
        m03: number;
        m04: number;
        m05: number;
        m06: number;
        m07: number;
        m08: number;
        m09: number;
        m10: number;
        m11: number;
        m12: number;
      }

      let tempRemoteRemainInMonth = userInfo.remote_remaining;
      // console.log(tempRemoteRemainInMonth);
      const remoteInAllMonth: AllRemoteInMonth = JSON.parse(
        JSON.stringify(tempRemoteRemainInMonth),
      );
      // console.log(remoteInAllMonth.m01);
      // console.log(userInfo.remote_remaining);

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
            if (parseInt(ele.time) == 0) {
              if (isCurrentYear) {
                userInfo.remain = userInfo.remain - 1;
              } else {
                userInfo.dateOffNextYear = userInfo.dateOffNextYear + 1;
              }
            } else if (parseInt(ele.time) == 1 || parseInt(ele.time) == 2) {
              if (isCurrentYear) {
                userInfo.remain = userInfo.remain - 0.5;
              } else {
                userInfo.dateOffNextYear = userInfo.dateOffNextYear + 0.5;
              }
            }

            if (isCurrentYear) {
              if (userInfo.remain < 0 && type == 1) {
                throw new ConflictException(
                  'Remain Date cant be smaller than 0!',
                );
              }
            } else {
              if (userInfo.dateOffNextYear > 12 && type == 1) {
                throw new ConflictException(
                  'Remain Date cant be smaller than 0!',
                );
              }
            }
          }

          if (type == 3) {
            try {
              const isCurrentMonth =
                new Date().getMonth() == new Date(ele.date).getMonth();

              // console.log(new Date());
              // console.log(new Date().getMonth());
              // console.log(new Date(ele.date));
              // console.log(new Date(ele.date).getMonth());

              if (new Date(ele.date).getMonth() + 1 === 1) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m01;
              } else if (new Date(ele.date).getMonth() + 1 === 2) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m02;
              } else if (new Date(ele.date).getMonth() + 1 === 3) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m03;
              } else if (new Date(ele.date).getMonth() + 1 === 4) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m04;
              } else if (new Date(ele.date).getMonth() + 1 === 5) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m05;
              } else if (new Date(ele.date).getMonth() + 1 === 6) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m06;
              } else if (new Date(ele.date).getMonth() + 1 === 7) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m07;
              } else if (new Date(ele.date).getMonth() + 1 === 8) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m08;
              } else if (new Date(ele.date).getMonth() + 1 === 9) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m09;
              } else if (new Date(ele.date).getMonth() + 1 === 10) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m10;
              } else if (new Date(ele.date).getMonth() + 1 === 11) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m11;
              } else if (new Date(ele.date).getMonth() + 1 === 12) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m12;
              }

              // let checkRemain = userInfo.remote_remain_in_month;

              if (parseInt(ele.time) == 0) {
                // if (isCurrentMonth) {
                userInfo.remote_remain_in_month =
                  userInfo.remote_remain_in_month - 1;
                userInfo.remote_day_in_year += 1;
                // }
              } else if (parseInt(ele.time) == 1 || parseInt(ele.time) == 2) {
                // if (isCurrentMonth) {
                userInfo.remote_remain_in_month =
                  userInfo.remote_remain_in_month - 0.5;
                userInfo.remote_day_in_year += 0.5;
                // }
              }

              // if(isCurrentMonth){
              if (new Date(ele.date).getMonth() + 1 === 1) {
                remoteInAllMonth.m01 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 2) {
                remoteInAllMonth.m02 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 3) {
                remoteInAllMonth.m03 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 4) {
                remoteInAllMonth.m04 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 5) {
                remoteInAllMonth.m05 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 6) {
                remoteInAllMonth.m06 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 7) {
                remoteInAllMonth.m07 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 8) {
                remoteInAllMonth.m08 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 9) {
                remoteInAllMonth.m09 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 10) {
                remoteInAllMonth.m10 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 11) {
                remoteInAllMonth.m11 = userInfo.remote_remain_in_month;
              } else if (new Date(ele.date).getMonth() + 1 === 12) {
                remoteInAllMonth.m12 = userInfo.remote_remain_in_month;
              }

              // }

              if (new Date().getMonth() + 1 === 1) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m01;
              } else if (new Date().getMonth() + 1 === 2) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m02;
              } else if (new Date().getMonth() + 1 === 3) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m03;
              } else if (new Date().getMonth() + 1 === 4) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m04;
              } else if (new Date().getMonth() + 1 === 5) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m05;
              } else if (new Date().getMonth() + 1 === 6) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m06;
              } else if (new Date().getMonth() + 1 === 7) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m07;
              } else if (new Date().getMonth() + 1 === 8) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m08;
              } else if (new Date().getMonth() + 1 === 9) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m09;
              } else if (new Date().getMonth() + 1 === 10) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m10;
              } else if (new Date().getMonth() + 1 === 11) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m11;
              } else if (new Date().getMonth() + 1 === 12) {
                userInfo.remote_remain_in_month = remoteInAllMonth.m12;
              }

              // if (isCurrentMonth) {
              if (userInfo.remote_remain_in_month < 0) {
                throw Error(
                  'Remaining Remote Day In Month Cannot Be Smaller Than 0!',
                );
                // }
              }
            } catch (error) {
              if (error.status == 500) {
                throw new ConflictException({
                  data: {
                    remoteRemainInMonth: userInfo.remote_remain_in_month,
                  },
                  message:
                    'Remaining Remote Day In Month Cannot Be Smaller Than 0!',
                });
              }
              Logger.error(error);
              throw new InternalServerErrorException(
                'Lỗi hệ thống trong quá tình tạo ngày remote',
              );
            }

            // const isCurrentMonth =
            //   new Date().getMonth() == new Date(ele.date).getMonth();

            // // let checkRemain = userInfo.remote_remain_in_month;

            // if (parseInt(ele.time) == 0) {
            //   if (isCurrentMonth) {
            //     userInfo.remote_remain_in_month =
            //       userInfo.remote_remain_in_month - 1;
            //     userInfo.remote_day_in_year += 1;
            //   }
            // } else if (parseInt(ele.time) == 1 || parseInt(ele.time) == 2) {
            //   if (isCurrentMonth) {
            //     userInfo.remote_remain_in_month =
            //       userInfo.remote_remain_in_month - 0.5;
            //     userInfo.remote_day_in_year += 0.5;
            //   }
            // }

            // if (isCurrentMonth) {
            //   if (userInfo.remote_remain_in_month < 0) {
            //     throw new InternalServerErrorException(
            //       'Remaining Remote Day In Month Cannot Be Smaller Than 0!',
            //     );
            //     // return {
            //     //   statusCode: '400',
            //     //   messages: "Remaining Remote Day In Month Cannot Be Smaller Than 0!",
            //     // }
            //   }
            // }
          }

          userInfo.remote_remaining = JSON.stringify(remoteInAllMonth);

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
      const { staffId, type, reason, listDateOff, dateLeave } = dayOffSearch;
      const updateDate = new Date(listDateOff[0].date);
      const dayOffList = await transactionManager.getRepository(DayOff).find({
        staffId: staffId,
        dateLeave: updateDate,
        isDeleted: false,
      });
      const findDayOff = await transactionManager
        .getRepository(DayOff)
        .findOne({ uuid });
      if (isNullOrUndefined(findDayOff)) {
        throw new NotFoundException('Request not exist !');
      }
      const userInfo = await transactionManager
        .getRepository(UserInformation)
        .findOne({
          where: { userId: staffId },
        });

      interface AllRemoteInMonth {
        m01: number;
        m02: number;
        m03: number;
        m04: number;
        m05: number;
        m06: number;
        m07: number;
        m08: number;
        m09: number;
        m10: number;
        m11: number;
        m12: number;
      }

      let tempRemoteRemainInMonth = userInfo.remote_remaining;
      const remoteInAllMonth: AllRemoteInMonth = JSON.parse(
        JSON.stringify(tempRemoteRemainInMonth),
      );

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
      const currYear = new Date().getFullYear();
      const currMonth = new Date().getMonth();

      if (new Date(updateDate).getMonth() + 1 === 1) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m01;
      } else if (new Date(updateDate).getMonth() + 1 === 2) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m02;
      } else if (new Date(updateDate).getMonth() + 1 === 3) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m03;
      } else if (new Date(updateDate).getMonth() + 1 === 4) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m04;
      } else if (new Date(updateDate).getMonth() + 1 === 5) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m05;
      } else if (new Date(updateDate).getMonth() + 1 === 6) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m06;
      } else if (new Date(updateDate).getMonth() + 1 === 7) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m07;
      } else if (new Date(updateDate).getMonth() + 1 === 8) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m08;
      } else if (new Date(updateDate).getMonth() + 1 === 9) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m09;
      } else if (new Date(updateDate).getMonth() + 1 === 10) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m10;
      } else if (new Date(updateDate).getMonth() + 1 === 11) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m11;
      } else if (new Date(updateDate).getMonth() + 1 === 12) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m12;
      }

      if (
        findDayOff.time == 0 &&
        (listDateOff[0].time == 1 || listDateOff[0].time == 2)
      ) {
        //tăng remain
        if(findDayOff.type == 1){
          if (new Date(updateDate).getFullYear() == currYear) {
            userInfo.remain += 0.5;
          } else {
            userInfo.remain -= 0.5;
          }
        }
        if(findDayOff.type == 3){
          // if (
          //   new Date(updateDate).getMonth() == currMonth &&
          //   currMonth == new Date(dateLeave).getMonth()
          // ) {
            userInfo.remote_remain_in_month += 0.5;
            userInfo.remote_day_in_year -= 0.5;
          // } else {
          //   userInfo.remote_remain_in_month -= 0.5;
          //   userInfo.remote_day_in_year += 0.5;
          // }
        }
      } else if (listDateOff[0].time == 0 && findDayOff.time != 0) {
        //Giảm remain
        if (findDayOff.type == 1){
          if (
            new Date(updateDate).getFullYear() == currYear &&
            currMonth == new Date(dateLeave).getMonth()
          ) {
            userInfo.remain -= 0.5;
          } else {
            userInfo.remain += 0.5;
          }
        }
        if (findDayOff.type == 3){
          // if (new Date(updateDate).getMonth() == currMonth) {
            userInfo.remote_remain_in_month -= 0.5;
            userInfo.remote_day_in_year += 0.5;
          // } else {
          //   userInfo.remote_remain_in_month += 0.5;
          //   userInfo.remote_day_in_year -= 0.5;
          // }
        }
      }
      if (
        (userInfo.remain < 0 || userInfo.dateOffNextYear > 12) &&
        findDayOff.type == 1
      ) {
        throw new InternalServerErrorException(
          'Lỗi hệ thống trong quá tình tạo ngày nghỉ',
        );
      }
      if (userInfo.remote_remain_in_month < 0 && findDayOff.type == 3) {
        throw new InternalServerErrorException(
          'Lỗi hệ thống trong quá tình tạo ngày nghỉ',
        );
      }
      if (new Date(updateDate).getMonth() + 1 === 1) {
        remoteInAllMonth.m01 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 2) {
        remoteInAllMonth.m02 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 3) {
        remoteInAllMonth.m03 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 4) {
        remoteInAllMonth.m04 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 5) {
        remoteInAllMonth.m05 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 6) {
        remoteInAllMonth.m06 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 7) {
        remoteInAllMonth.m07 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 8) {
        remoteInAllMonth.m08 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 9) {
        remoteInAllMonth.m09 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 10) {
        remoteInAllMonth.m10 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 11) {
        remoteInAllMonth.m11 = userInfo.remote_remain_in_month;
      } else if (new Date(updateDate).getMonth() + 1 === 12) {
        remoteInAllMonth.m12 = userInfo.remote_remain_in_month;
      }

      if (new Date().getMonth() + 1 === 1) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m01;
      } else if (new Date().getMonth() + 1 === 2) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m02;
      } else if (new Date().getMonth() + 1 === 3) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m03;
      } else if (new Date().getMonth() + 1 === 4) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m04;
      } else if (new Date().getMonth() + 1 === 5) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m05;
      } else if (new Date().getMonth() + 1 === 6) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m06;
      } else if (new Date().getMonth() + 1 === 7) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m07;
      } else if (new Date().getMonth() + 1 === 8) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m08;
      } else if (new Date().getMonth() + 1 === 9) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m09;
      } else if (new Date().getMonth() + 1 === 10) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m10;
      } else if (new Date().getMonth() + 1 === 11) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m11;
      } else if (new Date().getMonth() + 1 === 12) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m12;
      }

      userInfo.remote_remaining = JSON.stringify(remoteInAllMonth);

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
            timeNumber: type != 3 ? (ele.time == 0 ? 1 : 0.5) : 0,
            remoteNumber: type == 3 ? (ele.time == 0 ? 1 : 0.5) : 0,
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

      interface AllRemoteInMonth {
        m01: number;
        m02: number;
        m03: number;
        m04: number;
        m05: number;
        m06: number;
        m07: number;
        m08: number;
        m09: number;
        m10: number;
        m11: number;
        m12: number;
      }

      let tempRemoteRemainInMonth = userInfo.remote_remaining;
      const remoteInAllMonth: AllRemoteInMonth = JSON.parse(
        JSON.stringify(tempRemoteRemainInMonth),
      );

      if (new Date(dayOff.dateLeave).getMonth() + 1 === 1) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m01;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 2) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m02;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 3) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m03;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 4) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m04;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 5) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m05;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 6) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m06;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 7) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m07;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 8) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m08;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 9) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m09;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 10) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m10;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 11) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m11;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 12) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m12;
      }

      // Tăng số ngày phép
      if (dayOff.type == 1) {
        const isCurrentYear =
          new Date().getFullYear() == new Date(dayOff.dateLeave).getFullYear();
        // console.log(new Date().getFullYear());
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

      if (dayOff.type == 3) {
        const isCurrentMonth =
          new Date().getMonth() == new Date(dayOff.dateLeave).getMonth();

        if (dayOff.time == 0) {
          // if (isCurrentMonth) {
            userInfo.remote_remain_in_month =
              userInfo.remote_remain_in_month + 1;
            userInfo.remote_day_in_year -= 1;
          // }
        } else {
          // if (isCurrentMonth) {
            userInfo.remote_remain_in_month += 0.5;
            userInfo.remote_day_in_year -= 0.5;
          // }
        }

        if (new Date(dayOff.dateLeave).getMonth() + 1 === 1) {
          remoteInAllMonth.m01 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 2) {
          remoteInAllMonth.m02 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 3) {
          remoteInAllMonth.m03 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 4) {
          remoteInAllMonth.m04 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 5) {
          remoteInAllMonth.m05 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 6) {
          remoteInAllMonth.m06 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 7) {
          remoteInAllMonth.m07 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 8) {
          remoteInAllMonth.m08 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 9) {
          remoteInAllMonth.m09 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 10) {
          remoteInAllMonth.m10 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 11) {
          remoteInAllMonth.m11 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 12) {
          remoteInAllMonth.m12 = userInfo.remote_remain_in_month;
        }

        if (new Date().getMonth() + 1 === 1) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m01;
        } else if (new Date().getMonth() + 1 === 2) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m02;
        } else if (new Date().getMonth() + 1 === 3) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m03;
        } else if (new Date().getMonth() + 1 === 4) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m04;
        } else if (new Date().getMonth() + 1 === 5) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m05;
        } else if (new Date().getMonth() + 1 === 6) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m06;
        } else if (new Date().getMonth() + 1 === 7) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m07;
        } else if (new Date().getMonth() + 1 === 8) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m08;
        } else if (new Date().getMonth() + 1 === 9) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m09;
        } else if (new Date().getMonth() + 1 === 10) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m10;
        } else if (new Date().getMonth() + 1 === 11) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m11;
        } else if (new Date().getMonth() + 1 === 12) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m12;
        }

      }

      userInfo.remote_remaining = JSON.stringify(remoteInAllMonth);

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

      interface AllRemoteInMonth {
        m01: number;
        m02: number;
        m03: number;
        m04: number;
        m05: number;
        m06: number;
        m07: number;
        m08: number;
        m09: number;
        m10: number;
        m11: number;
        m12: number;
      }

      let tempRemoteRemainInMonth = userInfo.remote_remaining;
      const remoteInAllMonth: AllRemoteInMonth = JSON.parse(
        JSON.stringify(tempRemoteRemainInMonth),
      );

      if (new Date(dayOff.dateLeave).getMonth() + 1 === 1) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m01;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 2) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m02;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 3) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m03;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 4) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m04;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 5) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m05;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 6) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m06;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 7) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m07;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 8) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m08;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 9) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m09;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 10) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m10;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 11) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m11;
      } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 12) {
        userInfo.remote_remain_in_month = remoteInAllMonth.m12;
      }

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
      if (dayOff.type == 3) {
        const isCurrentMonth =
          new Date().getMonth() == new Date(dayOff.dateLeave).getMonth();

        if (dayOff.time == 0) {
          // if (isCurrentMonth) {
            userInfo.remote_remain_in_month =
              userInfo.remote_remain_in_month + 1;
            userInfo.remote_day_in_year -= 1;
          // }
        } else {
          // if (isCurrentMonth) {
            userInfo.remote_remain_in_month += 0.5;
            userInfo.remote_day_in_year -= 0.5;
          // }
        }

        if (new Date(dayOff.dateLeave).getMonth() + 1 === 1) {
          remoteInAllMonth.m01 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 2) {
          remoteInAllMonth.m02 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 3) {
          remoteInAllMonth.m03 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 4) {
          remoteInAllMonth.m04 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 5) {
          remoteInAllMonth.m05 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 6) {
          remoteInAllMonth.m06 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 7) {
          remoteInAllMonth.m07 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 8) {
          remoteInAllMonth.m08 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 9) {
          remoteInAllMonth.m09 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 10) {
          remoteInAllMonth.m10 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 11) {
          remoteInAllMonth.m11 = userInfo.remote_remain_in_month;
        } else if (new Date(dayOff.dateLeave).getMonth() + 1 === 12) {
          remoteInAllMonth.m12 = userInfo.remote_remain_in_month;
        }

        if (new Date().getMonth() + 1 === 1) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m01;
        } else if (new Date().getMonth() + 1 === 2) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m02;
        } else if (new Date().getMonth() + 1 === 3) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m03;
        } else if (new Date().getMonth() + 1 === 4) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m04;
        } else if (new Date().getMonth() + 1 === 5) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m05;
        } else if (new Date().getMonth() + 1 === 6) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m06;
        } else if (new Date().getMonth() + 1 === 7) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m07;
        } else if (new Date().getMonth() + 1 === 8) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m08;
        } else if (new Date().getMonth() + 1 === 9) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m09;
        } else if (new Date().getMonth() + 1 === 10) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m10;
        } else if (new Date().getMonth() + 1 === 11) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m11;
        } else if (new Date().getMonth() + 1 === 12) {
          userInfo.remote_remain_in_month = remoteInAllMonth.m12;
        }
      }

      userInfo.remote_remaining = JSON.stringify(remoteInAllMonth);

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
          'd.staff_id, ui.last_name, t.name as team, ui.remain, ui.remote_remain_in_month, ui.remote_day_in_year, sum(CASE WHEN type = 1 THEN time_number ELSE 0 END) as type_1,sum(CASE WHEN type=2 THEN time_number ELSE 0 END) as type_2',
        )
        .groupBy(
          'd.staff_id, ui.last_name, t.name, ui.remain, ui.remote_remain_in_month, ui.remote_day_in_year',
        )
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
