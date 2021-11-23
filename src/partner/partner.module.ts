import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PartnerRepository } from './partner.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnerRepository]),
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'local'}.env`,
    }),
  ],
  controllers: [PartnerController],
  providers: [PartnerService]
})
export class PartnerModule {}
