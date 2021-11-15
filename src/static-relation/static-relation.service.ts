import { Injectable } from '@nestjs/common';
import { CreateStaticRelationDto } from './dto/create-static-relation.dto';
import { UpdateStaticRelationDto } from './dto/update-static-relation.dto';

@Injectable()
export class StaticRelationService {
  create(createStaticRelationDto: CreateStaticRelationDto) {
    return 'This action adds a new staticRelation';
  }

  findAll() {
    return `This action returns all staticRelation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staticRelation`;
  }

  update(id: number, updateStaticRelationDto: UpdateStaticRelationDto) {
    return `This action updates a #${id} staticRelation`;
  }

  remove(id: number) {
    return `This action removes a #${id} staticRelation`;
  }
}
