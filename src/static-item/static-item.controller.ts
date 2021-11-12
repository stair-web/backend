import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaticItemService } from './static-item.service';
import { CreateStaticItemDto } from './dto/create-static-item.dto';
import { UpdateStaticItemDto } from './dto/update-static-item.dto';

@Controller('static-item')
export class StaticItemController {
  constructor(private readonly staticItemService: StaticItemService) {}

}
