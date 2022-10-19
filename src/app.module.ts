import { DayoffModule } from './dayoff/dayoff.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobModule } from 'src/lib/cron-job/cron-job.module';
import { HealthController } from 'src/lib/health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { AwsModule } from 'src/lib/aws/aws.module';
import { AppGateway } from './app.gateway';
import { CustomerModule } from './customer/customer.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { TokenEmailModule } from './token-email/token-email.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RoleModule } from './role/role.module';
import { AppController } from './app.controller';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { TopicModule } from './topic/topic.module';
import { StaticItemModule } from './static-page/static-item/static-item.module';
import { UserInformationModule } from './user-information/user-information.module';
import { StaticSiteModule } from './static-page/static-site/static-site.module';
import { StaticSectionModule } from './static-page/static-section/static-section.module';
import { StaticRelationModule } from './static-page/static-relation/static-relation.module';
import { CandidateModule } from './candidate/candidate.module';
import { PartnerModule } from './partner/partner.module';
import { PartnerSectionItemModule } from './partner-section-item/partner-section-item.module';
import { PartnerIntroductionModule } from './partner-introduction/partner-introduction.module';
import { PartnerPartnershipModule } from './partner-partnership/partner-partnership.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { TeamModule } from './team/team.module';
import { RoomModule } from './room/room.module';
import { BookingRoomModule } from './booking-room/booking-room.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { UserLanguageModule } from './user-language/user-language.module';
@Module({
  imports: [
        DayoffModule, 
    PrometheusModule.register(),
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'local'}.env`,
    }),
    ScheduleModule.forRoot(),
    CronJobModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) =>
        ({
          type: configService.get<string>('TYPEORM_DATABASE_TYPE'),
          host: configService.get<string>('TYPEORM_DATABASE_HOST'),
          port: Number(configService.get<string>('TYPEORM_DATABASE_PORT')),
          username: configService.get<string>('TYPEORM_DATABASE_USERNAME'),
          password: configService.get<string>('TYPEORM_DATABASE_PASSWORD'),
          database: configService.get<string>('TYPEORM_DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: false,
          useUTC: false,
          uuidExtension: 'uuid-ossp',
          namingStrategy: new SnakeNamingStrategy(),
        } as TypeOrmModuleOptions),
    }),
    TerminusModule,
    AwsModule,
    CustomerModule,
    UserModule,
    EmailModule,
    TokenEmailModule,
    RoleModule,
    PostModule,
    CategoryModule,
    TopicModule,
    StaticSiteModule,
    StaticSectionModule,
    StaticItemModule,
    StaticRelationModule,
    UserInformationModule,
    CandidateModule,
    PartnerModule,
    PartnerSectionItemModule,
    PartnerIntroductionModule,
    PartnerPartnershipModule,
    TeamModule,
    RoomModule,
    BookingRoomModule,
    RecruitmentModule,
    UserLanguageModule
  ],
  controllers: [HealthController, AppController],
  providers: [AppGateway,
  ],
})
export class AppModule {}
