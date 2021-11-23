import { Module } from '@nestjs/common';
import { PartnerSectionItemService } from './partner-section-item.service';
import { PartnerSectionItemController } from './partner-section-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PartnerSectionItemRepository } from './partner.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnerSectionItemRepository]),
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'local'}.env`,
    }),
  ],
  controllers: [PartnerSectionItemController],
  providers: [PartnerSectionItemService]
})
export class PartnerSectionItemModule {}
