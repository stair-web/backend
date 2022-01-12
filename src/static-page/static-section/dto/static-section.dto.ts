import { ApiProperty } from '@nestjs/swagger';
import { isNullOrUndefined } from 'src/common/utils/common.util';
import { StaticItemDto } from 'src/static-page/static-item/dto/static-item.dto';

export class StaticSectionDto {

  id?: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;
  
  @ApiProperty()
  language: string;

  @ApiProperty()
  items: StaticItemDto[];
}
