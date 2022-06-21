/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { UserInformation } from 'src/user-information/user-information.entity';
import { User } from 'src/user/user.entity';
import { EntityManager } from 'typeorm';
import { DayOff } from './dayoff.entity';
import { DayoffRepository } from './dayoff.repository';
import { DayOffSearch } from './dto/dayoff-search.dto';
import { UpdateRemoteDay } from './dto/update-remote-day.dto';

@Injectable()
export class DayoffService {
  constructor(private dayoffRepository: DayoffRepository) {}

  async getAllDayOffAdmin(
    transactionManager: EntityManager,
    dayOffSearch: DayOffSearch,
  ) {
    return this.dayoffRepository.getAllDayOffAdmin(
      transactionManager,
      dayOffSearch,
    );
  }

  async updateRemoteDayAdminAll(
    transactionManager: EntityManager,
    // dayOffSearch: DayOffSearch,
    // user: User,
    // userInformation: UserInformation,
    updateRemoteDay: UpdateRemoteDay,
  ){
    // const updateRemoteDayy = transactionManager.update(UserInformation,{remote_remain_in_month},)
    return this.dayoffRepository.updateRemoteDayAdminAll(
      transactionManager,
      updateRemoteDay,
      // dayOffSearch,
      // user,
      // userInformation,
    );
  }

  async updateRemoteDayAdminOne(
    transactionManager: EntityManager,
    updateRemoteDay: UpdateRemoteDay,
    // dayOffSearch: DayOffSearch,
    // user: User,
    // email: string,
    // amount: number,
    // userInformation: UserInformation,
  ){
    return this.dayoffRepository.updateRemoteDayAdminOne(
      transactionManager,
      updateRemoteDay,
      // dayOffSearch,
      // email,
      // amount,
      // user,
      // userInformation,
    );
  }

  async getAllDayOffStaff(
    transactionManager: EntityManager,
    dayOffSearch: DayOffSearch,
    user: User,
  ) {
    return this.dayoffRepository.getAllDayOffStaff(
      transactionManager,
      dayOffSearch,
      user,
    );
  }

  async getDetailDayOff(transactionManager: EntityManager, uuid: string) {
    const dayOff = await transactionManager.getRepository(DayOff).findOne({
      join: {
        alias: 'dayoff',
        leftJoinAndSelect: {
          staff: 'dayoff.staff',
        },
      },
      relations: ['staff'],
      where: (qb) => {
        qb.select([
          'dayoff.id',
          'dayoff.uuid',
          'dayoff.dateLeave',
          'dayoff.time',
          'dayoff.type',
          'dayoff.status',
          'dayoff.reason',
          'dayoff.updatedAt',
          'dayoff.createdAt',
          'dayoff.approvedById',
          'dayoff.approvedAt',
          'staff.uuid',
          'staff.firstName',
          'staff.lastName',
          'staff.startingDate',
          'staff.dob',
          'staff.phoneNumber',
          'staff.shortDescription',
          'staff.position',
          'staff.profilePhotoKey',
          'staff.remain',
        ]).where(`dayoff.uuid = :uuid and staff.isDeleted = false`, { uuid });
      },
    });

    return dayOff;
  }

  async updateDayOff(
    transactionManager: EntityManager,
    dayOffSearch: DayOffSearch,
    uuid: string,
  ) {
    return this.dayoffRepository.updateDayOff(
      transactionManager,
      dayOffSearch,
      uuid,
    );
  }

  async createDayOff(
    transactionManager: EntityManager,
    dayOffSearch: DayOffSearch,
  ) {
    return this.dayoffRepository.createDayOff(transactionManager, dayOffSearch);
  }

  async approve(transactionManager: EntityManager, user: User, uuid: string) {
    return this.dayoffRepository.approveDayOff(transactionManager, user, uuid);
  }

  async reject(transactionManager: EntityManager, user: User, uuid: string) {
    return this.dayoffRepository.rejectDayOff(transactionManager, user, uuid);
  }

  async delete(transactionManager: EntityManager, user: User, uuid: string) {
    return this.dayoffRepository.deleteDayoff(transactionManager, user, uuid);
  }

  async report(
    transactionManager: EntityManager,
    fromDate: Date,
    toDate: Date,
  ) {
    return this.dayoffRepository.report(transactionManager, fromDate, toDate);
  }
}
