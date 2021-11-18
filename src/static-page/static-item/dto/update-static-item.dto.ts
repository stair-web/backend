import { PartialType } from '@nestjs/swagger';
import { CreateStaticItemDto } from './create-static-item.dto';

export class UpdateStaticItemDto extends PartialType(CreateStaticItemDto) {}
