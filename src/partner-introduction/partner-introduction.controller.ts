import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartnerIntroductionService } from './partner-introduction.service';
import { CreatePartnerIntroductionDto } from './dto/create-partner-introduction.dto';

@Controller('partner-introduction')
export class PartnerIntroductionController {
  constructor(private readonly partnerIntroductionService: PartnerIntroductionService) {}

}
