import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RecruitmentRepository } from './recruitment.repository';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentService } from './recruitment.service';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([RecruitmentRepository]),
        ConfigModule.forRoot({
          envFilePath: `env/${process.env.NODE_ENV || 'local'}.env`,
        }),
        EmailModule,
      ],
      controllers: [RecruitmentController],
      providers: [RecruitmentService]
})
export class RecruitmentModule {}