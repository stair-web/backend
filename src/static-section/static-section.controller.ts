import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaticSectionService } from './static-section.service';
import { CreateStaticSectionDto } from './dto/create-static-section.dto';
import { UpdateStaticSectionDto } from './dto/update-static-section.dto';
import { Connection } from 'typeorm';

@Controller('static-section')
export class StaticSectionController {
  constructor(private readonly staticSectionService: StaticSectionService,
    private connection:Connection) {}
  @Post()
  async createStaticSite(@Body() createStaticSection: CreateStaticSectionDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.staticSectionService.createStaticSection(transactionManager, createStaticSection);
    });
  }
}
