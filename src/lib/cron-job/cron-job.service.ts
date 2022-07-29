import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { userInfo } from 'os';
import { UserInformationRepository } from 'src/user-information/user-information.repository';
import { UserRepository } from 'src/user/user.repository';
import { EntityManager, EntityRepository, TransactionManager } from 'typeorm';

@Injectable()
export class CronJobService {
  constructor(private userInformationRepository: UserInformationRepository) {}

  private readonly logger = new Logger(CronJobService.name);

  @Cron(CronExpression.EVERY_YEAR, { timeZone: 'Singapore' })
  async CronExample() {
    this.logger.debug('CronExample run every Year');
    // if (!this.checkCronJobProcess()) { return; }
    // else {
    const listUserUpdate = await this.userInformationRepository
      .createQueryBuilder('userInformation')
      .leftJoin('userInformation.user', 'user')
      .select(['userInformation', 'user'])
      .where('user.isDeleted =false')
      .getMany();

    listUserUpdate.forEach((userInformation) => {
      if (userInformation.startDate) {
        let dayPlus = this.dateDiff(new Date(userInformation.startDate));
        userInformation.remain = 12 + dayPlus;
        this.userInformationRepository.save(userInformation);
      }
      // if (userInformation.startDate) {
      //   console.log('----');
      //   console.log(userInformation.id);
      //   console.log(userInformation.startDate);
      //   console.log(userInformation.remain);
      //   console.log('----');
      // }

      userInformation.remote_day_in_year = 0;
      userInformation.remote_remaining = `{"m01":2,"m02":2,"m03":2,"m04":2,"m05":2,"m06":2,"m07":2,"m08":2,"m09":2,"m10":2,"m11":2,"m12":2}`;

    });
    // }
    console.log('cron end');
  }
  @Cron(CronExpression.EVERY_DAY_AT_NOON, { timeZone: 'Singapore' })
  async CronExampleDay() {
    const today = new Date();

    this.logger.debug('CronExampleDay run every Day At noon');
    if (today.getMonth() != 0 && today.getDate() != 1) {
      return;
    } else {
      const listUserUpdate = await this.userInformationRepository
        .createQueryBuilder('userInformation')
        .leftJoin('userInformation.user', 'user')
        .select(['userInformation', 'user'])
        .where('user.isDeleted =false')
        .getMany();
      listUserUpdate.forEach((userInformation) => {
        if (userInformation.startDate) {
          const startDate = new Date(userInformation.startDate);
          if (
            today.getMonth() == startDate.getMonth() &&
            today.getDate() == startDate.getDate()
          ) {
            userInformation.remain = userInformation.remain + 1;
          }
          this.userInformationRepository.save(userInformation);
        }
      });
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON, {
    timeZone: 'Singapore',
  })
  async CronExampleMonth() {
    // const today = new Date();

    this.logger.debug(
      'CronExampleMonth run every Month in the first day at noon!',
    );

    const listUserUpdate = await this.userInformationRepository
      .createQueryBuilder('userInformation')
      .leftJoin('userInformation.user', 'user')
      .select(['userInformation', 'user'])
      // .select('*', 'user')
      // .where('user.isDeleted =false')
      .getMany();

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

    listUserUpdate.forEach((userInformation) => {
      let tempRemoteRemainInMonth = userInformation.remote_remaining;
      const remoteInAllMonth: AllRemoteInMonth = JSON.parse(
        JSON.stringify(tempRemoteRemainInMonth),
      );

      if (new Date().getMonth() + 1 === 1) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m01;
      } else if (new Date().getMonth() + 1 === 2) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m02;
      } else if (new Date().getMonth() + 1 === 3) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m03;
      } else if (new Date().getMonth() + 1 === 4) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m04;
      } else if (new Date().getMonth() + 1 === 5) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m05;
      } else if (new Date().getMonth() + 1 === 6) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m06;
      } else if (new Date().getMonth() + 1 === 7) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m07;
      } else if (new Date().getMonth() + 1 === 8) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m08;
      } else if (new Date().getMonth() + 1 === 9) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m09;
      } else if (new Date().getMonth() + 1 === 10) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m10;
      } else if (new Date().getMonth() + 1 === 11) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m11;
      } else if (new Date().getMonth() + 1 === 12) {
        userInformation.remote_remain_in_month = remoteInAllMonth.m12;
      }

      userInformation.remote_remaining = JSON.stringify(remoteInAllMonth);

      // userInformation.remote_remain_in_month = 2;

      this.userInformationRepository.save(userInformation);
    });
  }

  private checkCronJobProcess() {
    if (
      process.env.NODE_APP_INSTANCE === '0' ||
      process.env.NODE_APP_INSTANCE === null ||
      process.env.NODE_APP_INSTANCE === undefined
    ) {
      this.logger.debug(
        `CONTINUE JOB AT PROCESS ${process.env.NODE_APP_INSTANCE}`,
      );
      return true;
    } else {
      this.logger.debug(
        `CANCEL JOB AT PROCESS ${process.env.NODE_APP_INSTANCE}`,
      );
      return false;
    }
  }

  dateDiff(date) {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    console.log(yy);
    var years, months;
    // months
    months = month - mm;
    if (day < dd) {
      months = months - 1;
    }
    // years
    years = year - yy;
    if (month * 100 + day < mm * 100 + dd) {
      years = years - 1;
      months = months + 12;
    }
    return years;
  }
}
