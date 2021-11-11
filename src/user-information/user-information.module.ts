import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInformationController } from './user-information.controller';
import { UserInformationRepository } from './user-information.repository';
import { UserInformationService } from './user-information.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInformationRepository]),
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'local'}.env`,
    }),
  ],
  controllers: [UserInformationController],
  providers: [UserInformationService]
})
export class UserInformationModule {}
