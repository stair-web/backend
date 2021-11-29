import { Module } from '@nestjs/common';
import { PartnerPartnershipService } from './partner-partnership.service';
import { PartnerPartnershipController } from './partner-partnership.controller';

@Module({
  controllers: [PartnerPartnershipController],
  providers: [PartnerPartnershipService]
})
export class PartnerPartnershipModule {}
