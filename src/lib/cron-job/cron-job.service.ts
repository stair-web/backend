import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserInformationRepository } from 'src/user-information/user-information.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class CronJobService {

    constructor(
      private userInformationRepository: UserInformationRepository
    ) {}

    private readonly logger = new Logger(CronJobService.name);

    @Cron(CronExpression.EVERY_YEAR, { timeZone: 'Singapore' })
    async CronExample() {
      this.logger.debug('CronExample run every 12:00 AM');
      // if (!this.checkCronJobProcess()) { return; }
      // else {
        const listUserUpdate = await this.userInformationRepository.
        createQueryBuilder("userInformation")
        .leftJoin('userInformation.user', 'user')
        .select(['userInformation', 'user'])
        .where('user.isDeleted =false')
        .getMany();

        listUserUpdate.forEach(userInformation => {
          if(userInformation.startDate){
            let dayPlus = this.dateDiff(new Date(userInformation.startDate));
            userInformation.remain = 12 + dayPlus -1;
            this.userInformationRepository.save(userInformation);
          }
        });
      // }

    }
    @Cron(CronExpression.EVERY_DAY_AT_NOON, { timeZone: 'Singapore' })
    async CronExampleDay() {
      this.logger.debug('CronExampleDay run every 10:00 AM');
      // if (!this.checkCronJobProcess()) { return; }
      // else {
        const listUserUpdate = await this.userInformationRepository.
        createQueryBuilder("userInformation")
        .leftJoin('userInformation.user', 'user')
        .select(['userInformation', 'user'])
        .where('user.isDeleted =false')
        .getMany();
        const today = new Date();
        listUserUpdate.forEach(userInformation => {
          if(userInformation.startDate){
            const startDate = new Date(userInformation.startDate)
            if(today.getMonth() == startDate.getMonth() && today.getDate()== startDate.getDate()){
              userInformation.remain =  userInformation.remain + 1;
            }
            this.userInformationRepository.save(userInformation);
          }
          
        });
      // }

    }

    private checkCronJobProcess() {
        if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === null || process.env.NODE_APP_INSTANCE === undefined) {
          this.logger.debug(`CONTINUE JOB AT PROCESS ${process.env.NODE_APP_INSTANCE}`);
          return true;
        } else {
          this.logger.debug(`CANCEL JOB AT PROCESS ${process.env.NODE_APP_INSTANCE}`);
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
      console.log(yy)
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
      return years
  }
}
