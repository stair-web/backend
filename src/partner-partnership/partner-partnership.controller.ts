import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartnerPartnershipService } from './partner-partnership.service';
import { CreatePartnerPartnershipDto } from './dto/create-partner-partnership.dto';

@Controller('partner-partnership')
export class PartnerPartnershipController {
  constructor(private readonly partnerPartnershipService: PartnerPartnershipService) {}

}
