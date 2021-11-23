import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartnerSectionItemService } from './partner-section-item.service';
import { CreatePartnerSectionItemDto } from './dto/create-partner-section-item.dto';
import { UpdatePartnerSectionItemDto } from './dto/update-partner-section-item.dto';

@Controller('partner-section-item')
export class PartnerSectionItemController {
  constructor(private readonly partnerSectionItemService: PartnerSectionItemService) {}

}
