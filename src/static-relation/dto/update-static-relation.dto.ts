import { PartialType } from '@nestjs/swagger';
import { CreateStaticRelationDto } from './create-static-relation.dto';

export class UpdateStaticRelationDto extends PartialType(CreateStaticRelationDto) {}
