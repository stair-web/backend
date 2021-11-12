import { PartialType } from '@nestjs/swagger';
import { CreateStaticSiteDto } from './create-static-site.dto';

export class UpdateStaticSiteDto extends PartialType(CreateStaticSiteDto) {}
