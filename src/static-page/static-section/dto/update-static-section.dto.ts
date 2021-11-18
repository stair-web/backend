import { PartialType } from '@nestjs/swagger';
import { CreateStaticSectionDto } from './create-static-section.dto';

export class UpdateStaticSectionDto extends PartialType(CreateStaticSectionDto) {}
