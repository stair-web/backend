import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaticRelationService } from './static-relation.service';
import { CreateStaticRelationDto } from './dto/create-static-relation.dto';
import { UpdateStaticRelationDto } from './dto/update-static-relation.dto';

@Controller('static-relation')
export class StaticRelationController {
  constructor(private readonly staticRelationService: StaticRelationService) {}

  @Post()
  create(@Body() createStaticRelationDto: CreateStaticRelationDto) {
    return this.staticRelationService.create(createStaticRelationDto);
  }

  @Get()
  findAll() {
    return this.staticRelationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staticRelationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaticRelationDto: UpdateStaticRelationDto) {
    return this.staticRelationService.update(+id, updateStaticRelationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staticRelationService.remove(+id);
  }
}
