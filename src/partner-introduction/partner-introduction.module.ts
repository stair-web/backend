import { Module } from '@nestjs/common';
import { PartnerIntroductionService } from './partner-introduction.service';
import { PartnerIntroductionController } from './partner-introduction.controller';

@Module({
  controllers: [PartnerIntroductionController],
  providers: [PartnerIntroductionService]
})
export class PartnerIntroductionModule {}
