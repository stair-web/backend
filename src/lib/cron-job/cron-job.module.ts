import { Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { CronJobController } from './cron-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInformationRepository } from 'src/user-information/user-information.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInformationRepository]),
  ],
  providers: [CronJobService],
  controllers: [CronJobController]
})
export class CronJobModule {}
